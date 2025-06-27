# Backend Structure Document

This document outlines the backend architecture, database setup, APIs, hosting, infrastructure, security, and maintenance strategies for Genmail—a privacy-first, disposable email platform.

## 1. Backend Architecture

Overall Design

- **Serverless and Edge-Driven:** Business logic lives in Supabase Edge Functions and Vercel serverless functions, minimizing cold starts and maximizing global reach.

- **Event-Driven Email Ingestion:** Inbound emails arrive via Mailgun webhooks, trigger edge functions to validate and store messages, then broadcast updates in real time.

- **Decoupled Services:**

  - Authentication via Clerk
  - Billing via Stripe
  - Database and real-time via Supabase (Postgres + Realtime)
  - CDN, caching, and function routing via Vercel

Scalability, Maintainability, Performance

- Automatic scaling of edge functions and managed Postgres.
- Role-Based Security Policies (RLS) in the database to isolate free vs. paid data paths.
- Real-time updates via WebSockets (Supabase Realtime) under 1s latency.
- Stateless functions ensure easy deployment and rollbacks.

## 2. Database Management

Technologies

- Relational SQL database: **PostgreSQL** (managed by Supabase)
- Real-time pub/sub: **Supabase Realtime**
- Serverless logic: **Supabase Edge Functions**

Data Storage & Access

- Data encrypted at rest (AES-256) and in transit (TLS 1.2+).
- Row-Level Security ensures free users see only their anonymous inbox; subscribers see only their owned inboxes.
- Automated backups and PITR (Point-In-Time Recovery) handled by Supabase.

Data Management Practices

- **TTL & Cleanup Jobs:** Every 5 minutes, a scheduled function soft-deletes expired inboxes and emails, followed by a hard-purge batch.
- **Soft Deletes:** Mark records as deleted before permanent removal for safer rollbacks.
- **Rate Limiting:** IP-based limits at the edge and RLS policies to throttle free inbox creations (5/hour).

## 3. Database Schema

Human-Readable Table Overview

- **Users**: subscriber accounts managed by Clerk
- **Inboxes**: disposable mailboxes (free or paid), TTL, status, optional password
- **Emails**: headers, body, metadata linked to an inbox
- **Attachments**: file metadata and storage URLs linked to emails
- **ForwardingRules**: target addresses, verification status
- **Domains**: custom domains added by users, DNS records, verification state
- **AuditLogs**: system and admin actions for troubleshooting and compliance
- **Analytics**: aggregated, anonymized counts for monitoring usage trends

SQL Schema Definition (PostgreSQL)

```sql
-- Users table (paid subscribers)
CREATE TABLE users (
    id UUID PRIMARY KEY,
    clerk_id TEXT UNIQUE NOT NULL,
    plan TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inboxes table (free and paid)
CREATE TABLE inboxes (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    address TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    custom_name TEXT,
    status TEXT CHECK (status IN ('active','expired')) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Emails table
CREATE TABLE emails (
    id UUID PRIMARY KEY,
    inbox_id UUID REFERENCES inboxes(id) ON DELETE CASCADE,
    message_id TEXT UNIQUE NOT NULL,
    sender TEXT NOT NULL,
    subject TEXT,
    body TEXT,
    raw_content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attachments table
CREATE TABLE attachments (
    id UUID PRIMARY KEY,
    email_id UUID REFERENCES emails(id) ON DELETE CASCADE,
    filename TEXT,
    content_type TEXT,
    size_bytes INT,
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forwarding rules
CREATE TABLE forwarding_rules (
    id UUID PRIMARY KEY,
    inbox_id UUID REFERENCES inboxes(id) ON DELETE CASCADE,
    target_address TEXT NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    verification_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom domains
CREATE TABLE domains (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    domain_name TEXT UNIQUE NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    dns_txt_record TEXT,
    dns_mx_records TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    action TEXT NOT NULL,
    entity TEXT,
    entity_id UUID,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aggregated analytics
CREATE TABLE analytics (
    day DATE PRIMARY KEY,
    inbox_creations INT DEFAULT 0,
    emails_received INT DEFAULT 0,
    attachments_size BIGINT DEFAULT 0
);
```

## 4. API Design and Endpoints

Approach: **RESTful** with JSON payloads, JWT via Clerk for protected routes, anonymous tokens for free inboxes.

Public (Free Users)

- `POST /api/inboxes`  
  Generate a 10-minute temporary inbox. Returns inbox ID and address.
- `GET /api/inboxes/{inboxId}/emails`  
  Retrieve list of emails (polling) or subscribe to WebSocket channel for real-time.
- `GET /api/inboxes/{inboxId}/emails/{emailId}`  
  Get full email content, attachments metadata.
- `DELETE /api/inboxes/{inboxId}`  
  Manually delete an active free inbox.
