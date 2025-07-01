import { useUser } from "@clerk/nextjs";

export interface SubscriptionData {
  subscriptionStatus: string | null;
  subscriptionTier: "free" | "premium";
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}

export function useSubscription(): SubscriptionData {
  const { user } = useUser();

  if (!user) {
    return {
      subscriptionStatus: null,
      subscriptionTier: "free",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
    };
  }

  const metadata = user.publicMetadata as Record<string, unknown>;

  return {
    subscriptionStatus: (metadata?.subscriptionStatus as string) || null,
    subscriptionTier:
      (metadata?.subscriptionTier as "free" | "premium") || "free",
    stripeCustomerId: (metadata?.stripeCustomerId as string) || null,
    stripeSubscriptionId: (metadata?.stripeSubscriptionId as string) || null,
  };
}

export function isPremiumUser(subscription: SubscriptionData): boolean {
  return (
    subscription.subscriptionTier === "premium" &&
    subscription.subscriptionStatus === "active"
  );
}

export const createCheckoutSession = async (priceId: string) => {
  if (!priceId) {
    throw new Error("Price ID is required to create a checkout session.");
  }

  try {
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        priceId,
        successUrl: `${window.location.origin}/dashboard?payment_success=true`,
        cancelUrl: `${window.location.origin}/pricing?canceled=true`,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      const errorMessage =
        errorBody.details || "Failed to create checkout session";
      throw new Error(errorMessage);
    }

    const { url } = await response.json();

    if (url) {
      window.location.href = url;
    }
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
};
