import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe";
import { supabaseServiceClient } from "@/lib/supabaseClient";
import { clerkClient } from "@clerk/nextjs/server";
import Stripe from "stripe";

const webhookSecret = STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    if (!stripe || !STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "Stripe webhook is not configured" },
        { status: 500 }
      );
    }

    const body = await request.text();
    const signature = (await headers()).get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No stripe signature found" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    console.log("Processing Stripe webhook event:", event.type);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCanceled(subscription);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.userId;

  if (!userId) {
    console.error("No userId found in checkout session metadata");
    return;
  }

  try {
    // Update user's subscription status in Clerk
    await (
      await clerkClient()
    ).users.updateUserMetadata(userId, {
      publicMetadata: {
        subscriptionStatus: "active",
        subscriptionTier: "premium",
        isPro: true,
        stripeCustomerId: session.customer,
        stripeSubscriptionId: session.subscription,
      },
    });

    // Update all user's inboxes to premium tier
    if (supabaseServiceClient) {
      await supabaseServiceClient
        .from("inboxes")
        .update({ subscription_tier: "premium" })
        .eq("user_id", userId);
    }

    console.log(`Successfully upgraded user ${userId} to premium`);
  } catch (error) {
    console.error("Error handling checkout completion:", error);
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.error("No userId found in subscription metadata");
    return;
  }

  try {
    const isActive = subscription.status === "active";
    const subscriptionTier = isActive ? "premium" : "free";

    // Update user metadata in Clerk
    await (
      await clerkClient()
    ).users.updateUserMetadata(userId, {
      publicMetadata: {
        subscriptionStatus: subscription.status,
        subscriptionTier,
        isPro: isActive,
        stripeCustomerId: subscription.customer,
        stripeSubscriptionId: subscription.id,
      },
    });

    // Update user's inboxes
    if (supabaseServiceClient) {
      await supabaseServiceClient
        .from("inboxes")
        .update({ subscription_tier: subscriptionTier })
        .eq("user_id", userId);
    }

    console.log(
      `Updated subscription for user ${userId}: ${subscription.status}`
    );
  } catch (error) {
    console.error("Error handling subscription change:", error);
  }
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.error("No userId found in canceled subscription metadata");
    return;
  }

  try {
    // Update user metadata in Clerk
    await (
      await clerkClient()
    ).users.updateUserMetadata(userId, {
      publicMetadata: {
        subscriptionStatus: "canceled",
        subscriptionTier: "free",
        isPro: false,
        stripeCustomerId: subscription.customer,
        stripeSubscriptionId: null,
      },
    });

    // Downgrade user's inboxes to free tier
    if (supabaseServiceClient) {
      await supabaseServiceClient
        .from("inboxes")
        .update({ subscription_tier: "free" })
        .eq("user_id", userId);
    }

    console.log(`Downgraded user ${userId} to free tier`);
  } catch (error) {
    console.error("Error handling subscription cancellation:", error);
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log(`Payment succeeded for invoice: ${invoice.id}`);
  // You can add additional logic here if needed
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log(`Payment failed for invoice: ${invoice.id}`);
  // You can add logic here to handle failed payments (e.g., send notification)
}
