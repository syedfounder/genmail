"use client";

import Image from "next/image";

const steps = [
  {
    title: "1. Generate Email",
    description:
      "Click the 'Generate Email' button to get a new address instantly.",
    position: "md:translate-y-0",
  },
  {
    title: "2. Copy Address",
    description:
      "Your new temporary email appears. Click the copy icon to grab it.",
    position: "md:translate-y-16",
  },
  {
    title: "3. Use Anywhere",
    description:
      "Paste the address into any website, app, or form for sign-ups.",
    position: "md:translate-y-0",
  },
  {
    title: "4. View Inbox",
    description:
      "Return to Genmail to see incoming emails in your temporary inbox.",
    position: "md:translate-y-16",
  },
  {
    title: "5. Self-Destructs",
    description:
      "After 10 minutes, your inbox and its emails are automatically deleted forever.",
    position: "md:translate-y-0",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-6 font-sans text-center">
      <div className="dark bg-background dark:bg-white/5 border border-border/20 rounded-2xl py-20 px-6 text-foreground">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-sans text-4xl font-semibold tracking-tighter mb-4">
            Your Privacy Journey
          </h2>
          <p className="text-lg text-muted-foreground mb-20 max-w-2xl mx-auto leading-relaxed">
            See how simple it is to protect your privacy with temporary emails
            in just 5 steps
          </p>
          <div className="relative">
            {/* Curved connecting lines for desktop */}
            <div className="hidden md:block absolute top-0 left-0 w-full h-32 text-muted-foreground/50">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 1200 128"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M 120 40 Q 240 128 360 104"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="8, 8"
                  fill="none"
                />
                <path
                  d="M 360 104 Q 480 0 600 40"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="8, 8"
                  fill="none"
                />
                <path
                  d="M 600 40 Q 720 128 840 104"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="8, 8"
                  fill="none"
                />
                <path
                  d="M 840 104 Q 960 0 1080 40"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="8, 8"
                  fill="none"
                />
              </svg>
            </div>

            <div className="relative flex flex-col md:flex-row justify-between items-start gap-y-24 md:gap-y-0">
              {steps.map((step) => (
                <div
                  key={step.title}
                  className={`relative flex flex-col items-center w-full md:w-1/5 px-4 ${step.position}`}
                >
                  <div className="bg-black/50 border-2 border-border/20 rounded-full w-20 h-20 flex items-center justify-center mb-4 z-10 shadow-lg">
                    <div className="w-4 h-4 bg-green-400 rounded-full shadow-[0_0_16px_rgba(74,222,128,0.7)]"></div>
                  </div>
                  <h3 className="font-serif text-xl font-semibold mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-32 flex justify-center items-center">
              <div className="flex -space-x-4">
                <Image
                  src="/headshots/headshot-1.jpg"
                  alt="User headshot"
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full border-2 border-background object-cover"
                />
                <Image
                  src="/headshots/headshot-2.jpg"
                  alt="User headshot"
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full border-2 border-background object-cover"
                />
                <Image
                  src="/headshots/headshot-3.jpg"
                  alt="User headshot"
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full border-2 border-background object-cover"
                />
              </div>
              <p className="ml-6 font-regular text-white text-muted-foreground">
                50+{" "}
                <a
                  href="https://lovable.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  style={{ color: "#DFBAFF" }}
                >
                  love
                </a>{" "}
                this app
              </p>
            </div>

            {/* Trust Section */}
            <div className="mt-16 text-center">
              <p className="text-sm text-muted-foreground mb-6 tracking-tight">
                Trusted by developers and privacy-conscious users worldwide
              </p>
              <div className="flex flex-wrap justify-center gap-8 text-xs text-muted-foreground/80">
                <span>✓ GDPR Compliant</span>
                <span>✓ TLS Encrypted</span>
                <span>✓ Open Source Friendly</span>
                <span>✓ No Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
