import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST() {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured" },
        { status: 500 }
      );
    }

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "User must be authenticated" },
        { status: 401 }
      );
    }

    // Get user from Clerk to retrieve Stripe customer ID
    const user = await (await clerkClient()).users.getUser(userId);
    const metadata = user.publicMetadata as Record<string, unknown>;
    const stripeCustomerId = metadata?.stripeCustomerId as string;

    if (!stripeCustomerId) {
      return NextResponse.json(
        {
          error:
            "No active subscription found. Please subscribe to access billing management.",
        },
        { status: 400 }
      );
    }

    // Development bypass for invalid test customer IDs
    if (
      process.env.NODE_ENV === "development" &&
      stripeCustomerId.includes("test_dev")
    ) {
      console.log(
        "[create-portal-session] Development bypass: simulating portal access"
      );
      // Return a fake success that redirects back to settings with a message
      const returnUrl = `http://localhost:3000/dashboard/settings?dev_portal=true`;
      return NextResponse.json({ url: returnUrl });
    }

    // Ensure we have a return URL
    const returnUrl = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`
      : `${
          process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : "http://localhost:3000"
        }/dashboard/settings`;

    // Create Stripe portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("[create-portal-session] Error:", errorMessage);

    // Handle specific Stripe errors
    if (
      error &&
      typeof error === "object" &&
      "type" in error &&
      "code" in error
    ) {
      const stripeError = error as { type: string; code: string };
      if (
        stripeError.type === "StripeInvalidRequestError" &&
        stripeError.code === "resource_missing"
      ) {
        // Development bypass for invalid customer IDs
        if (process.env.NODE_ENV === "development") {
          console.log(
            "[create-portal-session] Development bypass: invalid customer ID, simulating portal"
          );
          const returnUrl = `http://localhost:3000/dashboard/settings?dev_portal=true`;
          return NextResponse.json({ url: returnUrl });
        }

        return NextResponse.json(
          {
            error:
              "Invalid subscription data. Please contact support if this persists.",
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
