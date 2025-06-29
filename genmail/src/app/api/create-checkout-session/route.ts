import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { stripe, STRIPE_CONFIG } from "@/lib/stripe";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  console.log("🚀 Starting checkout session creation...");

  try {
    // Check if Stripe is configured
    console.log("📋 Checking Stripe configuration...");
    if (!stripe) {
      console.error("❌ Stripe is not configured");
      return NextResponse.json(
        { error: "Stripe is not configured" },
        { status: 500 }
      );
    }

    // Check authentication
    console.log("🔐 Checking authentication...");
    const user = await currentUser();

    if (!user) {
      console.error("❌ User not authenticated");
      return NextResponse.json(
        { error: "User must be authenticated" },
        { status: 401 }
      );
    }

    const userId = user.id;
    const stripeCustomerId = user.publicMetadata?.stripeCustomerId as
      | string
      | undefined;
    console.log("- User ID:", userId);
    console.log("- Stripe Customer ID:", stripeCustomerId || "NOT_FOUND");

    // Parse request body
    console.log("📝 Parsing request body...");
    const body = await request.json();
    const { priceId, successUrl, cancelUrl } = body;
    console.log("- Request body:", { priceId, successUrl, cancelUrl });

    if (!priceId) {
      console.error("❌ Price ID is missing from request body");
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      );
    }

    // Create checkout session
    console.log("💳 Creating Stripe checkout session...");
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      payment_method_types: STRIPE_CONFIG.payment_method_types,
      billing_address_collection: STRIPE_CONFIG.billing_address_collection,
      allow_promotion_codes: STRIPE_CONFIG.allow_promotion_codes,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
      success_url:
        successUrl ||
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      // This is the crucial part that was missing.
      // It ensures the subscription object created by Stripe
      // will have the userId in its metadata.
      subscription_data: {
        metadata: {
          userId,
        },
      },
    };

    if (stripeCustomerId) {
      console.log("👤 Existing customer found. Using customer ID.");
      sessionParams.customer = stripeCustomerId;
      sessionParams.customer_update = {
        address: "auto",
        name: "auto",
      };
    } else {
      console.log("✨ New customer. Providing email address.");
      const primaryEmail = user.emailAddresses.find(
        (e) => e.id === user.primaryEmailAddressId
      )?.emailAddress;

      if (primaryEmail) {
        sessionParams.customer_email = primaryEmail;
      } else {
        console.error("❌ Could not find a primary email for the user.");
        return NextResponse.json(
          { error: "User has no primary email address" },
          { status: 400 }
        );
      }
    }

    console.log("- Session params:", JSON.stringify(sessionParams, null, 2));

    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log("✅ Checkout session created successfully:", session.id);
    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("❌ Error creating checkout session:");
    console.error(
      "- Error message:",
      error instanceof Error ? error.message : String(error)
    );
    console.error(
      "- Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    console.error("- Full error object:", error);

    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
