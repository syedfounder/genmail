"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function TermsOfService() {
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
                    width={64}
                    height={22}
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
                Terms of Service
              </h1>
              <p className="font-sans text-lg text-muted-foreground mb-4">
                The rules and guidelines for using our temporary email service
              </p>
              <p className="font-sans text-sm text-muted-foreground">
                Last updated: December 17, 2024
              </p>
            </div>

            {/* Introduction */}
            <section className="bg-secondary/30 border border-border/50 rounded-2xl p-8">
              <h2 className="font-sans text-2xl font-semibold mb-4">
                Agreement to Terms
              </h2>
              <p className="font-sans text-muted-foreground leading-relaxed mb-4">
                Welcome to{" "}
                <span className="font-serif font-semibold">genmail</span>. These
                Terms of Service (&ldquo;Terms&rdquo;) govern your use of our
                temporary email service (&ldquo;Service&rdquo;). By accessing or
                using our Service, you agree to be bound by these Terms. If you
                disagree with any part of these terms, then you may not access
                the Service. These terms apply to all visitors, users, and
                others who access or use the Service (&ldquo;Users&rdquo;).
              </p>
              <div className="bg-[#372F84]/10 border border-[#372F84]/20 rounded-lg p-4">
                <p className="font-sans text-sm">
                  <strong>Important:</strong> If you do not agree to these
                  Terms, please do not use our Service.
                </p>
              </div>
            </section>

            {/* Service Description */}
            <section>
              <h2 className="font-sans text-3xl font-semibold mb-6 tracking-tight">
                Service Description
              </h2>

              <div className="bg-background/60 border border-border/50 rounded-xl p-6">
                <p className="font-sans text-muted-foreground leading-relaxed mb-4">
                  <span className="font-serif font-semibold">genmail</span>{" "}
                  provides temporary, disposable email addresses that
                  automatically expire after a set period. Our Service is
                  designed to protect your privacy when signing up for services,
                  newsletters, or any situation where you need an email address
                  temporarily.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h3 className="font-sans font-semibold mb-3 text-green-600 dark:text-green-400">
                      What We Provide
                    </h3>
                    <ul className="font-sans space-y-2 text-sm text-muted-foreground">
                      <li>• Temporary email addresses</li>
                      <li>• Real-time email delivery</li>
                      <li>• Automatic data deletion</li>
                      <li>• No registration required</li>
                      <li>• Free basic service</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold mb-3 text-orange-600 dark:text-orange-400">
                      Service Limitations
                    </h3>
                    <ul className="font-sans space-y-2 text-sm text-muted-foreground">
                      <li>• Temporary nature of inboxes</li>
                      <li>• No email sending capability</li>
                      <li>• Rate limits may apply</li>
                      <li>• Not for sensitive communications</li>
                      <li>• No data recovery after expiration</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Acceptable Use */}
            <section>
              <h2 className="font-sans text-3xl font-semibold mb-6 tracking-tight">
                Acceptable Use Policy
              </h2>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50/50 to-transparent dark:from-green-900/20 border border-green-200/50 dark:border-green-800/50 rounded-xl p-6">
                  <h3 className="font-sans font-semibold text-xl mb-3 text-green-700 dark:text-green-300">
                    ✓ Permitted Uses
                  </h3>
                  <ul className="font-sans space-y-2 text-muted-foreground text-sm">
                    <li>• Account verification and registration</li>
                    <li>• Newsletter trials and subscriptions</li>
                    <li>• File downloads requiring email verification</li>
                    <li>• Testing and development purposes</li>
                    <li>• Protecting your primary email from spam</li>
                    <li>• One-time access to content or services</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-red-50/50 to-transparent dark:from-red-900/20 border border-red-200/50 dark:border-red-800/50 rounded-xl p-6">
                  <h3 className="font-sans font-semibold text-xl mb-3 text-red-700 dark:text-red-300">
                    ✗ Prohibited Uses
                  </h3>
                  <ul className="font-sans space-y-2 text-muted-foreground text-sm">
                    <li>• Illegal activities or circumventing laws</li>
                    <li>• Fraud, impersonation, or deceptive practices</li>
                    <li>• Harassment, spam, or malicious communications</li>
                    <li>• Automated abuse or system overload</li>
                    <li>• Violating third-party terms of service</li>
                    <li>• Creating multiple accounts to bypass limits</li>
                    <li>• Sharing or selling access to generated emails</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* User Responsibilities */}
            <section>
              <h2 className="font-sans text-3xl font-semibold mb-6 tracking-tight">
                User Responsibilities
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
                      Compliance with Laws
                    </h3>
                    <p className="font-sans text-muted-foreground text-sm">
                      You are responsible for ensuring your use of our Service
                      complies with all applicable local, state, federal, and
                      international laws.
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
                      Account Security
                    </h3>
                    <p className="font-sans text-muted-foreground text-sm">
                      You are responsible for maintaining the confidentiality of
                      any temporary email addresses you generate and any
                      received emails.
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
                      Data Backup
                    </h3>
                    <p className="font-sans text-muted-foreground text-sm">
                      You are responsible for backing up any important emails
                      before they expire. We cannot recover expired data.
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
                      Respectful Use
                    </h3>
                    <p className="font-sans text-muted-foreground text-sm">
                      Use our Service fairly and respectfully. Do not attempt to
                      overload, hack, or abuse our systems.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Service Availability */}
            <section>
              <h2 className="font-sans text-3xl font-semibold mb-6 tracking-tight">
                Service Availability & Limitations
              </h2>

              <div className="bg-background/60 border border-border/50 rounded-xl p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-sans font-semibold text-xl mb-4">
                      Service Availability
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>
                        • We strive for 99.9% uptime but cannot guarantee it
                      </li>
                      <li>
                        • Scheduled maintenance will be announced when possible
                      </li>
                      <li>
                        • Service may be temporarily unavailable due to
                        technical issues
                      </li>
                      <li>
                        • We reserve the right to modify or discontinue features
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-xl mb-4">
                      Rate Limits
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Free users may be subject to usage limits</li>
                      <li>
                        • Excessive use may result in temporary restrictions
                      </li>
                      <li>• Automated access may be blocked</li>
                      <li>• Limits help ensure fair access for all users</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Privacy & Data */}
            <section>
              <h2 className="font-sans text-3xl font-semibold mb-6 tracking-tight">
                Privacy & Data Handling
              </h2>

              <div className="bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 rounded-xl p-6">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Your privacy is paramount to us. By using our Service, you
                  acknowledge and agree to our data handling practices as
                  outlined in our Privacy Policy.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-sans font-semibold mb-3">
                      Data Collection
                    </h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Temporary email content</li>
                      <li>• Basic technical information</li>
                      <li>• Usage patterns (anonymized)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold mb-3">
                      Data Protection
                    </h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Automatic data deletion</li>
                      <li>• Encrypted data transmission</li>
                      <li>• No data selling or sharing</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/30">
                  <Link
                    href="/privacy"
                    className="inline-flex items-center gap-2 text-[#372F84] hover:text-[#372F84]/80 transition-colors text-sm font-medium"
                  >
                    Read our full Privacy Policy
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
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </section>

            {/* Disclaimers */}
            <section>
              <h2 className="font-sans text-3xl font-semibold mb-6 tracking-tight">
                Disclaimers & Limitation of Liability
              </h2>

              <div className="space-y-6">
                <div className="bg-orange-50/50 dark:bg-orange-900/20 border border-orange-200/50 dark:border-orange-800/50 rounded-xl p-6">
                  <h3 className="font-sans font-semibold text-xl mb-3 text-orange-700 dark:text-orange-300">
                    Service &ldquo;As-Is&rdquo;
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Our Service is provided &ldquo;as-is&rdquo; without
                    warranties of any kind, either express or implied. We do not
                    guarantee that the Service will be uninterrupted, secure, or
                    error-free. Use at your own risk.
                  </p>
                </div>

                <div className="bg-red-50/50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50 rounded-xl p-6">
                  <h3 className="font-sans font-semibold text-xl mb-3 text-red-700 dark:text-red-300">
                    Limitation of Liability
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    To the maximum extent permitted by law, we shall not be
                    liable for any indirect, incidental, special, consequential,
                    or punitive damages, including but not limited to:
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Loss of data or emails</li>
                    <li>• Business interruption</li>
                    <li>• Lost profits or revenue</li>
                    <li>• Failure to deliver emails</li>
                    <li>• Third-party actions</li>
                  </ul>
                </div>

                <div className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 rounded-xl p-6">
                  <h3 className="font-sans font-semibold text-xl mb-3 text-blue-700 dark:text-blue-300">
                    User Indemnification
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    You agree to indemnify and hold us harmless from any claims,
                    damages, or expenses arising from your use of the Service,
                    violation of these Terms, or infringement of any rights of
                    another party.
                  </p>
                </div>
              </div>
            </section>

            {/* Termination */}
            <section>
              <h2 className="font-sans text-3xl font-semibold mb-6 tracking-tight">
                Termination
              </h2>

              <div className="bg-background/60 border border-border/50 rounded-xl p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-sans font-semibold text-xl mb-4">
                      By You
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                      You may stop using our Service at any time by simply
                      closing your browser or navigating away from our website.
                      No formal termination process is required.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-xl mb-4">
                      By Us
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                      We may suspend or terminate your access to our Service
                      immediately if you violate these Terms or engage in
                      prohibited activities.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/30">
                  <p className="text-sm text-muted-foreground">
                    <strong>Effect of Termination:</strong> Upon termination,
                    your right to use the Service ceases immediately. Any
                    temporary emails and data will be deleted according to our
                    normal expiration schedule.
                  </p>
                </div>
              </div>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="font-sans text-3xl font-semibold mb-6 tracking-tight">
                Changes to Terms
              </h2>

              <div className="bg-gradient-to-r from-purple-50/50 to-transparent dark:from-purple-900/20 border border-purple-200/50 dark:border-purple-800/50 rounded-xl p-6">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We reserve the right to modify these Terms at any time. When
                  we make changes:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    • We will update the &ldquo;Last updated&rdquo; date at the
                    top of this page
                  </li>
                  <li>
                    • Significant changes will be highlighted on our homepage
                  </li>
                  <li>
                    • Continued use of the Service after changes constitutes
                    acceptance
                  </li>
                  <li>
                    • You are encouraged to review these Terms periodically
                  </li>
                </ul>
              </div>
            </section>

            {/* Contact & Governing Law */}
            <section>
              <h2 className="font-sans text-3xl font-semibold mb-6 tracking-tight">
                Contact Information & Legal
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-background/60 border border-border/50 rounded-xl p-6">
                  <h3 className="font-sans font-semibold text-xl mb-4">
                    Contact Us
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    If you have questions about these Terms of Service:
                  </p>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Email:</strong> legal@genmail.io
                    </p>
                    <p>
                      <strong>Response Time:</strong> Within 48 hours
                    </p>
                  </div>
                </div>

                <div className="bg-background/60 border border-border/50 rounded-xl p-6">
                  <h3 className="font-sans font-semibold text-xl mb-4">
                    Governing Law
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    These Terms are governed by and construed in accordance with
                    applicable laws. Any disputes will be resolved through
                    binding arbitration where permitted by law.
                  </p>
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
