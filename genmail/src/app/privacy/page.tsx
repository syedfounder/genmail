"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function PrivacyPolicy() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
        {/* Gradients */}
        {mounted && (
          <div className="absolute top-0 left-0 w-full h-[800px] pointer-events-none bg-noise opacity-[0.05]"></div>
        )}

        {/* Header is now handled by layout.tsx */}

        {/* Main Content */}
        <main className="flex flex-col items-center flex-1 px-6 pt-10 pb-20 relative z-10">
          <article className="prose prose-invert lg:prose-xl max-w-4xl w-full font-sans tracking-tight">
            <h1>Privacy Policy</h1>
            <p className="text-muted-foreground">
              How we protect your privacy when using temporary email services
            </p>
            <p className="text-sm text-muted-foreground">
              Last updated: June 24, 2025
            </p>

            {/* Introduction */}
            <section className="bg-secondary/30 border border-border/50 rounded-2xl p-8 my-12">
              <h2 className="font-sans text-2xl font-semibold mb-4">
                Our Commitment to Privacy
              </h2>
              <p className="font-sans text-muted-foreground leading-relaxed">
                At <span className="font-serif font-semibold">genmail</span>,
                privacy is not just a feature—it&apos;s our core principle. This
                Privacy Policy explains how we collect, use, and protect your
                information when you use our temporary email service. We believe
                in complete transparency about our data practices. We&apos;re
                committed to &ldquo;privacy by design&rdquo; principles.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="my-12">
              <h2 className="font-sans text-3xl font-semibold mb-6 tracking-tight">
                Information We Collect
              </h2>

              <div className="space-y-6">
                <div className="bg-background/60 border border-border/50 rounded-xl p-6">
                  <h3 className="font-sans font-semibold text-xl mb-3">
                    Temporary Email Data
                  </h3>
                  <ul className="font-sans space-y-2 text-muted-foreground">
                    <li>• Generated temporary email addresses</li>
                    <li>• Received emails and their content</li>
                    <li>• Email metadata (sender, subject, timestamp)</li>
                    <li>• Inbox expiration times</li>
                  </ul>
                  <p className="font-sans text-sm text-muted-foreground mt-3 italic">
                    Note: All email data is automatically deleted when your
                    inbox expires.
                  </p>
                </div>

                <div className="bg-background/60 border border-border/50 rounded-xl p-6">
                  <h3 className="font-sans font-semibold text-xl mb-3">
                    Technical Information
                  </h3>
                  <ul className="font-sans space-y-2 text-muted-foreground">
                    <li>• IP address (for spam prevention and security)</li>
                    <li>• Browser type and version</li>
                    <li>• Device information and screen resolution</li>
                    <li>• Usage patterns and timestamps</li>
                  </ul>
                </div>

                <div className="bg-background/60 border border-border/50 rounded-xl p-6">
                  <h3 className="font-sans font-semibold text-xl mb-3">
                    What We DON&apos;T Collect
                  </h3>
                  <ul className="font-sans space-y-2 text-muted-foreground">
                    <li>• Personal identification information</li>
                    <li>
                      • Account registration data (we don&apos;t require
                      accounts)
                    </li>
                    <li>• Payment information (our service is free)</li>
                    <li>• Location data beyond IP geolocation</li>
                    <li>
                      • Cookies for tracking (only essential functionality)
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section className="my-12">
              <h2 className="font-sans text-3xl font-semibold mb-6 tracking-tight">
                How We Use Your Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-900/20 border border-green-200/50 dark:border-green-800/50 rounded-xl p-6">
                  <h3 className="font-sans font-semibold text-xl mb-3 text-green-700 dark:text-green-300">
                    Service Operation
                  </h3>
                  <ul className="font-sans space-y-2 text-muted-foreground text-sm">
                    <li>• Delivering emails to your temporary inbox</li>
                    <li>• Managing inbox lifecycle and expiration</li>
                    <li>• Providing real-time email notifications</li>
                    <li>• Ensuring service functionality and uptime</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 rounded-xl p-6">
                  <h3 className="font-sans font-semibold text-xl mb-3 text-blue-700 dark:text-blue-300">
                    Security & Protection
                  </h3>
                  <ul className="font-sans space-y-2 text-muted-foreground text-sm">
                    <li>• Preventing spam and abuse</li>
                    <li>• Detecting fraudulent activities</li>
                    <li>• Rate limiting to ensure fair usage</li>
                    <li>• Protecting against DDoS attacks</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-900/20 border border-purple-200/50 dark:border-purple-800/50 rounded-xl p-6">
                  <h3 className="font-sans font-semibold text-xl mb-3 text-purple-700 dark:text-purple-300">
                    Service Improvement
                  </h3>
                  <ul className="font-sans space-y-2 text-muted-foreground text-sm">
                    <li>• Analyzing usage patterns (anonymized)</li>
                    <li>• Optimizing performance and reliability</li>
                    <li>• Developing new features</li>
                    <li>• Monitoring service health</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-orange-50/50 to-transparent dark:from-orange-900/20 border border-orange-200/50 dark:border-orange-800/50 rounded-xl p-6">
                  <h3 className="font-sans font-semibold text-xl mb-3 text-orange-700 dark:text-orange-300">
                    Legal Compliance
                  </h3>
                  <ul className="font-sans space-y-2 text-muted-foreground text-sm">
                    <li>• Complying with applicable laws</li>
                    <li>• Responding to legal requests (when required)</li>
                    <li>• Protecting our rights and property</li>
                    <li>• Ensuring user safety</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Retention */}
            <section className="my-12">
              <h2 className="font-sans text-3xl font-semibold mb-6 tracking-tight">
                Data Retention & Deletion
              </h2>

              <div className="bg-gradient-to-r from-red-50/50 to-orange-50/50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200/50 dark:border-red-800/50 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <svg
                    className="w-6 h-6 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h3 className="font-sans font-semibold text-xl">
                    Zero Data Retention Promise
                  </h3>
                </div>
                <div className="font-sans space-y-4 text-muted-foreground">
                  <p>
                    <strong>Email Content:</strong> All emails and inbox data
                    are automatically deleted when your temporary inbox expires.
                    No manual deletion required.
                  </p>
                  <p>
                    <strong>Technical Logs:</strong> Server logs containing IP
                    addresses are retained for a maximum of 7 days for security
                    purposes, then permanently deleted.
                  </p>
                  <p>
                    <strong>Analytics Data:</strong> We only keep anonymized
                    usage statistics that cannot be linked back to individual
                    users.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section className="my-12">
              <h2 className="font-sans text-3xl font-semibold mb-6 tracking-tight">
                Data Sharing & Third Parties
              </h2>

              <div className="bg-background/60 border border-border/50 rounded-xl p-6">
                <p className="font-sans text-lg font-medium mb-4">
                  We do NOT sell, trade, or share your personal data with third
                  parties.
                </p>
                <p className="font-sans text-muted-foreground mb-4">
                  Limited data sharing may occur only in these specific
                  circumstances:
                </p>
                <ul className="font-sans space-y-2 text-muted-foreground">
                  <li>
                    • <strong>Service Providers:</strong> Essential
                    infrastructure partners (hosting, email delivery) who are
                    bound by strict confidentiality agreements
                  </li>
                  <li>
                    • <strong>Legal Requirements:</strong> When required by law,
                    court order, or to protect against fraud and abuse
                  </li>
                  <li>
                    • <strong>Business Transfer:</strong> In the unlikely event
                    of a merger or acquisition (with advance notice to users)
                  </li>
                </ul>
              </div>
            </section>

            {/* Security Measures */}
            <section className="my-12">
              <h2 className="font-sans text-3xl font-semibold mb-6 tracking-tight">
                Security Measures
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-secondary/30 border border-border/50 rounded-xl">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="font-sans font-semibold mb-2">
                    TLS Encryption
                  </h3>
                  <p className="font-sans text-sm text-muted-foreground">
                    All data in transit is protected with TLS 1.3 encryption
                  </p>
                </div>

                <div className="text-center p-6 bg-secondary/30 border border-border/50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="font-sans font-semibold mb-2">
                    Secure Infrastructure
                  </h3>
                  <p className="font-sans text-sm text-muted-foreground">
                    Hosted on enterprise-grade cloud infrastructure with
                    security monitoring
                  </p>
                </div>

                <div className="text-center p-6 bg-secondary/30 border border-border/50 rounded-xl">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-purple-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979.236.393.336.823.336 1.021 0 .192-.086.469-.288.617-.202.148-.539.222-.712.222-.175 0-.51-.074-.712-.222-.202-.148-.288-.425-.288-.617 0-.198.1-.628.336-1.021zM10 15a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="font-sans font-semibold mb-2">
                    Access Controls
                  </h3>
                  <p className="font-sans text-sm text-muted-foreground">
                    Strict access controls and regular security audits
                  </p>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section className="my-12">
              <h2 className="font-sans text-3xl font-semibold mb-6 tracking-tight">
                Your Privacy Rights
              </h2>

              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-secondary/20 border border-border/50 rounded-lg">
                  <div className="w-8 h-8 bg-[#372F84]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#372F84] font-semibold text-sm">
                      1
                    </span>
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold mb-1">
                      Right to Access
                    </h3>
                    <p className="font-sans text-muted-foreground text-sm">
                      All your temporary email data is immediately visible in
                      your inbox. No hidden data collection.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-secondary/20 border border-border/50 rounded-lg">
                  <div className="w-8 h-8 bg-[#372F84]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#372F84] font-semibold text-sm">
                      2
                    </span>
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold mb-1">
                      Right to Deletion
                    </h3>
                    <p className="font-sans text-muted-foreground text-sm">
                      Your data is automatically deleted when your inbox
                      expires. You can also close your browser to stop using the
                      service immediately.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-secondary/20 border border-border/50 rounded-lg">
                  <div className="w-8 h-8 bg-[#372F84]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#372F84] font-semibold text-sm">
                      3
                    </span>
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold mb-1">
                      Right to Portability
                    </h3>
                    <p className="font-sans text-muted-foreground text-sm">
                      You can copy or download any emails received in your
                      temporary inbox at any time.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-secondary/20 border border-border/50 rounded-lg">
                  <div className="w-8 h-8 bg-[#372F84]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#372F84] font-semibold text-sm">
                      4
                    </span>
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold mb-1">
                      Right to Object
                    </h3>
                    <p className="font-sans text-muted-foreground text-sm">
                      You can stop using our service at any time. No account to
                      delete, no unsubscribe process needed.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="my-12">
              <h2 className="font-sans text-3xl font-semibold mb-6 tracking-tight">
                Contact & Updates
              </h2>

              <div className="bg-gradient-to-r from-[#372F84]/5 to-transparent border border-[#372F84]/20 rounded-2xl p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-sans font-semibold text-xl mb-4">
                      Questions About Privacy?
                    </h3>
                    <p className="font-sans text-muted-foreground mb-4">
                      If you have any questions about this Privacy Policy or our
                      data practices, please contact us:
                    </p>
                    <div className="font-sans space-y-2 text-sm">
                      <p>
                        <strong>Email:</strong> privacy@genmail.io
                      </p>
                      <p>
                        <strong>Response Time:</strong> Within 24 hours
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-xl mb-4">
                      Policy Updates
                    </h3>
                    <p className="font-sans text-muted-foreground mb-4">
                      We may update this Privacy Policy occasionally. When we
                      do:
                    </p>
                    <ul className="font-sans space-y-1 text-sm text-muted-foreground">
                      <li>
                        • We&apos;ll update the &ldquo;Last updated&rdquo; date
                      </li>
                      <li>
                        • Major changes will be highlighted on our homepage
                      </li>
                      <li>• Continued use constitutes acceptance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </article>
        </main>
        {/* Footer */}
        <footer className="bg-background border-t border-border/30 py-16 px-6 font-sans relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              {/* Brand Column */}
              <div className="md:col-span-1">
                <div className="flex items-center mb-4">
                  {mounted && (
                    <Image
                      src={theme === "dark" ? "/logo-dark.png" : "/logo.png"}
                      alt="Genmail Logo"
                      width={64}
                      height={22}
                    />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Private, temporary email addresses that self-destruct. Protect
                  your privacy online with zero data retention.
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span>Service Online</span>
                </div>
              </div>

              {/* Product Column */}
              <div>
                <h3 className="font-semibold text-foreground mb-4 tracking-tight">
                  Product
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="/pricing"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      href="#how-it-works"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      How it Works
                    </a>
                  </li>
                  <li>
                    <a
                      href="/api"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      API
                    </a>
                  </li>
                  <li>
                    <a
                      href="#pro-features"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Pro Features
                    </a>
                  </li>
                </ul>
              </div>

              {/* Quick Access Column */}
              <div>
                <h3 className="font-semibold text-foreground mb-4 tracking-tight">
                  Quick Access
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="/#hero"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Generate Email
                    </a>
                  </li>
                  <li>
                    <a
                      href="/#tutorial"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Tutorial
                    </a>
                  </li>
                  <li>
                    <a
                      href="/pricing"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      href="/#technology"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Technology
                    </a>
                  </li>
                  <li>
                    <a
                      href="/#use-cases"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Use Cases
                    </a>
                  </li>
                  <li>
                    <a
                      href="/#faq"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      FAQs
                    </a>
                  </li>
                </ul>
              </div>

              {/* Support & Legal Column */}
              <div>
                <h3 className="font-semibold text-foreground mb-4 tracking-tight">
                  Support & Legal
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="/help"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a
                      href="/contact"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="/privacy"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="/terms"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a
                      href="/security"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Security
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-border/20 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                {/* Left: Copyright & Built with */}
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <p className="text-sm text-muted-foreground">
                    © 2024 <span className="font-serif">genmail</span>. All
                    rights reserved.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Built with</span>
                    <a
                      href="https://lovable.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors"
                    >
                      <Image
                        src="/lovable-logo-black.svg"
                        alt="Lovable"
                        width={60}
                        height={10}
                        className="dark:hidden"
                      />
                      <Image
                        src="/lovable-logo-white.svg"
                        alt="Lovable"
                        width={60}
                        height={10}
                        className="hidden dark:block"
                      />
                    </a>
                    <span>&</span>
                    <a
                      href="https://cursor.sh"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors"
                    >
                      <Image
                        src="/cursor-logo.svg"
                        alt="Cursor"
                        width={46}
                        height={9}
                        className="dark:hidden"
                      />
                      <Image
                        src="/cursor-logo-white.svg"
                        alt="Cursor"
                        width={46}
                        height={9}
                        className="hidden dark:block"
                      />
                    </a>
                  </div>
                </div>

                {/* Right: Security badges */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-3 h-3 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>GDPR Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-3 h-3 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>TLS Encrypted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-3 h-3 text-purple-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Zero Logs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}
