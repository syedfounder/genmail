"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function Security() {
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
                Security
              </h1>
              <p className="font-sans text-lg text-muted-foreground mb-4">
                How we protect your temporary emails and maintain the highest
                security standards
              </p>
              <p className="font-sans text-sm text-muted-foreground">
                Last updated: December 17, 2024
              </p>
            </div>

            {/* Introduction */}
            <section className="bg-secondary/30 border border-border/50 rounded-2xl p-8">
              <h2 className="font-sans text-2xl font-semibold mb-4">
                Security-First Approach
              </h2>
              <p className="font-sans text-muted-foreground leading-relaxed">
                At <span className="font-serif font-semibold">genmail</span>,
                security isn't an afterthought—it's built into every aspect of
                our service. We understand that trust is paramount when handling
                your email communications, even temporary ones. This page
                outlines the comprehensive security measures we've implemented
                to protect your data and ensure your privacy.
              </p>
            </section>

            {/* Infrastructure Security */}
            <section>
              <h2 className="font-sans text-3xl font-semibold mb-6 tracking-tight">
                Infrastructure Security
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 rounded-xl p-6">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-blue-500"
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
                  <h3 className="font-sans font-semibold text-xl mb-3 text-blue-700 dark:text-blue-300">
                    Enterprise-Grade Hosting
                  </h3>
                  <ul className="font-sans space-y-2 text-muted-foreground text-sm">
                    <li>• ISO 27001 certified data centers</li>
                    <li>• 24/7 physical security monitoring</li>
                    <li>• Redundant power and network systems</li>
                    <li>• Multi-zone deployment for reliability</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-900/20 border border-green-200/50 dark:border-green-800/50 rounded-xl p-6">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="font-sans font-semibold text-xl mb-3 text-green-700 dark:text-green-300">
                    Network Protection
                  </h3>
                  <ul className="font-sans space-y-2 text-muted-foreground text-sm">
                    <li>• DDoS protection and mitigation</li>
                    <li>• Web Application Firewall (WAF)</li>
                    <li>• Network segmentation and isolation</li>
                    <li>• Real-time threat monitoring</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-900/20 border border-purple-200/50 dark:border-purple-800/50 rounded-xl p-6">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-purple-500"
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
                  <h3 className="font-sans font-semibold text-xl mb-3 text-purple-700 dark:text-purple-300">
                    Access Controls
                  </h3>
                  <ul className="font-sans space-y-2 text-muted-foreground text-sm">
                    <li>• Multi-factor authentication required</li>
                    <li>• Role-based access permissions</li>
                    <li>• Regular access reviews and audits</li>
                    <li>• Principle of least privilege</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-orange-50/50 to-transparent dark:from-orange-900/20 border border-orange-200/50 dark:border-orange-800/50 rounded-xl p-6">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-orange-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="font-sans font-semibold text-xl mb-3 text-orange-700 dark:text-orange-300">
                    System Monitoring
                  </h3>
                  <ul className="font-sans space-y-2 text-muted-foreground text-sm">
                    <li>• 24/7 automated monitoring</li>
                    <li>• Anomaly detection and alerting</li>
                    <li>• Performance and security metrics</li>
                    <li>• Incident response automation</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Protection */}
            <section>
              <h2 className="font-sans text-3xl font-semibold mb-6 tracking-tight">
                Data Protection & Encryption
              </h2>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50/50 to-transparent dark:from-green-900/20 border border-green-200/50 dark:border-green-800/50 rounded-xl p-6">
                  <h3 className="font-sans font-semibold text-xl mb-3 text-green-700 dark:text-green-300">
                    End-to-End Encryption
                  </h3>
                  <div className="font-sans text-muted-foreground text-sm space-y-3">
                    <p>
                      <strong>In Transit:</strong> All data transmission uses
                      TLS 1.3 encryption, ensuring your emails are protected
                      from interception during delivery.
                    </p>
                    <p>
                      <strong>At Rest:</strong> Email content is encrypted using
                      AES-256 encryption before being stored, with keys managed
                      through secure key management systems.
                    </p>
                    <p>
                      <strong>Processing:</strong> Email processing occurs in
                      secure, isolated environments with encrypted memory and
                      storage.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-50/50 to-transparent dark:from-red-900/20 border border-red-200/50 dark:border-red-800/50 rounded-xl p-6">
                  <h3 className="font-sans font-semibold text-xl mb-3 text-red-700 dark:text-red-300">
                    Automatic Data Destruction
                  </h3>
                  <div className="font-sans text-muted-foreground text-sm space-y-3">
                    <p>
                      <strong>Secure Deletion:</strong> When your temporary
                      inbox expires, all data is cryptographically wiped using
                      DoD 5220.22-M standards.
                    </p>
                    <p>
                      <strong>Immediate Processing:</strong> Deletion occurs
                      automatically without manual intervention, ensuring
                      consistent data lifecycle management.
                    </p>
                    <p>
                      <strong>Verification:</strong> Our systems verify
                      successful deletion and log the process for audit
                      purposes.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 rounded-xl p-6">
                  <h3 className="font-sans font-semibold text-xl mb-3 text-blue-700 dark:text-blue-300">
                    Zero-Knowledge Architecture
                  </h3>
                  <div className="font-sans text-muted-foreground text-sm space-y-3">
                    <p>
                      <strong>No Persistent Storage:</strong> We don't maintain
                      logs or backups of your email content beyond the temporary
                      inbox lifetime.
                    </p>
                    <p>
                      <strong>Minimal Metadata:</strong> Only essential delivery
                      metadata is temporarily stored, automatically deleted with
                      the inbox.
                    </p>
                    <p>
                      <strong>Privacy by Design:</strong> Our systems are
                      architected to minimize data exposure at every level.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Compliance & Auditing */}
            <section>
              <h2 className="font-sans text-3xl font-semibold mb-6 tracking-tight">
                Compliance & Auditing
              </h2>

              <div className="bg-background/60 border border-border/50 rounded-xl p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-sans font-semibold text-xl mb-4">
                      Security Standards
                    </h3>
                    <ul className="font-sans space-y-2 text-sm text-muted-foreground">
                      <li>• GDPR compliance for EU users</li>
                      <li>• CCPA compliance for California residents</li>
                      <li>• SOC 2 Type II certified infrastructure</li>
                      <li>• Regular penetration testing</li>
                      <li>• Vulnerability assessments</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-xl mb-4">
                      Audit Procedures
                    </h3>
                    <ul className="font-sans space-y-2 text-sm text-muted-foreground">
                      <li>• Quarterly security reviews</li>
                      <li>• Annual third-party security audits</li>
                      <li>• Continuous compliance monitoring</li>
                      <li>• Incident response documentation</li>
                      <li>• Regular policy updates</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Threat Detection */}
            <section>
              <h2 className="font-sans text-3xl font-semibold mb-6 tracking-tight">
                Threat Detection & Response
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
                      Real-Time Monitoring
                    </h3>
                    <p className="font-sans text-muted-foreground text-sm">
                      Advanced monitoring systems track all system activity,
                      detecting suspicious patterns and potential security
                      threats in real-time.
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
                      Automated Response
                    </h3>
                    <p className="font-sans text-muted-foreground text-sm">
                      Immediate automated responses to detected threats,
                      including IP blocking, service isolation, and alert
                      escalation to our security team.
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
                      Incident Management
                    </h3>
                    <p className="font-sans text-muted-foreground text-sm">
                      Structured incident response procedures with defined
                      escalation paths, forensic capabilities, and post-incident
                      analysis.
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
                      Continuous Improvement
                    </h3>
                    <p className="font-sans text-muted-foreground text-sm">
                      Regular security assessments, threat modeling updates, and
                      implementation of new security measures based on emerging
                      threats.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Security Best Practices */}
            <section>
              <h2 className="font-sans text-3xl font-semibold mb-6 tracking-tight">
                User Security Best Practices
              </h2>

              <div className="bg-gradient-to-r from-[#372F84]/5 to-transparent border border-[#372F84]/20 rounded-2xl p-8">
                <p className="font-sans text-muted-foreground leading-relaxed mb-6">
                  While we implement comprehensive security measures, here are
                  some best practices to help you maximize your security when
                  using temporary emails:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-sans font-semibold text-lg mb-3 text-green-600 dark:text-green-400">
                      ✓ Recommended Practices
                    </h3>
                    <ul className="font-sans space-y-2 text-sm text-muted-foreground">
                      <li>• Use temporary emails for one-time registrations</li>
                      <li>• Avoid sharing sensitive personal information</li>
                      <li>• Copy important information before inbox expires</li>
                      <li>
                        • Use different temporary emails for different services
                      </li>
                      <li>• Access from secure, trusted networks</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-lg mb-3 text-red-600 dark:text-red-400">
                      ✗ Avoid These Uses
                    </h3>
                    <ul className="font-sans space-y-2 text-sm text-muted-foreground">
                      <li>• Banking or financial account registrations</li>
                      <li>• Long-term business communications</li>
                      <li>• Receiving highly sensitive documents</li>
                      <li>• Identity verification for critical services</li>
                      <li>• Any service requiring permanent email access</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Vulnerability Disclosure */}
            <section>
              <h2 className="font-sans text-3xl font-semibold mb-6 tracking-tight">
                Vulnerability Disclosure
              </h2>

              <div className="bg-background/60 border border-border/50 rounded-xl p-6">
                <p className="font-sans text-muted-foreground leading-relaxed mb-6">
                  We believe in responsible disclosure and welcome security
                  researchers to help us improve our security posture. If you
                  discover a security vulnerability, please follow our
                  responsible disclosure process.
                </p>

                <div className="space-y-4">
                  <div className="bg-secondary/30 border border-border/30 rounded-lg p-4">
                    <h3 className="font-sans font-semibold mb-2">
                      Reporting Process
                    </h3>
                    <ol className="font-sans space-y-2 text-sm text-muted-foreground">
                      <li>
                        1. Email security@genmail.io with vulnerability details
                      </li>
                      <li>
                        2. Include proof-of-concept (if applicable) and impact
                        assessment
                      </li>
                      <li>3. Allow us 48 hours to acknowledge receipt</li>
                      <li>
                        4. Work with us to verify and understand the issue
                      </li>
                      <li>
                        5. Coordinate public disclosure after fix deployment
                      </li>
                    </ol>
                  </div>

                  <div className="bg-green-50/50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-800/50 rounded-lg p-4">
                    <h3 className="font-sans font-semibold mb-2 text-green-700 dark:text-green-300">
                      Bug Bounty Program
                    </h3>
                    <p className="font-sans text-sm text-muted-foreground">
                      We offer recognition and rewards for valid security
                      vulnerabilities. Rewards range from $50 to $5,000
                      depending on severity and impact. Contact us for program
                      details and scope.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact & Updates */}
            <section>
              <h2 className="font-sans text-3xl font-semibold mb-6 tracking-tight">
                Security Contact & Updates
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-background/60 border border-border/50 rounded-xl p-6">
                  <h3 className="font-sans font-semibold text-xl mb-4">
                    Security Team Contact
                  </h3>
                  <p className="font-sans text-muted-foreground text-sm mb-4">
                    For security-related questions, concerns, or reports:
                  </p>
                  <div className="font-sans space-y-2 text-sm">
                    <p>
                      <strong>Email:</strong> security@genmail.io
                    </p>
                    <p>
                      <strong>Response Time:</strong> Within 24 hours
                    </p>
                    <p>
                      <strong>Escalation:</strong> Critical issues within 2
                      hours
                    </p>
                  </div>
                </div>

                <div className="bg-background/60 border border-border/50 rounded-xl p-6">
                  <h3 className="font-sans font-semibold text-xl mb-4">
                    Security Updates
                  </h3>
                  <p className="font-sans text-muted-foreground text-sm mb-4">
                    Stay informed about our security practices:
                  </p>
                  <ul className="font-sans space-y-1 text-sm text-muted-foreground">
                    <li>• Security page updates posted here</li>
                    <li>• Critical security notices on homepage</li>
                    <li>• Incident reports published when applicable</li>
                    <li>• Annual security transparency report</li>
                  </ul>
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
