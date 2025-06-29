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
        { error: "No active subscription found" },
        { status: 400 }
      );
    }

    // Create Stripe portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Error creating portal session:", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
