# Genmail Project Requirements Document

## 1. Project Overview

Genmail is a web-based platform that lets anyone instantly generate disposable email inboxes for short-term use. Privacy-conscious users and developers can create a one-click, anonymous inbox that lives for ten minutes and self-destructs—no signup, no ads, no tracking. Subscribers can opt into a paid plan to spin up multiple, password-protected mailboxes with configurable lifespans (10 min, 1 hr, 24 hr), a management dashboard, and download/forwarding capabilities.

We're building Genmail to solve the spam-and-privacy problem: users shouldn't have to expose their real email when signing up for newsletters, beta tests, or one-off services. Key success criteria include a seamless "generate inbox" flow, real-time email delivery under one second, zero user profiling, and a straightforward upgrade path that converts free users to subscribers while maintaining 99.9% uptime and full GDPR/CCPA compliance.

## 2. In-Scope vs. Out-of-Scope

### In-Scope (V1)

• Free Plan\
– Instant, random disposable address\
– 10-minute auto-destruct timer\
– Real-time email viewer (incoming mails via WebSocket)\
– Basic spam filtering\
– Single active inbox per session\
– No signup, no ads, no tracking

• Paid Plan (Subscription)\
– Multiple inboxes (up to 10)\
– Password-protected mailboxes\
– Custom auto-destruct durations (10 min, 1 hr, 24 hr)\
– Inbox management dashboard (list, sort, filter)\
– Download emails as .eml/.txt\
– Usage analytics (aggregate, anonymized)\
– Priority support

• Core Platform\
– Next.js 14 + Tailwind CSS + Shadcn UI frontend\
– Supabase (Postgres, Realtime, Edge Functions) backend\
– Stripe for subscription billing & payment processing\
– Resend inbound-email webhooks\
– Vercel hosting (edge network)\
– Dark/light theme toggle, WCAG AA accessibility

- **Multi-Layer Rate Limiting:**\
  – Implement rate limiting at the Vercel edge, Supabase RLS, and application levels to prevent abuse, protect infrastructure, and ensure fair usage.\
  – Monitor and adjust thresholds based on observed usage patterns.
- **Storage Optimization & Cleanup:**\
  – Automated cleanup jobs run every 5 minutes to delete expired emails/inboxes.\
  – Use soft deletes with periodic hard purge batches for operational safety and database efficiency.\
  – Enforce total email size limits (body + attachments) to prevent abuse and control storage costs.

### Out-of-Scope (Phase 2+)

• Email forwarding rules and unverified recipients\
• Custom domains for inboxes\
• Public REST/GraphQL API for developers\
• Advanced spam/virus scanning\
• Mobile app or desktop client\
• Complex user roles beyond basic admin/support\
• Long-term email archiving (> 24 hrs)

## 3. User Flow

**Free User Journey**\
A visitor lands on Genmail's homepage and sees a prominent "Generate Inbox" button with a concise tagline ("Private, Disposable Email in 1 Click"). No login is required. When they click, the UI displays a randomly created email address, a countdown timer set to 10 minutes, and a live-updating inbox panel. Incoming messages appear instantly; attachments (≤ 10 MB; .jpg/.png/.pdf/.txt) are viewable inline or downloadable. As the timer hits zero, all data and the address vanish; the interface resets to the "Generate Inbox" call-to-action.

**Subscriber Journey**\
A user clicks "Upgrade" in the header or sees a subtle banner during free usage. They choose a monthly or annual plan via Stripe's checkout flow. After payment, they land on the Private Inbox Dashboard listing all active and expired mailboxes—each row shows custom label, address, creation time, expiry timer, and quick actions (view, download, settings). They can create new mailboxes (≤ 10 total), set passwords, choose lifespan, and export emails. The Dashboard also offers anonymized analytics (inboxes created, emails received) and a "Support" link for priority help.

## 4. Core Features

• Authentication (Clerk) & Billing (Stripe)\
• Instant Inbox Generation (anonymous, one-click)\
• Auto-Destruct Timer (10 min free; customizable for subscribers)\
• Real-Time Mail Viewer (Supabase Realtime/WebSockets)\
• Spam Filtering (block obvious spam/malware attachments)\
• Free-Plan Constraints (single inbox per session, 10 MB attachments)

