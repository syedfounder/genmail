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
      <div className="min-h-screen bg-background text-foreground">
        {/* Navigation */}
        <nav className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center">
                {mounted && (
                  <Image
                    src={theme === "dark" ? "/logo-dark.png" : "/logo.png"}
                    alt="Genmail Logo"
                    width={100}
                    height={35}
                  />
                )}
              </Link>
              <div className="flex items-center gap-6">
                <Link
                  href="/"
                  className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Back to Home
                </Link>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="font-sans max-w-4xl mx-auto px-6 py-16">
          <div className="space-y-12">
            {/* Header */}
            <div className="text-center">
              <h1 className="font-serif text-5xl font-bold tracking-tighter mb-6">
                Privacy Policy
              </h1>
              <p className="font-sans text-lg text-muted-foreground mb-4">
                How we protect your privacy when using temporary email services
              </p>
              <p className="font-sans text-sm text-muted-foreground">
                Last updated: December 17, 2024
              </p>
            </div>

            {/* Introduction */}
            <section className="bg-secondary/30 border border-border/50 rounded-2xl p-8">
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
            <section>
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
            <section>
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
            <section>
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
            <section>
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
            <section>
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
            <section>
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
            <section>
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

            {/* Back to Home */}
            <div className="text-center pt-12">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-[#372F84] hover:bg-[#372F84]/90 text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to <span className="font-serif">genmail</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
