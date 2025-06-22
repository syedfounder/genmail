"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

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
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For now, just show success message
    setSubmitStatus("success");
    setIsSubmitting(false);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

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
                        <svg
                          className="w-4 h-4 animate-spin"
                          viewBox="0 0 24 24"
                        >
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
                    <span className="text-2xl font-bold text-green-500">
                      24h
                    </span>
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
                    <span className="text-2xl font-bold text-orange-500">
                      4h
                    </span>
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
                    Immediate attention for security vulnerabilities and
                    critical issues
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
                      <p className="font-medium">Address</p>
                      <p className="text-muted-foreground">
                        Privacy-First Technologies Inc.
                        <br />
                        123 Security Boulevard
                        <br />
                        San Francisco, CA 94102
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
                      <p className="font-medium">Phone</p>
                      <p className="text-muted-foreground">+1 (555) 123-4567</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-background/60 border border-border/50 rounded-xl p-6">
                <h3 className="font-sans font-semibold text-xl mb-4">
                  Business Hours
                </h3>
                <div className="font-sans space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Monday - Friday
                    </span>
                    <span>9:00 AM - 6:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span>10:00 AM - 4:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span>Closed</span>
                  </div>
                  <div className="pt-2 mt-3 border-t border-border/30">
                    <p className="text-xs text-muted-foreground">
                      Emergency security issues are handled 24/7
                    </p>
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