- **Sender Verification & Email Validation**\
  Validate sender domains and authenticate incoming emails using SPF, DKIM, and DMARC checks\
  Reject or flag emails from unauthenticated or suspicious sources to prevent spam, phishing, and abuse\
  Maintain domain reputation and protect users from malicious content\
  • Paid-Plan Features:\
  – Multi-inbox support (up to 10)\
  – Password protection per inbox\
  – Dashboard with list, sort, filter, search\
  – Multiple TTL options (10 min, 1 hr, 24 hr)\
  – Download .eml/.txt before expiry\
  – Aggregate, anonymized analytics\
  – Priority support channel\
  • UI Themes (dark/light, high-contrast; WCAG AA)\
  • Data Purge Logic (automatic deletion at TTL end)

## 5. Tech Stack & Tools

**Frontend**\
• Next.js 14 (React SSR/SSG)\
• Tailwind CSS (utility-first styles)\
• Shadcn UI (prebuilt components)

**Backend & Storage**\
• Supabase Postgres (primary DB)\
• Supabase Realtime (WebSocket streams)\
• Supabase Edge Functions (serverless logic)

**Authentication & Billing**\
• Clerk (user authentication, account management)\
• Stripe (payments, subscriptions, plan management)

**Email Service**\
• Resend (inbound-email webhook to Edge Function)

**Hosting & Delivery**\
• Vercel (global edge, automatic deployments)

**IDE/Dev Tools**\
• Cursor AI-powered coding assistant (in-IDE suggestions)

## 6. Non-Functional Requirements

• Performance:\
– Page loads ≤ 2 s on 3G; real-time email display < 1 s latency\
– Support 1,000 concurrent subscribers without degradation

• Security & Compliance:\
– TLS 1.2+ for all traffic\
– Encrypt email data at rest (AES-256)\
– GDPR/CCPA adherence: strict data minimization, right-to-erasure\
– OWASP Top 10 mitigation (XSS, CSRF, injection)

• Privacy:\
– No user profiling or third-party tracking\
– IP-based rate limits only (5 free inboxes/hour/IP)\
– Anonymized, aggregated analytics

• Usability & Accessibility:\
– WCAG AA for color contrast, keyboard nav, screen readers\
– Responsive across mobile and desktop\
– Dark/light theme toggle

- **Multi-Layer Rate Limiting:**\
  – Implement rate limiting at the Vercel edge, Supabase RLS, and application levels to prevent abuse, protect infrastructure, and ensure fair usage.\
  – Monitor and adjust thresholds based on observed usage patterns.

## 7. Constraints & Assumptions

• Dependent on Supabase, Clerk, Stripe, Resend, and Vercel uptime and API rate limits.\
• Users may face DNS-propagation delays (for future custom domains).\
• Free-plan users assumed to accept 10 MB attachment and 10-minute TTL limits.\
• Subscribers trust password-protected inbox security; edge functions must validate tokens.\
• Email senders deliver to Resend webhooks reliably; some bounces/spam may occur.

## 8. Known Issues & Potential Pitfalls

• Mail deliverability can suffer due to sender IP blacklists—mitigate by monitoring bounce rates and rotating sending infrastructure.\
• Resend or Supabase rate limits may throttle inbound traffic—implement exponential back-off and queueing in edge functions.\
• DNS verification for custom domains can fail if users misconfigure records—provide clear instructions and automated retry checks.\
• Abuse from automated scripts spawning free inboxes—prevent with IP rate limiting and CAPTCHA if needed.\
• Edge function cold starts could add latency—use "keep-warm" pings or regional deployment to reduce cold starts.

- **Sender Verification & Email Validation:**\
  – Validate sender domains and authenticate incoming emails using SPF, DKIM, and DMARC checks\
  – Reject or flag emails from unauthenticated or suspicious sources to prevent spam, phishing, and abuse\
  – Maintain domain reputation and protect users from malicious content

## 9. Conversion Optimisation

- Display urgency prompts (e.g., "Inbox expires in 2 minutes") to encourage upgrades as inboxes near expiry.
- Show usage stats (emails received, inboxes created) during free sessions to highlight value and limits.
- Prompt users to download emails as expiration approaches, with messaging that upgrading removes this hassle and unlocks longer retention.

_This document fully specifies the Genmail platform's first version. With these requirements, the AI model can generate detailed technical guides, architecture diagrams, API definitions, frontend styles, backend code structure, and testing plans without ambiguity._
