"use client";

import { Button } from "./ui/button";
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
  return (
    <section className="py-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="font-sans text-4xl font-semibold tracking-tighter mb-4">
          Free vs. Pro: Choose the Plan That Fits You
        </h2>
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          Start for free with essential privacy features, or upgrade to Pro for
          powerful tools and enhanced control.
        </p>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 text-left">
          {/* Free Plan */}
          <div className="border border-border rounded-2xl flex flex-col overflow-hidden">
            <div className="p-3">
              <div className="p-8 bg-secondary rounded-xl relative">
                <Sparkles className="w-8 h-8 mb-4 text-[#000000] dark:text-white" />
                <h3 className="text-2xl font-serif font-bold">Free</h3>
                <p className="text-muted-foreground mt-2 mb-6 tracking-tight">
                  For quick, temporary use.
                </p>
                <p className="text-4xl font-regular mb-6 tracking-tight">
                  $0
                  <span className="text-lg font-normal text-muted-foreground">
                    /forever
                  </span>
                </p>
                <Button
                  variant="default"
                  className="w-full mb-0 bg-[#000000] hover:bg-[#000000]/90 text-white font-semibold dark:bg-white dark:text-[#000000] dark:hover:bg-white/90 tracking-tight"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  You're on this plan
                </Button>
              </div>
            </div>
            <div className="px-8 pb-8 pt-4 flex-grow">
              <h4 className="font-semibold mb-4">Free Plan Includes:</h4>
              <ul className="space-y-4">
                {freeFeatures.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="w-4 h-4 mr-3 text-green-500" />
                    <span className="text-muted-foreground">{feature}</span>
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
                  <p className="opacity-80 mt-2 mb-6 tracking-tight">
                    For power users and developers.
                  </p>
                  <p className="text-4xl font-regular mb-6 tracking-tight">
                    $4.49
                    <span className="text-lg font-normal opacity-80">/mo</span>
                  </p>
                  <Button
                    variant="default"
                    className="w-full mb-0 bg-white hover:bg-gray-100 text-[#352D7F] font-bold tracking-tight"
                  >
                    Get Full Access
                  </Button>
                </div>
              </div>
            </div>
            <div className="px-8 pb-8 pt-4 flex-grow">
              <h4 className="font-semibold mb-4">Pro Plan Includes:</h4>
              <ul className="space-y-4">
                {proFeatures.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="w-4 h-4 mr-3 text-[#352D7F]" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
