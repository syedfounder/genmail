import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey && process.env.NODE_ENV !== "production") {
  console.warn(
    "STRIPE_SECRET_KEY is not set. Stripe functionality will be disabled."
  );
}

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2024-06-20" as "2025-05-28.basil",
      typescript: true,
    })
  : null;

export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID || "";
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

// Stripe configuration
export const STRIPE_CONFIG = {
  currency: "usd",
  payment_method_types: [
    "card",
  ] as Stripe.Checkout.SessionCreateParams.PaymentMethodType[],
  billing_address_collection:
    "required" as Stripe.Checkout.SessionCreateParams.BillingAddressCollection,
  allow_promotion_codes: true,
  automatic_tax: { enabled: false },
};
