import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  publicRoutes: [
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/login",
    "/signup",
    "/contact",
    "/help",
    "/pricing",
    "/privacy",
    "/security",
    "/terms",
    "/api(.*)", // Make all API routes public; auth is handled in each route
  ],
});

export const config = {
  // Protect all routes including api/trpc routes
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