- `POST /api/webhooks/email`  
  Mailgun inbound-email webhook endpoint (Edge Function) to ingest and store messages.

Protected (Subscribers via Clerk JWT)

- `GET /api/user/inboxes`  
  List all inboxes (active/expired).
- `POST /api/user/inboxes`  
  Create new private inbox (10 min, 1 hr, 24 hr options).
- `GET /api/user/inboxes/{inboxId}`  
  Inbox details (settings, timers).
- `PUT /api/user/inboxes/{inboxId}`  
  Update password, TTL, custom name.
- `DELETE /api/user/inboxes/{inboxId}`  
  Delete a private inbox.
- `POST /api/user/inboxes/{inboxId}/download`  
  Export emails as .eml or .txt.
- `POST /api/user/inboxes/{inboxId}/forwarding`  
  Add forwarding rule (triggers verification flow).
- `GET /api/user/forwarding/{ruleId}/verify`  
  Verify an external forwarding address via token.
- `GET /api/user/domains`  
  List custom domains.
- `POST /api/user/domains`  
  Add custom domain, returns DNS instructions.
- `GET /api/user/analytics`  
  Retrieve anonymized usage stats.
- `GET /api/admin/logs`  
  (Admin only) View audit logs and system health.

## 5. Hosting Solutions

- **Frontend & Edge Functions:** Vercel global edge network. Instant deployments, built-in CDN, smart caching.
- **Database & Edge Logic:** Supabase (hosted Postgres, Realtime engine, Edge Functions) in a GDPR-compliant region.
- **Inbound Email Service:** Mailgun (SaaS webhook handling).
- **Authentication & Billing:** Clerk (PCI-compliant, GDPR-ready).

Benefits

- Zero-ops infrastructure, pay-as-you-go.
- High availability SLA (99.9%+).
- Low latency for global users via edge compute.
- Cost-effective for bursty workloads.

## 6. Infrastructure Components

- **Load Balancer & Routing:** Vercel's edge proxy, auto-routes traffic to nearest region.
- **CDN & Caching:** Vercel CDN for static assets. Cache headers for API responses (where safe).
- **Real-Time Layer:** Supabase Realtime (WebSocket) channels per inbox.
- **Background Jobs:** Supabase Cron or external scheduler to purge expired data every 5 minutes.
- **Backup & Recovery:** Supabase automated daily backups, PITR for up to 7 days.
- **Logging & Tracing:** Vercel Logs, Supabase Logs, Sentry or Datadog integrations.

## 7. Security Measures

- **Transport Encryption:** TLS 1.2+ for all HTTP(S) traffic.

- **Data Encryption:** AES-256 at rest in Postgres; TLS for in-transit.

- **Authentication & Authorization:**

  - Clerk-issued JWTs for subscribers.
  - Anonymous, short-lived tokens for free inbox sessions.
  - Supabase Row-Level Security policies to scope data access.

- **Rate Limiting & Abuse Prevention:**

  - IP-based rate limiting at Vercel edge (5 free inboxes/hour).
  - CAPTCHA on suspicious patterns (future).

- **Spam & Malware Filtering:**

  - SPF/DKIM/DMARC checks on inbound emails.
  - Blocked file types (.exe, .bat, .js, .zip).
  - Size limits (10 MB free, 25 MB paid).

- **Compliance Controls:**

  - GDPR & CCPA data minimization, retention policies.
  - Right-to-erasure workflows via API.
  - Audit logs for admin actions.

## 8. Monitoring and Maintenance

- **Performance Monitoring:** Vercel Analytics for edge functions, Supabase Metrics (CPU, connections), custom Grafana dashboards via Prometheus.

- **Error Tracking:** Sentry integration in edge functions and frontend.

- **Health Checks:** Automated ping endpoints for uptime monitoring (UptimeRobot or Datadog).

- **Backup Validation:** Weekly restore drills from Supabase backups.

- **Maintenance Workflows:**

  - Database schema migrations via Supabase CLI.
  - Edge function versioning and feature flags.
  - Incident response runbooks for email deliverability or system outages.

## 9. Conclusion and Overall Backend Summary

Genmail's backend is built for privacy, speed, and scale. Leveraging managed services (Supabase, Clerk, Vercel, Mailgun), we achieve:

- **Ephemeral Data Handling:** Automated TTL and data purge for zero-stored-history policies.
- **Global Low Latency:** Edge functions and real-time channels under 1 s for inbox updates.
- **Robust Security & Compliance:** End-to-end encryption, RLS, GDPR/CCPA workflows, and audit logs.
- **Flexible Extensibility:** Clean RESTful API and modular schema allow future features (custom domains, API access) with minimal friction.

This setup delivers a seamless developer and user experience, maintaining Genmail's promise of private, disposable email in one click.
