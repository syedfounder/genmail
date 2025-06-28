"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
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
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
        {/* Gradients */}
        {mounted && (
          <div className="absolute top-0 left-0 w-full h-[800px] pointer-events-none bg-noise opacity-[0.05]"></div>
        )}

        {/* Header is now handled by layout.tsx */}

        {/* Main Content */}
        <main className="flex flex-col items-center flex-1 px-6 pt-10 pb-20 relative z-10">
          <article className="max-w-4xl w-full">
            <h1 className="font-sans text-5xl font-bold tracking-tighter mb-4">
              Terms of Service
            </h1>
            <p className="font-sans text-lg text-muted-foreground">
              The rules and guidelines for using our temporary email service
            </p>
            <p className="font-sans text-sm text-muted-foreground">
              Last updated: December 17, 2024
            </p>

            {/* Introduction */}
            <section className="bg-secondary/30 border border-border/50 rounded-2xl p-8 my-12">
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
            <section className="my-12">
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
            <section className="my-12">
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
            <section className="my-12">
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
            <section className="my-12">
              <h2 className="font-sans text-3xl font-semibold mb-6 tracking-tight">
                Service Availability & Limitations
              </h2>

              <div className="bg-background/60 border border-border/50 rounded-xl p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-sans font-semibold text-xl mb-4">
                      Service Availability
                    </h3>
                    <ul className="font-sans space-y-2 text-sm text-muted-foreground">
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
                    <ul className="font-sans space-y-2 text-sm text-muted-foreground">
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
            <section className="my-12">
              <h2 className="font-sans text-3xl font-semibold mb-6 tracking-tight">
                Privacy & Data Handling
              </h2>

              <div className="bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 rounded-xl p-6">
                <div className="font-sans">
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
              </div>
            </section>

            {/* Disclaimers */}
            <section className="my-12">
              <h2 className="font-sans text-3xl font-semibold mb-6 tracking-tight">
                Disclaimer of Warranties
              </h2>

              <div className="font-sans space-y-6">
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
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3 font-sans">
                    To the maximum extent permitted by law, we shall not be
                    liable for any indirect, incidental, special, consequential,
                    or punitive damages, including but not limited to:
                  </p>
                  <ul className="font-sans space-y-1 text-sm text-muted-foreground">
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
                  <p className="font-sans text-muted-foreground text-sm leading-relaxed">
                    You agree to indemnify and hold us harmless from any claims,
                    damages, or expenses arising from your use of the Service,
                    violation of these Terms, or infringement of any rights of
                    another party.
                  </p>
                </div>
              </div>
            </section>

            {/* Termination */}
            <section className="my-12">
              <h2 className="font-sans text-3xl font-semibold mb-6 tracking-tight">
                Termination
              </h2>

              <div className="bg-background/60 border border-border/50 rounded-xl p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-sans font-semibold text-xl mb-4">
                      By You
                    </h3>
                    <p className="font-sans text-muted-foreground text-sm leading-relaxed mb-3">
                      You may stop using our Service at any time by simply
                      closing your browser or navigating away from our website.
                      No formal termination process is required.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-xl mb-4">
                      By Us
                    </h3>
                    <p className="font-sans text-muted-foreground text-sm leading-relaxed mb-3">
                      We may suspend or terminate your access to our Service
                      immediately if you violate these Terms or engage in
                      prohibited activities.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/30">
                  <p className="font-sans text-sm text-muted-foreground">
                    <strong>Effect of Termination:</strong> Upon termination,
                    your right to use the Service ceases immediately. Any
                    temporary emails and data will be deleted according to our
                    normal expiration schedule.
                  </p>
                </div>
              </div>
            </section>

            {/* Changes to Terms */}
            <section className="my-12">
              <h2 className="font-sans text-3xl font-semibold mb-6 tracking-tight">
                Changes to These Terms
              </h2>

              <div className="bg-gradient-to-r from-purple-50/50 to-transparent dark:from-purple-900/20 border border-purple-200/50 dark:border-purple-800/50 rounded-xl p-6">
                <p className="font-sans text-muted-foreground leading-relaxed mb-4">
                  We reserve the right to modify these Terms at any time. When
                  we make changes:
                </p>
                <ul className="font-sans space-y-2 text-sm text-muted-foreground">
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

            {/* Contact Information */}
            <section className="my-12">
              <h2 className="font-sans text-3xl font-semibold mb-6 tracking-tight">
                Contact Information
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-background/60 border border-border/50 rounded-xl p-6">
                  <h3 className="font-sans font-semibold text-xl mb-4">
                    Contact Us
                  </h3>
                  <p className="font-sans text-muted-foreground text-sm mb-4">
                    If you have questions about these Terms of Service:
                  </p>
                  <div className="font-sans space-y-2 text-sm">
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
                  <p className="font-sans text-muted-foreground text-sm leading-relaxed">
                    These Terms are governed by and construed in accordance with
                    applicable laws. Any disputes will be resolved through
                    binding arbitration where permitted by law.
                  </p>
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
                    © 2024{" "}
                    <span className="font-serif font-semibold">genmail</span>.
                    All rights reserved.
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
