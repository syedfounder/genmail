# 🔧 Clerk Production Troubleshooting Guide

## ❌ **Issue**: Auth buttons not showing + SSL errors

**Error Messages:**

```
Failed to load resource: An SSL error has occurred and a secure connection to the server cannot be made. (clerk.browser.js, line 0)
Clerk: Failed to load Clerk
```

## 🚨 **Most Likely Causes**

### 1. **Wrong Environment Variables** (90% of cases)

- Using development Clerk keys in production
- Missing `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` in production environment
- Incorrect key format or typos

### 2. **Domain Not Allowlisted** (80% of cases)

- Production domain not added to Clerk Dashboard
- Subdomain configuration issues

### 3. **Content Security Policy** (30% of cases)

- CSP blocking Clerk resources ✅ **FIXED**

## 🔍 **Debugging Steps**

### Step 1: Check Environment Variables

**Visit your debug page:** `https://yourdomain.com/debug-clerk`

This will show you:

- ✅/❌ If `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set
- ✅/❌ If Clerk is loading in browser
- Current domain and protocol

### Step 2: Verify Clerk Keys

**In your deployment platform (Vercel/Netlify):**

1. **Check these environment variables exist:**

   ```bash
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_... # NOT pk_test_...
   CLERK_SECRET_KEY=sk_live_...                  # NOT sk_test_...
   ```

2. **Key format validation:**
   - Production publishable key starts with `pk_live_`
   - Production secret key starts with `sk_live_`
   - Development keys start with `pk_test_` and `sk_test_`

### Step 3: Add Domain to Clerk Dashboard

1. **Go to:** [Clerk Dashboard](https://dashboard.clerk.com)
2. **Navigate to:** Configure → Domain & URLs
3. **Add your production domain:**
   ```
   https://yourdomain.com
   ```
4. **Also add any subdomains:**
   ```
   https://www.yourdomain.com
   https://app.yourdomain.com
   ```

### Step 4: Verify Clerk Instance Region

**Check your Clerk instance URL:**

- US: `https://clerk.accounts.dev` or `https://clerk.com`
- EU: `https://clerk.accounts.eu-west-1.clerk.dev`

Make sure your production keys match your instance region.

## ⚡ **Quick Fixes**

### Fix 1: Update Environment Variables

**For Vercel:**

```bash
# Remove old variables
vercel env rm NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
vercel env rm CLERK_SECRET_KEY

# Add production variables
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
# Paste your pk_live_... key when prompted

vercel env add CLERK_SECRET_KEY production
# Paste your sk_live_... key when prompted

# Redeploy
vercel --prod
```

**For Netlify:**

1. Go to Site settings → Environment variables
2. Delete old `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
3. Add new production keys
4. Trigger new deployment

### Fix 2: Get Production Keys from Clerk

1. **Go to:** [Clerk Dashboard](https://dashboard.clerk.com)
2. **Select your app** (or create new one for production)
3. **Navigate to:** Configure → API Keys
4. **Copy:**
   - **Publishable key** (starts with `pk_live_`)
   - **Secret key** (starts with `sk_live_`)

### Fix 3: Temporary CSP Disable Test

Add this to your `next.config.mjs` temporarily to test if CSP is the issue:

```javascript
// TEMPORARY: Disable CSP to test Clerk loading
{
  key: "Content-Security-Policy",
  value: "", // Empty = disabled
},
```

If Clerk works with CSP disabled, the issue was CSP-related (which I've already fixed).

## 🛠️ **Advanced Troubleshooting**

### Check Network Connectivity

**In browser console:**

```javascript
// Test Clerk API connectivity
fetch("https://clerk.com").then((r) => console.log("Clerk reachable:", r.ok));

// Check if publishable key is loaded
console.log(
  "Clerk key:",
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 10)
);
```

### Verify Clerk Configuration

**In your `layout.tsx`:**

```tsx
// Add debug logging
console.log('Clerk Key:', process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 10))

<ClerkProvider
  publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
  // ... rest of config
>
```

### Check Headers Response

**In browser Network tab:**

1. Look for failed requests to `*.clerk.com` or `*.clerk.dev`
2. Check for CORS errors
3. Verify response headers include proper CSP

## 📋 **Production Deployment Checklist**

- [ ] **Environment Variables Set**

  - [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = `pk_live_...`
  - [ ] `CLERK_SECRET_KEY` = `sk_live_...`
  - [ ] `NODE_ENV` = `production`

- [ ] **Clerk Dashboard Configuration**

  - [ ] Production domain added to allowed domains
  - [ ] Redirect URLs updated for production
  - [ ] Webhook endpoints point to production

- [ ] **SSL/TLS**

  - [ ] Production site has valid SSL certificate
  - [ ] HTTPS enforced (no mixed content)
  - [ ] CSP allows Clerk domains ✅ **FIXED**

- [ ] **Testing**
  - [ ] Visit `/debug-clerk` page to verify configuration
  - [ ] Test sign-in/sign-up flows
  - [ ] Verify auth state persistence

## 🎯 **Expected Results After Fix**

✅ **Auth buttons should appear**  
✅ **No SSL errors in console**  
✅ **Sign-in/sign-up flows work**  
✅ **User sessions persist**  
✅ **Dashboard access works**

## 🆘 **Still Not Working?**

If you've completed all steps above and Clerk still isn't loading:

1. **Create a minimal test page:**

   ```tsx
   // pages/test-clerk.tsx
   import { useUser } from "@clerk/nextjs";

   export default function TestClerk() {
     const { user, isLoaded } = useUser();
     return (
       <div>
         <p>Loaded: {isLoaded ? "Yes" : "No"}</p>
         <p>User: {user ? user.emailAddresses[0].emailAddress : "None"}</p>
       </div>
     );
   }
   ```

2. **Check browser console for detailed errors**

3. **Contact Clerk support** with:
   - Your exact error messages
   - Your production domain
   - Your Clerk app ID (starts with `app_`)

---

## 🔧 **Files I Updated**

✅ **Fixed CSP in `next.config.mjs`** - Added all Clerk domains  
✅ **Created `/debug-clerk` page** - For environment debugging  
✅ **This troubleshooting guide** - Step-by-step fix instructions

**Most likely fix:** Update your production environment variables with the correct `pk_live_` and `sk_live_` keys from your Clerk dashboard.
