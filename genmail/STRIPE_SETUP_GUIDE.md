# Stripe Payment Processing Setup Guide

## 🚀 Quick Setup

Your payment processing system is now **fully implemented**! Follow these steps to get it running:

## 1. Stripe Dashboard Configuration

### Create Products & Prices

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Products** → **Add Product**
3. Create "Genmail Pro" product with:
   - Name: `Genmail Pro`
   - Billing: `Recurring`
   - Price: `$4.49 USD/month`
   - Copy the **Price ID** (starts with `price_...`)

### Webhook Configuration

1. Go to **Developers** → **Webhooks** → **Add endpoint**
2. Endpoint URL: `https://yourdomain.com/api/stripe-webhook`
3. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the **Webhook Secret** (starts with `whsec_...`)

## 2. Environment Variables

Add these to your `.env.local`:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...                    # From Stripe Dashboard → API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...   # From Stripe Dashboard → API Keys
STRIPE_PRICE_ID=price_...                        # From your Pro product
STRIPE_WEBHOOK_SECRET=whsec_...                  # From webhook configuration
SUPABASE_SERVICE_ROLE_KEY=your_service_key       # From Supabase → Settings → API

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000        # Your app URL
```

## 3. Test the Integration

### Test Checkout Flow

1. Go to `/pricing` page
2. Click "Get Full Access"
3. Complete checkout with Stripe test card: `4242 4242 4242 4242`
4. Verify user is upgraded to Pro in `/dashboard/settings`

### Test Webhook

1. Use Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe-webhook`
2. Complete a test purchase
3. Check logs for successful webhook processing

## 4. Features Available

### ✅ User Flow

- **Free users**: Can access pricing page and upgrade
- **Pro users**: See subscription status, manage billing, access premium features
- **Checkout**: Secure Stripe-hosted checkout experience
- **Billing Portal**: Self-service subscription management

### ✅ Admin Features

- **Webhook Processing**: Automatic subscription status updates
- **Database Sync**: User tier updates across Clerk and Supabase
- **Error Handling**: Graceful degradation when Stripe is unavailable

## 5. Production Checklist

### Security

- [ ] Replace test keys with live Stripe keys
- [ ] Configure webhook endpoint with HTTPS
- [ ] Test webhook signature verification
- [ ] Review Stripe security best practices

### Monitoring

- [ ] Set up Stripe Dashboard alerts
- [ ] Monitor webhook delivery in Stripe Dashboard
- [ ] Add application logging for payment events
- [ ] Set up failed payment notifications

### Testing

- [ ] Test subscription creation, updates, cancellation
- [ ] Test failed payment scenarios
- [ ] Test customer portal functionality
- [ ] Verify data consistency between Stripe/Clerk/Supabase

## 6. Customization Options

### Pricing Plans

- Modify prices in `src/app/pricing/page.tsx`
- Update feature lists for Free vs Pro
- Add annual billing options

### Subscription Features

- Customize Pro feature limits in `src/lib/subscription.ts`
- Add usage tracking and enforcement
- Implement trial periods

### UI/UX

- Customize checkout success/cancel URLs
- Modify billing portal settings
- Add custom payment method collection

## 🎉 You're Ready!

Your subscription system is production-ready with:

- Secure payment processing via Stripe
- Real-time subscription status updates
- Self-service billing portal
- Automatic user tier management
- Complete webhook handling

Just add your Stripe keys and test the flow!
