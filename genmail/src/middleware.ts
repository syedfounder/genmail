import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";

interface PublicMetadata {
  isPro?: boolean;
  subscriptionTier?: "free" | "premium";
  subscriptionStatus?: string;
}

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/api/deleteAccount",
  "/api/deleteInbox",
  "/api/downloadEmail",
  "/api/exportData",
  "/api/verifyInboxPassword",
]);

const isPublicRoute = createRouteMatcher(["/login", "/signup"]);

async function getFreshUserMetadata(
  userId: string
): Promise<PublicMetadata | null> {
  try {
    const user = await (await clerkClient()).users.getUser(userId);
    return user.publicMetadata as PublicMetadata;
  } catch (error) {
    console.error("Error fetching fresh user metadata:", error);
    return null;
  }
}

function isUserPro(metadata: PublicMetadata | null): boolean {
  if (!metadata) return false;

  return (
    metadata.isPro === true ||
    (metadata.subscriptionTier === "premium" &&
      metadata.subscriptionStatus === "active")
  );
}

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // If the user is logged in and tries to access a public route, redirect them to the dashboard
  if (userId && isPublicRoute(req)) {
    const dashboardUrl = new URL("/dashboard", req.url);
    return Response.redirect(dashboardUrl);
  }

  if (isProtectedRoute(req)) {
    if (!userId) {
      // User is not authenticated, redirect to login
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect_url", req.url);
      return Response.redirect(loginUrl);
    }

    // Development override - bypass subscription check with cookie
    const cookies = req.headers.get("cookie") || "";
    const isDevOverride =
      cookies.includes("dev_pro_override=true") &&
      process.env.NODE_ENV === "development";

    if (isDevOverride) {
      return; // Allow access in development mode
    }

    // Check cached session metadata first (fast path)
    const cachedMetadata = sessionClaims?.publicMetadata as PublicMetadata;
    let isPro = isUserPro(cachedMetadata);

    // If user appears to be free tier from cached data, verify with fresh data
    // This solves the session token refresh lag issue permanently
    if (!isPro) {
      console.log(
        `[MIDDLEWARE] User ${userId} appears free in cache, checking fresh data...`
      );

      const freshMetadata = await getFreshUserMetadata(userId);
      isPro = isUserPro(freshMetadata);

      if (isPro) {
        console.log(
          `[MIDDLEWARE] User ${userId} is actually Pro - cached session outdated`
        );
      }
    }

    // Production: Allow temporary access after Stripe checkout while webhook processes
    const url = new URL(req.url);
    const isPaymentSuccess = url.searchParams.get("payment_success") === "true";
    const isCheckoutSuccess = url.searchParams.get("success") === "true";
    const hasPaymentParams = isPaymentSuccess || isCheckoutSuccess;

    // Debug logging for dashboard routes
    if (req.url.includes("/dashboard")) {
      console.log("[MIDDLEWARE DEBUG]", {
        userId,
        cachedMetadata,
        isPro,
        hasPaymentParams,
        url: req.url,
      });
    }

    if (!isPro && !hasPaymentParams) {
      // User is not a pro member, redirect to pricing page
      console.log(
        `[MIDDLEWARE] Redirecting user ${userId} to pricing - not Pro`
      );
      const pricingUrl = new URL("/pricing", req.url);
      return Response.redirect(pricingUrl);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
