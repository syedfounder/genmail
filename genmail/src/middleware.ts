import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

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
  const { userId, sessionClaims } = auth();

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

    // Check for pro status
    const isPro = sessionClaims?.publicMetadata?.isPro === true;

    if (!isPro) {
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
