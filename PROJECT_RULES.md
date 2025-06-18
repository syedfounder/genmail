# Project Rules

## Project Overview

- **Type:** cursor_project_rules
- **Description:** I want to build a web-based platform for privacy-conscious users, developers, and anyone needing disposable email addresses to instantly generate temporary inboxes and, for subscribers, create private, customizable, auto-destruct mailboxes. This application simplifies email privacy, protects users from spam, and gives them control over their digital footprint.
- **Primary Goal:** Simplify email privacy, protect users from spam, and give them control over their digital footprint.

## Project Structure

### Framework-Specific Routing

- **Directory Rules:**

  - `Next.js 14 (App Router)`: Use `app/[route]/page.tsx` and nested `app/[route]/layout.tsx` conventions.
  - `Next.js (Pages Router)`: Use `pages/[route].tsx` pattern with `_app.tsx` customization.
  - `React Router 6`: Use `src/routes/` with `createBrowserRouter` and file-based route definitions.

### Core Directories

- **Versioned Structure:**

  - `app/api`: Next.js 14 API routes with Route Handlers for Clerk webhooks and Resend inbound-email hooks.
  - `app/auth`: Next.js 14 server components and pages for Clerk authentication flows.
  - `app/dashboard`: Nested layouts and pages for subscriber mailbox management and analytics.
  - `app/(free)`: Entry point for the free instant inbox flow and real-time viewer.
  - `src/components`: Shadcn UI + Tailwind CSS reusable UI components.
  - `src/lib`: Shared utilities and clients for Supabase, Resend, and Clerk.
  - `supabase/functions`: Supabase Edge Functions handling inbound email webhooks and auto-destruct logic.

### Key Files

- **Stack-Versioned Patterns:**

  - `app/layout.tsx`: Next.js 14 root layout with theme toggle and global providers.
  - `app/page.tsx`: Landing page for free instant inbox generation.
  - `app/api/resend/route.ts`: Route Handler for Resend inbound-email webhook verification.
  - `app/dashboard/layout.tsx`: Dashboard root layout with sidebar and header.
  - `app/auth/login/page.tsx`: Clerk-powered login/signup page using server actions.
  - `supabase/functions/inboundEmail.ts`: Supabase Edge Function for inbound email processing and spam filtering.

## Tech Stack Rules

- **Version Enforcement:**

  - next@14: App Router required; no `getInitialProps`, use `app/` directory and server components by default.
  - tailwindcss@^3: Enable JIT mode, purge unused styles, define theme extensions in `tailwind.config.js`.
  - shadcn/ui@latest: Use component variants and theme config; avoid custom CSS overrides.
  - @supabase/postgrest-js@1.x: Use typed queries and RPC functions for complex operations.
  - <supabase-realtime-js@1.x>: Keep subscription filters narrow; unsubscribe on unmount to prevent memory leaks.
  - supabase/functions@edge: Write single-purpose, idempotent handlers; place under `supabase/functions/`.
  - clerk@^6: Protect server components with `authMiddleware`; use SSR-secure session retrieval.
  - <resend@1.x>: Validate webhook signatures; handle duplicate deliveries idempotently.
  - vercel@latest: Deploy all Next.js pages and Edge Functions on Vercel Edge; configure regions for low latency.

## PRD Compliance

- **Non-Negotiable:**

  - "Privacy-conscious users and developers can create a one-click, anonymous inbox that lives for ten minutes and self-destructs—no signup, no ads, no tracking.": Enforce free-plan constraints—no analytics scripts, no persistent user data.
  - "Support 1,000 concurrent subscribers without degradation.": All components must use Vercel Edge and serverless best practices for auto-scaling.

## App Flow Integration

- **Stack-Aligned Flow:**

  - Next.js 14 Auth Flow → `app/auth/login/page.tsx` uses Clerk server actions and session cookies via middleware.
  - Next.js 14 Real-Time Inbox → `app/(free)/page.tsx` uses Supabase Realtime subscription for live email updates.
  - Resend Webhook Flow → `app/api/resend/route.ts` verifies signature and enqueues email for Supabase Edge Function.
  - Subscriber Dashboard Flow → `app/dashboard/[mailbox]/page.tsx` fetches messages from Postgres and renders with Shadcn UI.

## Best Practices

- Next.js 14

  - Use server components for data fetching and client components only when interactive.
  - Organize routes with nested `layout.tsx` files for shared UI sections.
  - Co-locate CSS modules or Tailwind classes with components.

- Tailwind CSS

  - Enable JIT and purge unused styles in production builds.
  - Define color palette and fonts in `tailwind.config.js` for theme consistency.
  - Use utility classes over custom CSS; extend via plugins when necessary.

- Shadcn UI

  - Leverage component variants for consistent theming.
  - Override styles through `className` and avoid deep CSS specificity.
  - Keep components stateless where possible; manage state via hooks.

- Supabase (Postgres & Realtime)

  - Use Row-Level Security (RLS) policies for subscriber data isolation.
  - Create indexes on TTL and expiry timestamp columns for efficient purges.
  - Clean up realtime subscriptions on component unmount.

- Supabase Edge Functions

  - Write idempotent handlers and validate all inputs.
  - Keep functions small and single-responsibility (e.g., spam filter, auto-destruct).
  - Warm up critical functions via scheduled pings to reduce cold starts.

- Clerk

  - Use `withClerkMiddleware` in `middleware.ts` to protect private routes.
  - Fetch user metadata securely on the server side only.
  - Leverage Clerk's webhooks for subscription lifecycle events.

- Resend

  - Verify webhook signatures to prevent spoofing.
  - Process inbound emails asynchronously to avoid blocking.
  - Sanitize and scan attachments for disallowed file types.

- Vercel

  - Deploy Next.js App Router and API routes to Edge Runtime.
  - Use environment variables in Vercel dashboard for secrets.
  - Monitor deployment metrics and enable auto-scaling settings.

- Cursor AI

  - Use inline code suggestions to maintain consistent patterns.
  - Annotate generated code blocks for future reference.
  - Review and refactor AI-suggested code to adhere to style guides.
  - Stripe

## Rules

- Derive folder and file patterns **directly** from the specified tech stack versions and routing docs.
- If using Next.js 14 App Router: Enforce an `app/` directory with nested route folders—never mix `pages/` patterns.
- If using Next.js Pages Router: Keep a flat `pages/` structure with a custom `_app.tsx` and `_document.tsx`.
- Mirror this version-based routing logic for React Router, SvelteKit, or other frameworks when applicable.
- Do not mix folder conventions across framework versions (e.g., no `pages/` in App Router projects).

## Rules Metrics

Before starting the project development, create a metrics file in the root of the project called `cursor_metrics.md`.

### Instructions:

- Each time a rule is used as context, update `cursor_metrics.md`.

- Use the following format for `cursor_metrics.md`: Rules Metrics Usage The number of times a rule is used as context

  - next-app-router.mdc: 5
  - supabase-edge-functions.mdc: 3
  - clerk-auth-rules.mdc: 2
  - ...other rules
