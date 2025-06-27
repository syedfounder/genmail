"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
import MobileHeader from "@/components/MobileHeader";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

const freeFeatures = [
  "1 disposable inbox",
  "10-minute lifespan",
  "Real-time email viewer",
  "Basic spam filtering",
  "10 MB attachment limit",
  "No signup required",
  "No Google Ads",
];

const proFeatures = [
  "Everything in Free, plus:",
  "Up to 10 inboxes",
  "Customizable lifespan (1h, 24h, 1 week)",
  "Password-protected inboxes",
  "Inbox management dashboard",
  "Download emails (.eml/.txt)",
  "Anonymized analytics",
  "Priority support",
];

export default function Pricing() {
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
        <main className="relative z-10 p-6 pt-10">
          <div className="space-y-12">
            {/* Header */}
            <div className="text-center">
              <h1 className="font-serif text-5xl font-bold tracking-tighter mb-6">
                Pricing
              </h1>
              <p className="font-sans text-lg text-muted-foreground mb-4">
                Choose the perfect plan for your temporary email needs with{" "}
                <span className="font-serif font-semibold">genmail</span>
              </p>
              <p className="font-sans text-sm text-muted-foreground">
                Start for free with essential privacy features, or upgrade to
                Pro for powerful tools and enhanced control
              </p>
            </div>

            {/* Pricing Cards */}
            <section className="py-8">
              <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 text-left">
                {/* Free Plan */}
                <div className="border border-border rounded-2xl flex flex-col overflow-hidden">
                  <div className="p-3">
                    <div className="p-8 bg-secondary rounded-xl relative">
                      <Sparkles className="w-8 h-8 mb-4 text-[#000000] dark:text-white" />
                      <h3 className="text-2xl font-serif font-bold">Free</h3>
                      <p className="font-sans text-muted-foreground mt-2 mb-6 tracking-tight">
                        For quick, temporary use.
                      </p>
                      <p className="font-sans text-4xl font-regular mb-6 tracking-tight">
                        $0
                        <span className="text-lg font-normal text-muted-foreground">
                          /forever
                        </span>
                      </p>
                      <Button
                        variant="default"
                        className="font-sans w-full mb-0 bg-[#000000] hover:bg-[#000000]/90 text-white font-semibold dark:bg-white dark:text-[#000000] dark:hover:bg-white/90 tracking-tight"
                        onClick={() => (window.location.href = "/")}
                      >
                        You&apos;re on this plan
                      </Button>
                    </div>
                  </div>
                  <div className="px-8 pb-8 pt-4 flex-grow">
                    <h4 className="font-sans font-semibold mb-4">
                      Free Plan Includes:
                    </h4>
                    <ul className="space-y-4">
                      {freeFeatures.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <Check className="w-4 h-4 mr-3 text-green-500" />
                          <span className="font-sans text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Pro Plan */}
                <div className="border border-[#352D7F] rounded-2xl flex flex-col overflow-hidden relative shadow-2xl shadow-[#352D7F]/10">
                  <div className="p-3">
                    <div className="p-8 bg-[#352D7F] text-white rounded-xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-noise opacity-[0.15] pointer-events-none"></div>
                      <div className="relative">
                        <div className="absolute top-0 right-0 bg-white text-[#352D7F] font-semibold text-xs px-3 py-1 rounded-full">
                          Most Popular
                        </div>
                        <Sparkles className="w-8 h-8 mb-4" />
                        <h3 className="text-2xl font-bold font-serif">Pro</h3>
                        <p className="font-sans opacity-80 mt-2 mb-6 tracking-tight">
                          For power users and developers.
                        </p>
                        <p className="font-sans text-4xl font-regular mb-6 tracking-tight">
                          $4.49
                          <span className="text-lg font-normal opacity-80">
                            /mo
                          </span>
                        </p>
                        <Button
                          variant="default"
                          className="font-sans w-full mb-0 bg-white hover:bg-gray-100 text-[#352D7F] font-bold tracking-tight"
                        >
                          Get Full Access
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="px-8 pb-8 pt-4 flex-grow">
                    <h4 className="font-sans font-semibold mb-4">
                      Pro Plan Includes:
                    </h4>
                    <ul className="space-y-4">
                      {proFeatures.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <Check className="w-4 h-4 mr-3 text-[#352D7F]" />
                          <span className="font-sans text-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="py-12 px-6 font-sans relative z-10">
              <div className="max-w-3xl mx-auto">
                <h2 className="font-sans text-4xl font-semibold tracking-tighter mb-4 text-center">
                  Frequently Asked Questions
                </h2>
                <p className="text-lg text-muted-foreground mb-12 text-center leading-relaxed tracking-tight">
                  Everything you need to know about our pricing plans
                </p>

                <div className="space-y-4">
                  <PricingFAQItem
                    question="Can I switch between plans?"
                    answer="Yes! You can upgrade to Pro at any time. Your free plan will always be available as a fallback."
                  />

                  <PricingFAQItem
                    question="Is there a free trial for Pro?"
                    answer="We offer a 7-day free trial for Pro features. No credit card required to start your trial."
                  />

                  <PricingFAQItem
                    question="What payment methods do you accept?"
                    answer="We accept all major credit cards, PayPal, and cryptocurrency payments for maximum privacy."
                  />

                  <PricingFAQItem
                    question="Can I cancel anytime?"
                    answer="Absolutely. Cancel your Pro subscription anytime with no questions asked. You'll keep access until your billing period ends."
                  />

                  <PricingFAQItem
                    question="Do you offer refunds?"
                    answer="Yes, we offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund."
                  />
                </div>
              </div>
            </section>

            {/* Feature Comparison */}
            <section className="bg-gradient-to-r from-[#372F84]/5 to-transparent border border-[#372F84]/20 rounded-2xl p-8">
              <h2 className="font-sans text-3xl font-semibold mb-8 tracking-tight text-center">
                Detailed Feature Comparison
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/30">
                      <th className="font-sans text-left py-4 px-4 font-semibold">
                        Feature
                      </th>
                      <th className="font-sans text-center py-4 px-4 font-semibold">
                        Free
                      </th>
                      <th className="font-sans text-center py-4 px-4 font-semibold text-[#372F84]">
                        Pro
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-sans text-sm">
                    <tr className="border-b border-border/20">
                      <td className="py-3 px-4">Disposable inboxes</td>
                      <td className="text-center py-3 px-4">1</td>
                      <td className="text-center py-3 px-4 text-[#372F84] font-semibold">
                        Up to 10
                      </td>
                    </tr>
                    <tr className="border-b border-border/20">
                      <td className="py-3 px-4">Email lifespan</td>
                      <td className="text-center py-3 px-4">10 minutes</td>
                      <td className="text-center py-3 px-4 text-[#372F84] font-semibold">
                        1h, 24h, 1 week
                      </td>
                    </tr>
                    <tr className="border-b border-border/20">
                      <td className="py-3 px-4">Attachment limit</td>
                      <td className="text-center py-3 px-4">10 MB</td>
                      <td className="text-center py-3 px-4 text-[#372F84] font-semibold">
                        50 MB
                      </td>
                    </tr>
                    <tr className="border-b border-border/20">
                      <td className="py-3 px-4">Password protection</td>
                      <td className="text-center py-3 px-4">✗</td>
                      <td className="text-center py-3 px-4 text-[#372F84] font-semibold">
                        ✓
                      </td>
                    </tr>
                    <tr className="border-b border-border/20">
                      <td className="py-3 px-4">Download emails</td>
                      <td className="text-center py-3 px-4">✗</td>
                      <td className="text-center py-3 px-4 text-[#372F84] font-semibold">
                        ✓
                      </td>
                    </tr>
                    <tr className="border-b border-border/20">
                      <td className="py-3 px-4">Management dashboard</td>
                      <td className="text-center py-3 px-4">✗</td>
                      <td className="text-center py-3 px-4 text-[#372F84] font-semibold">
                        ✓
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Priority support</td>
                      <td className="text-center py-3 px-4">✗</td>
                      <td className="text-center py-3 px-4 text-[#372F84] font-semibold">
                        ✓
                      </td>
                    </tr>
                  </tbody>
                </table>
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
                <p className="font-sans text-sm text-muted-foreground mb-4 leading-relaxed">
                  Private, temporary email addresses that self-destruct. Protect
                  your privacy online with zero data retention.
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="font-sans">Service Online</span>
                </div>
              </div>

              {/* Product Column */}
              <div>
                <h3 className="font-sans font-semibold text-foreground mb-4 tracking-tight">
                  Product
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="/pricing"
                      className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      href="/#how-it-works"
                      className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      How it Works
                    </a>
                  </li>
                  <li>
                    <a
                      href="/api"
                      className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      API
                    </a>
                  </li>
                  <li>
                    <a
                      href="/#pro-features"
                      className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Pro Features
                    </a>
                  </li>
                </ul>
              </div>

              {/* Quick Access Column */}
              <div>
                <h3 className="font-sans font-semibold text-foreground mb-4 tracking-tight">
                  Quick Access
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="/#hero"
                      className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Generate Email
                    </a>
                  </li>
                  <li>
                    <a
                      href="/#tutorial"
                      className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Tutorial
                    </a>
                  </li>
                  <li>
                    <a
                      href="/pricing"
                      className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      href="/#technology"
                      className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Technology
                    </a>
                  </li>
                  <li>
                    <a
                      href="/#use-cases"
                      className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Use Cases
                    </a>
                  </li>
                  <li>
                    <a
                      href="/#faq"
                      className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      FAQs
                    </a>
                  </li>
                </ul>
              </div>

              {/* Support & Legal Column */}
              <div>
                <h3 className="font-sans font-semibold text-foreground mb-4 tracking-tight">
                  Support & Legal
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="/help"
                      className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a
                      href="/contact"
                      className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="/privacy"
                      className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="/terms"
                      className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a
                      href="/security"
                      className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
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
                  <p className="font-sans text-sm text-muted-foreground">
                    © 2024 <span className="font-serif">genmail</span>. All
                    rights reserved.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-sans">Built with</span>
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
                    <span className="font-sans">&</span>
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
                    <span className="font-sans">GDPR Compliant</span>
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
                    <span className="font-sans">TLS Encrypted</span>
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
                    <span className="font-sans">Zero Logs</span>
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

// Pricing FAQ Accordion Component
function PricingFAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="group bg-background/60 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden transition-all duration-300 relative">
      {/* Subtle gradient background */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 100% 100% at 50% 0%, #372F84, transparent 70%)",
        }}
      />

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-full px-6 py-5 text-left transition-all duration-300 flex items-center justify-between ${
          isOpen
            ? "bg-[#372F84]/5 dark:bg-[#372F84]/10"
            : "hover:bg-secondary/30"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-2 h-2 rounded-full transition-colors ${
              isOpen ? "bg-[#372F84] dark:bg-white" : "bg-muted-foreground/30"
            }`}
          />
          <h3 className="font-sans font-medium text-lg pr-4 tracking-tight">
            {question}
          </h3>
        </div>
        <div
          className={`p-1 rounded-full transition-all duration-300 ${
            isOpen ? "bg-[#372F84]/10 dark:bg-white/10" : ""
          }`}
        >
          <svg
            className={`w-5 h-5 transition-all duration-300 ${
              isOpen
                ? "rotate-180 text-[#372F84] dark:text-white"
                : "text-muted-foreground group-hover:text-foreground"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-6 pt-2 bg-gradient-to-b from-[#372F84]/5 to-transparent dark:from-[#372F84]/10">
          <div className="pl-5 border-l-2 border-[#372F84]/20 dark:border-white/20">
            <p className="font-sans text-muted-foreground leading-relaxed text-[15px]">
              {answer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
