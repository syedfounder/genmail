# Genmail Security Guidelines

This document outlines security best practices and requirements for building Genmail—a privacy-first disposable email platform—adhering to secure-by-design principles throughout the architecture, code, and operations.

## 1. Core Security Principles

- **Security by Design**: Integrate security at every stage (design, implementation, testing, deployment).
- **Least Privilege**: Grant services and components only the permissions they strictly need (e.g., database roles with minimal privileges).
- **Defense in Depth**: Layer controls (network, application, data) so failures in one layer are mitigated by others.
- **Fail Securely**: Avoid exposing sensitive data in errors; default to safe states on failure.
- **Keep Security Simple**: Favor clarity over complexity to reduce risk of misconfiguration.
- **Secure Defaults**: All features must default to the most secure setting (e.g., TTL=10 min, cookies `HttpOnly`, CSP enabled).

## 2. Authentication & Access Control

- **Free Users**: Anonymous, no credentials—limit functionality to one active inbox and enforce IP-based rate limits (5 creations/hour/IP).

- **Subscribers**: Use Clerk for user identity, MFA optional but recommended for admin/support.

- **Session Management**:

  - Clerk-issued sessions must use strong, unguessable cookies with `Secure`, `HttpOnly`, `SameSite=Strict`.
  - Enforce idle (30 min) and absolute (24 hr) timeouts.
  - Invalidate sessions on logout, password reset, or plan downgrade.

- **RBAC**:

  - Define roles: `subscriber`, `support`, `super_admin`.
  - Enforce server-side permission checks on each API/edge function.
  - Use JWTs only if necessary; verify signatures, `exp`, and audience (`aud`) claims.

## 3. Input Handling & Processing

- **Injection Protection**:

  - Use parameterized queries or Supabase client libraries to avoid SQL injection.
  - Sanitize all inputs (email addresses, custom domain names, mailbox labels) against expected patterns.

- **File Uploads (Attachments)**:

  - Restrict file types: free plan only `.jpg, .png, .pdf, .txt`; subscribers can add more but still block executables (`.exe`, `.bat`, archives).
  - Enforce size limits at upload: 10 MB (free), 25 MB (paid).
  - Store uploads in a private S3 bucket (or Supabase storage) outside webroot with strict ACLs.
  - Scan for malware (optional integration with VirusTotal or similar).

- **Email Webhook Data**:

  - Validate inbound webhooks from Resend via HMAC signatures.
  - Reject or log any malformed JSON.

## 4. Data Protection & Privacy

- **Encryption in Transit**:

  - Enforce HTTPS/TLS 1.2+ for all endpoints (frontend, APIs, Supabase).

- **Encryption at Rest**:

  - Enable database encryption (AES-256).
  - Encrypt sensitive config (Clerk API keys, Stripe secrets) with a secrets manager (e.g., Vercel Environment Variables encrypted at rest).

- **Ephemeral Data & TTL**:

  - Implement background jobs or Supabase Edge Functions to purge inboxes and emails promptly at TTL expiration.
  - Log deletion events without storing actual content.

- **PII Minimization**:

  - Free plan: store no user identifiers.
  - Paid plan: limit storage to necessary billing and email records; anonymize aggregate analytics.

- **Compliance**:

  - GDPR/CCPA: publish data retention policy; automate right-to-erasure workflows for subscriber data.

## 5. API & Service Security

- **Authentication**:

  - Secure each Supabase Edge Function with JWT or Clerk session validation.

- **Rate Limiting & Throttling**:

  - Free plan: 5 inbox creations/hour/IP; 100 API calls/hour/IP.
  - Subscriber plan: higher thresholds but still finite to prevent abuse.

- **CORS**:

  - Restrict origins to your production domains; no wildcard.

- **Versioning**:

  - Namespace APIs (e.g., `/api/v1/inboxes`, `/api/v2/forwarding`).

## 6. Web Application Security Hygiene

- **Security Headers**:

  - `Strict-Transport-Security`: max-age=31536000; includeSubDomains
  - `Content-Security-Policy`: restrict sources (self, trusted domains).
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`

- **CSRF Protection**:

  - Use anti-CSRF tokens for state-changing POST/PUT/DELETE requests.

- **Cookie Settings**:

  - All auth cookies set with `Secure`, `HttpOnly`, and `SameSite=Strict`.

- **Subresource Integrity (SRI)**:

  - Apply SRI hashes to any third-party scripts/styles.

## 7. Infrastructure & Configuration Management

- **Server Hardening**:

  - Vercel hosts front and edge functions; enforce least privilege on Vercel tokens.
  - For any self-hosted servers (if used), disable unused services, enforce firewall rules.

- **TLS Configuration**:

  - Only support TLS 1.2+ and strong cipher suites.

- **Environment Segregation**:

  - Separate production, staging, local environments with distinct secrets and databases.

- **Disable Debug in Prod**:

  - Ensure React/Next.js runs in production mode; suppress stack traces in error responses.

## 8. Dependency Management

- **Secure Dependencies**:

  - Vet all NPM/Pip/CLI dependencies; prefer actively maintained packages.

- **Lockfiles & SCA**:

  - Check in `package-lock.json`; integrate GitHub Dependabot or Snyk to scan for CVEs.

- **Minimize Footprint**:

  - Only include required modules; remove dev dependencies from production builds.

## 9. Monitoring, Logging & Incident Response

- **Logging**:

  - Log authentication events, creation/deletion of inboxes, errors, rate-limit triggers—exclude sensitive email content.

- **Monitoring**:

  - Setup alerts for error rate spikes, unusual bounce rates, high CPU/latency in edge functions.

- **Incident Response**:

  - Maintain runbooks for key incidents (data breach, service outage).
  - Rotate secrets immediately on suspected compromises.

## 10. Admin Portal & Support Roles

- **Role Definitions**:

  - `super_admin`: full system control, can manage users, view logs.
  - `support`: view metadata (inbox IDs, timestamps), troubleshoot, cannot view decrypted email contents without explicit user consent.

- **MFA & Secure Access**:

  - Require MFA for all admin/support accounts.

- **Audit Trails**:

  - Record all admin actions (deletions, suspensions) with timestamp and actor ID.

## 11. Email Handling & Spam Filtering

- **Inbound Email Validation**:

  - Verify Resend webhook signatures; reject unverified requests.

- **Spam & Malware Filtering**:

  - Use simple content-based rules or integrate third-party APIs to block known spam.
  - Quarantine or drop attachments with disallowed types.

- **Rate Limits on Senders**:

  - Throttle emails per sender/inbox to prevent flooding.

## 12. CI/CD & Developer Practices

- **Secure Pipeline**:

  - Store secrets in a vault (Vercel env vars, GitHub Secrets).
  - Enforce branch protection, code reviews, and automated tests.

- **Static Analysis & Tests**:

  - Integrate linters (ESLint), security scanners, unit/integration tests for critical flows (auth, TTL purge, file upload).

- **Deployment Gates**:

  - Block deploys on failing tests or high-severity vulnerability alerts.

By following these guidelines, Genmail will maintain a robust security posture, protect user privacy, and comply with industry regulations while delivering a seamless disposable email experience.
