"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function HelpCenter() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = [
    {
      id: "all",
      name: "All Topics",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
    {
      id: "getting-started",
      name: "Getting Started",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      id: "features",
      name: "Features",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
    },
    {
      id: "troubleshooting",
      name: "Troubleshooting",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      id: "privacy",
      name: "Privacy & Security",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      id: "technical",
      name: "Technical",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
          />
        </svg>
      ),
    },
  ];

  const helpArticles = [
    {
      id: 1,
      category: "getting-started",
      title: "How to Generate Your First Temporary Email",
      description:
        "Learn how to create and use your first temporary inbox in under 30 seconds.",
      content: `
        <h3>Step 1: Visit the Homepage</h3>
        <p>Navigate to genmail.io and you'll see the email generator prominently displayed.</p>
        
        <h3>Step 2: Click 'Generate an Email'</h3>
        <p>Click the purple button to instantly create a new temporary email address.</p>
        
        <h3>Step 3: Copy Your Email</h3>
        <p>Your new temporary email will appear with a copy button. Click to copy it to your clipboard.</p>
        
        <h3>Step 4: Use Your Email</h3>
        <p>Paste this email into any form or service that requires email verification.</p>
        
        <h3>Step 5: Check Your Inbox</h3>
        <p>Return to the same page to view any emails sent to your temporary address.</p>
      `,
      tags: ["beginner", "tutorial", "email-generation"],
    },
    {
      id: 2,
      category: "features",
      title: "Understanding Email Expiration Times",
      description:
        "Learn how long your temporary emails last and when they automatically delete.",
      content: `
        <h3>Default Expiration</h3>
        <p>All temporary emails expire after 1 hour of inactivity by default.</p>
        
        <h3>Activity Extension</h3>
        <p>Each time you check your inbox or receive a new email, the timer resets to 1 hour.</p>
        
        <h3>Maximum Lifetime</h3>
        <p>No email address can exist for more than 24 hours, regardless of activity.</p>
        
        <h3>Automatic Cleanup</h3>
        <p>When your inbox expires, all emails and data are permanently deleted with no recovery option.</p>
        
        <h3>Pro Tip</h3>
        <p>Copy any important information before your inbox expires, as we cannot recover deleted emails.</p>
      `,
      tags: ["expiration", "timing", "cleanup"],
    },
    {
      id: 3,
      category: "features",
      title: "QR Code Feature for Mobile Access",
      description:
        "How to use QR codes to quickly access your temporary email on mobile devices.",
      content: `
        <h3>What is the QR Code Feature?</h3>
        <p>Every temporary email comes with a QR code that links directly to your inbox.</p>
        
        <h3>How to Use QR Codes</h3>
        <p>1. Click the QR icon next to the copy button<br/>
        2. Scan the QR code with your phone's camera<br/>
        3. Your temporary inbox will open on your mobile device</p>
        
        <h3>Mobile Convenience</h3>
        <p>Perfect for when you're filling out forms on your computer but want to check emails on your phone.</p>
        
        <h3>Security Note</h3>
        <p>QR codes expire with your email and cannot be used to access expired inboxes.</p>
      `,
      tags: ["qr-code", "mobile", "accessibility"],
    },
    {
      id: 4,
      category: "privacy",
      title: "How We Protect Your Privacy",
      description:
        "Detailed explanation of our privacy measures and data handling practices.",
      content: `
        <h3>Zero Knowledge Architecture</h3>
        <p>We don't store email content beyond the temporary inbox lifetime. When it expires, everything is permanently deleted.</p>
        
        <h3>No User Accounts</h3>
        <p>No registration, no personal information stored. Each email is completely anonymous.</p>
        
        <h3>Encryption in Transit</h3>
        <p>All emails are encrypted during transmission using TLS 1.3.</p>
        
        <h3>Automatic Deletion</h3>
        <p>All data is automatically deleted using DoD 5220.22-M secure deletion standards.</p>
        
        <h3>No Analytics Tracking</h3>
        <p>We don't track your behavior, reading patterns, or email content for analytics.</p>
        
        <h3>GDPR Compliance</h3>
        <p>Full compliance with EU privacy regulations, including right to erasure (automatic).</p>
      `,
      tags: ["privacy", "security", "gdpr", "encryption"],
    },
    {
      id: 5,
      category: "troubleshooting",
      title: "Email Not Receiving Messages",
      description:
        "Common reasons why emails might not be delivered to your temporary inbox.",
      content: `
        <h3>Check Spam Filters</h3>
        <p>Some services may flag temporary email domains. Try generating a new email if needed.</p>
        
        <h3>Service Blocking</h3>
        <p>Some websites block temporary email services. Unfortunately, this is outside our control.</p>
        
        <h3>Delivery Delays</h3>
        <p>Emails can take 1-5 minutes to arrive. Refresh your inbox periodically.</p>
        
        <h3>Inbox Expiration</h3>
        <p>If your inbox expired, you'll need to generate a new email address.</p>
        
        <h3>Email Size Limits</h3>
        <p>We accept emails up to 25MB. Larger emails will be rejected.</p>
        
        <h3>Still Having Issues?</h3>
                                <p>Contact our support team at support@genmail.app with details about the sending service.</p>
      `,
      tags: ["troubleshooting", "delivery", "spam", "blocking"],
    },
    {
      id: 6,
      category: "technical",
      title: "API Access and Integration",
      description:
        "How to integrate genmail into your applications and development workflow.",
      content: `
        <h3>API Availability</h3>
        <p>Currently, we don't offer public API access, but it's on our roadmap for Pro users.</p>
        
        <h3>Browser Integration</h3>
        <p>You can bookmark the genmail page for quick access during development.</p>
        
        <h3>Testing Workflows</h3>
        <p>Perfect for testing email verification flows without using real email addresses.</p>
        
        <h3>Future API Features</h3>
        <p>Planned features include programmatic email generation and webhook notifications.</p>
        
        <h3>Developer Support</h3>
                                <p>Contact us at support@genmail.app for enterprise integration discussions.</p>
      `,
      tags: ["api", "integration", "development", "testing"],
    },
    {
      id: 7,
      category: "getting-started",
      title: "Best Practices for Using Temporary Emails",
      description:
        "Tips and recommendations for getting the most out of genmail.",
      content: `
        <h3>When to Use Temporary Emails</h3>
        <p>• Newsletter signups and promotions<br/>
        • Software downloads and trials<br/>
        • Contest entries and surveys<br/>
        • Testing email workflows<br/>
        • One-time account verifications</p>
        
        <h3>When NOT to Use</h3>
        <p>• Banking or financial services<br/>
        • Important business communications<br/>
        • Services requiring long-term access<br/>
        • Password recovery for critical accounts</p>
        
        <h3>Security Tips</h3>
        <p>• Use different temporary emails for different services<br/>
        • Copy important information before expiration<br/>
        • Don't use for sensitive personal data</p>
        
        <h3>Efficiency Tips</h3>
        <p>• Bookmark genmail for quick access<br/>
        • Use QR codes for mobile convenience<br/>
        • Check your inbox within the hour for time-sensitive emails</p>
      `,
      tags: ["best-practices", "tips", "security", "efficiency"],
    },
    {
      id: 8,
      category: "troubleshooting",
      title: "Browser Compatibility and Issues",
      description: "Solving common browser-related problems with genmail.",
      content: `
        <h3>Supported Browsers</h3>
        <p>genmail works on all modern browsers: Chrome, Firefox, Safari, Edge, and mobile browsers.</p>
        
        <h3>Copy Button Not Working</h3>
        <p>Ensure your browser allows clipboard access. Try clicking directly in the email field and using Ctrl+C (Cmd+C on Mac).</p>
        
        <h3>QR Code Not Displaying</h3>
        <p>If QR codes don't appear, try refreshing the page or disabling ad blockers temporarily.</p>
        
        <h3>Page Not Loading</h3>
        <p>Clear your browser cache and cookies, or try using an incognito/private browsing window.</p>
        
        <h3>Mobile Issues</h3>
        <p>On mobile, ensure JavaScript is enabled and try rotating your device if the layout appears broken.</p>
        
        <h3>Ad Blocker Conflicts</h3>
        <p>Some ad blockers may interfere with functionality. Add genmail.io to your whitelist if needed.</p>
      `,
      tags: ["browser", "compatibility", "troubleshooting", "mobile"],
    },
    {
      id: 9,
      category: "privacy",
      title: "Data Retention and Deletion Policies",
      description:
        "Understanding how long data is kept and our deletion procedures.",
      content: `
        <h3>Email Content Retention</h3>
        <p>Email content is stored only for the lifetime of your temporary inbox (maximum 24 hours).</p>
        
        <h3>Metadata Logging</h3>
        <p>We temporarily log delivery metadata (timestamps, sender domains) for 7 days for spam prevention.</p>
        
        <h3>No Permanent Storage</h3>
        <p>No email content, attachments, or personal data is permanently stored or backed up.</p>
        
        <h3>Automatic Deletion</h3>
        <p>All data is automatically deleted using cryptographic wiping when inboxes expire.</p>
        
        <h3>No Data Recovery</h3>
        <p>Once deleted, data cannot be recovered by users or our team.</p>
        
        <h3>Legal Compliance</h3>
        <p>Our retention policies comply with GDPR, CCPA, and other privacy regulations.</p>
      `,
      tags: ["retention", "deletion", "privacy", "compliance"],
    },
    {
      id: 10,
      category: "features",
      title: "Attachment Handling and Limitations",
      description:
        "How genmail handles email attachments and file size limits.",
      content: `
        <h3>Attachment Support</h3>
        <p>We support all common file types including images, documents, and archives.</p>
        
        <h3>Size Limitations</h3>
        <p>Total email size (including attachments) is limited to 25MB.</p>
        
        <h3>Security Scanning</h3>
        <p>All attachments are scanned for malware before being made available for download.</p>
        
        <h3>Download Process</h3>
        <p>Attachments can be downloaded directly from your inbox with a single click.</p>
        
        <h3>Virus Protection</h3>
        <p>Suspicious files are automatically quarantined and not made available for download.</p>
        
        <h3>Expiration</h3>
        <p>Attachments are deleted along with emails when your inbox expires.</p>
      `,
      tags: ["attachments", "files", "security", "limits"],
    },
    {
      id: 11,
      category: "getting-started",
      title: "Referral Program and Affiliate Partnership",
      description:
        "Learn how to participate in our referral program and become an affiliate partner.",
      content: `
        <h3>Referral Program</h3>
        <p>Earn rewards for referring friends and family to genmail.</p>
        
        <h3>Affiliate Partnership</h3>
        <p>Join our affiliate program to earn commissions by promoting genmail.</p>
      `,
      tags: ["referral", "affiliate", "partnership"],
    },
  ];

  const filteredArticles =
    activeCategory === "all"
      ? helpArticles.filter((article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : helpArticles.filter(
          (article) =>
            article.category === activeCategory &&
            article.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background font-sans text-foreground">
        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-12 pt-24">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold tracking-tighter mb-4 font-serif">
              Help Center
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to your questions about{" "}
              <span className="font-serif">genmail</span>, privacy, and more.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="sticky top-[76px] bg-background/80 backdrop-blur-sm z-40 py-6 mb-8">
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {category.icon}
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-12 gap-12">
            {/* Quick Access Links (Left Sidebar) */}
            <aside className="md:col-span-3">
              <div className="sticky top-60">
                <h3 className="text-lg font-semibold mb-6">Quick Access</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
                  {[
                    { title: "Getting Started", count: 3 },
                    { title: "Features", count: 4 },
                    { title: "Privacy", count: 2 },
                    { title: "Troubleshooting", count: 2 },
                    { title: "Technical", count: 2 },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="h-full bg-secondary/50 border border-border rounded-xl p-4 hover:bg-secondary/70 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {item.count} articles
                        </p>
                      </div>
                      <a
                        href={`#${item.title.toLowerCase().replace(" ", "-")}`}
                        className="text-sm font-medium text-primary mt-3 block"
                      >
                        View →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Articles (Right Section) */}
            <div className="md:col-span-9">
              {filteredArticles.length > 0 ? (
                <div className="space-y-12">
                  {categories
                    .filter(
                      (c) =>
                        c.id !== "all" &&
                        (activeCategory === "all" || activeCategory === c.id)
                    )
                    .map((category) => (
                      <section
                        key={category.id}
                        id={category.id}
                        className="scroll-mt-24"
                      >
                        <h2 className="text-3xl font-semibold mb-8 flex items-center gap-3 font-serif">
                          {category.icon}
                          {category.name}
                        </h2>
                        <div className="space-y-4">
                          {filteredArticles
                            .filter((a) => a.category === category.id)
                            .map((article) => (
                              <HelpArticle key={article.id} article={article} />
                            ))}
                        </div>
                      </section>
                    ))}
                </div>
              ) : (
                <div className="text-center py-16 border-2 border-dashed border-border rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">
                    No Articles Found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter.
                  </p>
                </div>
              )}
            </div>
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

// Help Article Component
interface Article {
  id: number;
  title: string;
  description: string;
  content: string;
  tags: string[];
}

function HelpArticle({ article }: { article: Article }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="group bg-background/60 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 relative">
      {/* Subtle gradient background - only show on hover when closed */}
      {!isOpen && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 100% 100% at 50% 0%, #372F84, transparent 70%)",
          }}
        />
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-full px-6 py-5 text-left transition-all duration-300 flex items-center justify-between ${
          isOpen
            ? "bg-[#372F84]/5 dark:bg-[#372F84]/10"
            : "hover:bg-secondary/30"
        }`}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`w-2 h-2 rounded-full transition-colors ${
                isOpen ? "bg-[#372F84] dark:bg-white" : "bg-muted-foreground/30"
              }`}
            />
            <h3 className="font-sans font-semibold text-lg tracking-tight">
              {article.title}
            </h3>
          </div>
          <p className="font-sans text-sm text-muted-foreground ml-5">
            {article.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-3 ml-5">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="font-sans px-2 py-1 text-xs bg-secondary/50 text-muted-foreground rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div
          className={`p-1 rounded-full transition-all duration-300 ml-4 ${
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
        <div className="relative px-6 pb-6">
          <div
            className="font-sans prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-h3:text-lg prose-h3:font-semibold prose-h3:mb-3 prose-h3:mt-4 prose-p:mb-3 prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      )}
    </div>
  );
}
