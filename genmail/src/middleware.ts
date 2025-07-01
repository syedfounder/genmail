import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

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

    // Check for pro status - use same logic as subscription library
    const metadata = sessionClaims?.publicMetadata as PublicMetadata;
    const isPro =
      metadata?.isPro === true ||
      (metadata?.subscriptionTier === "premium" &&
        metadata?.subscriptionStatus === "active");

    // Development override - bypass subscription check with cookie
    const cookies = req.headers.get("cookie") || "";
    const isDevOverride =
      cookies.includes("dev_pro_override=true") &&
      process.env.NODE_ENV === "development";

    // Production: Allow temporary access after Stripe checkout while webhook processes
    const url = new URL(req.url);
    const isPaymentSuccess = url.searchParams.get("payment_success") === "true";
    const isCheckoutSuccess = url.searchParams.get("success") === "true"; // Stripe default parameter
    const hasPaymentParams = isPaymentSuccess || isCheckoutSuccess;

    // Debug logging (remove in production)
    if (req.url.includes("/dashboard")) {
      console.log("[MIDDLEWARE DEBUG]", {
        userId,
        metadata,
        isPro,
        isDevOverride,
        hasPaymentParams,
        url: req.url,
      });
    }

    if (!isPro && !isDevOverride && !hasPaymentParams) {
      // User is not a pro member, redirect to pricing page
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
