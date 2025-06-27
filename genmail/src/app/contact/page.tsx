"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Contact() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    // TODO: Implement actual form submission logic
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Main Content */}
      <main className="font-sans max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center">
            <h1 className="font-serif text-5xl font-bold tracking-tighter mb-6">
              Contact Us
            </h1>
            <p className="font-sans text-lg text-muted-foreground mb-4">
              Get in touch with our team. We&apos;re here to help with any
              questions about{" "}
              <span className="font-serif font-semibold">genmail</span>
            </p>
            <p className="font-sans text-sm text-muted-foreground">
              We typically respond within 24 hours
            </p>
          </div>

          {/* Contact Methods */}
          <section className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-background border border-border/50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-foreground"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <h3 className="font-sans font-semibold text-lg mb-2 text-foreground">
                Email Support
              </h3>
              <p className="font-sans text-sm text-muted-foreground mb-3">
                For general inquiries and support
              </p>
              <a
                href="mailto:support@genmail.app"
                className="font-sans text-sm text-foreground hover:underline"
              >
                support@genmail.app
              </a>
            </div>

            <div className="bg-background border border-border/50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-foreground"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="font-sans font-semibold text-lg mb-2 text-foreground">
                Help Center
              </h3>
              <p className="font-sans text-sm text-muted-foreground mb-3">
                Find answers to common questions
              </p>
              <Link
                href="/#faq"
                className="font-sans text-sm text-foreground hover:underline"
              >
                Browse FAQ
              </Link>
            </div>

            <div className="bg-background border border-border/50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-foreground"
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
              <h3 className="font-sans font-semibold text-lg mb-2 text-foreground">
                Security Issues
              </h3>
              <p className="font-sans text-sm text-muted-foreground mb-3">
                Report security vulnerabilities
              </p>
              <a
                href="mailto:security@genmail.app"
                className="font-sans text-sm text-foreground hover:underline"
              >
                security@genmail.app
              </a>
            </div>
          </section>

          {/* Contact Form */}
          <section className="bg-background/60 border border-border/50 rounded-2xl p-8">
            <h2 className="font-sans text-3xl font-semibold mb-6 tracking-tight text-center">
              Send us a Message
            </h2>

            {submitStatus === "success" && (
              <div className="bg-green-50/50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-800/50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="font-sans text-sm text-green-700 dark:text-green-300">
                    Thank you! Your message has been sent successfully.
                    We&apos;ll get back to you soon.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="font-sans block text-sm font-medium mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="font-sans w-full px-4 py-3 border border-border/50 rounded-lg bg-background/50 focus:border-[#372F84] focus:outline-none focus:ring-2 focus:ring-[#372F84]/20 transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="font-sans block text-sm font-medium mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="font-sans w-full px-4 py-3 border border-border/50 rounded-lg bg-background/50 focus:border-[#372F84] focus:outline-none focus:ring-2 focus:ring-[#372F84]/20 transition-colors"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="font-sans block text-sm font-medium mb-2"
                >
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="font-sans w-full px-4 py-3 border border-border/50 rounded-lg bg-background/50 focus:border-[#372F84] focus:outline-none focus:ring-2 focus:ring-[#372F84]/20 transition-colors appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 0.75rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "2.5rem",
                  }}
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="feature">Feature Request</option>
                  <option value="bug">Bug Report</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="press">Press Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="font-sans block text-sm font-medium mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="font-sans w-full px-4 py-3 border border-border/50 rounded-lg bg-background/50 focus:border-[#372F84] focus:outline-none focus:ring-2 focus:ring-[#372F84]/20 transition-colors resize-vertical"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="font-sans bg-foreground hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed text-background px-8 py-3 rounded-lg transition-colors font-medium inline-flex items-center justify-between w-48"
                >
                  {isSubmitting ? (
                    <>
                      <span>Sending...</span>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="1"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* Response Times */}
          <section className="bg-gradient-to-r from-[#372F84]/5 to-transparent border border-[#372F84]/20 rounded-2xl p-8">
            <h2 className="font-sans text-2xl font-semibold mb-6 text-center">
              Response Times
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-500">24h</span>
                </div>
                <h3 className="font-sans font-semibold text-lg mb-2">
                  General Inquiries
                </h3>
                <p className="font-sans text-sm text-muted-foreground">
                  Most questions answered within 24 hours during business days
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-500">4h</span>
                </div>
                <h3 className="font-sans font-semibold text-lg mb-2">
                  Technical Issues
                </h3>
                <p className="font-sans text-sm text-muted-foreground">
                  Priority support for technical problems and service
                  disruptions
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-red-500">2h</span>
                </div>
                <h3 className="font-sans font-semibold text-lg mb-2">
                  Security Issues
                </h3>
                <p className="font-sans text-sm text-muted-foreground">
                  Immediate attention for security vulnerabilities and critical
                  issues
                </p>
              </div>
            </div>
          </section>

          {/* Office Information */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="bg-background/60 border border-border/50 rounded-xl p-6">
              <h3 className="font-sans font-semibold text-xl mb-4">
                Business Information
              </h3>
              <div className="font-sans space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-muted-foreground mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="font-medium">Physical Address</p>
                    <p className="text-muted-foreground">
                      <span className="inline-flex items-center gap-2">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                        Location details being finalized
                      </span>
                      <br />
                      <span className="text-xs">
                        Remote-first operations currently
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-muted-foreground mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <div>
                    <p className="font-medium">Business Contact</p>
                    <p className="text-muted-foreground">
                      Available via email support channels
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-background/60 border border-border/50 rounded-xl p-6">
              <h3 className="font-sans font-semibold text-xl mb-4">
                Service Availability
              </h3>
              <div className="font-sans space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="font-medium">Service Online 24/7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Email Generation
                  </span>
                  <span>Always Available</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Support Response
                  </span>
                  <span>Within 24 hours</span>
                </div>
                <div className="pt-2 mt-3 border-t border-border/30">
                  <p className="text-xs text-muted-foreground">
                    Critical security issues receive immediate attention
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
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
                  © 2024 <span className="font-serif">genmail</span>. All rights
                  reserved.
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
  );
}
