"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function HelpCenter() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
        <p>Contact our support team at support@genmail.io with details about the sending service.</p>
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
        <p>Contact us at support@genmail.io for enterprise integration discussions.</p>
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
  ];

  const filteredArticles = helpArticles.filter((article) => {
    const matchesCategory =
      activeCategory === "all" || article.category === activeCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

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
        <main className="font-sans max-w-6xl mx-auto px-6 py-16">
          <div className="space-y-12">
            {/* Header */}
            <div className="text-center">
              <h1 className="font-serif text-5xl font-bold tracking-tighter mb-6">
                Help Center
              </h1>
              <p className="font-sans text-lg text-muted-foreground mb-8">
                Everything you need to know about using{" "}
                <span className="font-serif font-semibold">genmail</span>{" "}
                effectively
              </p>

              {/* Search Bar */}
              <div className="max-w-md mx-auto relative">
                <input
                  type="text"
                  placeholder="Search help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="font-sans w-full px-4 py-3 pl-12 border border-border/50 rounded-lg bg-background/50 focus:border-[#372F84] focus:outline-none focus:ring-2 focus:ring-[#372F84]/20 transition-colors"
                />
                <svg
                  className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 transform -translate-y-1/2"
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

            {/* Quick Access Cards */}
            <section className="grid md:grid-cols-3 gap-6">
              <Link
                href="#getting-started"
                onClick={() => setActiveCategory("getting-started")}
                className="group"
              >
                <div className="bg-background border border-border/50 rounded-xl p-6 text-center hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-foreground"
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
                  </div>
                  <h3 className="font-sans font-semibold text-lg mb-2 text-foreground">
                    Getting Started
                  </h3>
                  <p className="font-sans text-sm text-muted-foreground">
                    New to genmail? Start here for the basics
                  </p>
                </div>
              </Link>

              <Link
                href="#troubleshooting"
                onClick={() => setActiveCategory("troubleshooting")}
                className="group"
              >
                <div className="bg-background border border-border/50 rounded-xl p-6 text-center hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-foreground"
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
                  </div>
                  <h3 className="font-sans font-semibold text-lg mb-2 text-foreground">
                    Troubleshooting
                  </h3>
                  <p className="font-sans text-sm text-muted-foreground">
                    Having issues? Find solutions here
                  </p>
                </div>
              </Link>

              <Link
                href="#privacy"
                onClick={() => setActiveCategory("privacy")}
                className="group"
              >
                <div className="bg-background border border-border/50 rounded-xl p-6 text-center hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-foreground"
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
                  </div>
                  <h3 className="font-sans font-semibold text-lg mb-2 text-foreground">
                    Privacy & Security
                  </h3>
                  <p className="font-sans text-sm text-muted-foreground">
                    Learn how we protect your data
                  </p>
                </div>
              </Link>
            </section>

            {/* Category Filter */}
            <section>
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`font-sans px-4 py-2 rounded-lg transition-colors text-sm inline-flex items-center gap-2 ${
                      activeCategory === category.id
                        ? "bg-[#372F84] text-white"
                        : "bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {category.icon}
                    {category.name}
                  </button>
                ))}
              </div>
            </section>

            {/* Help Articles */}
            <section>
              <div className="grid gap-6">
                {filteredArticles.map((article) => (
                  <HelpArticle key={article.id} article={article} />
                ))}

                {filteredArticles.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="font-sans text-xl font-semibold mb-2">
                      No articles found
                    </h3>
                    <p className="font-sans text-muted-foreground">
                      Try adjusting your search or browse all topics
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setActiveCategory("all");
                      }}
                      className="font-sans mt-4 px-4 py-2 bg-[#372F84] text-white rounded-lg hover:bg-[#372F84]/90 transition-colors"
                    >
                      Show All Articles
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Contact Support */}
            <section className="bg-gradient-to-r from-[#372F84]/5 to-transparent border border-[#372F84]/20 rounded-2xl p-8 text-center">
              <h2 className="font-sans text-2xl font-semibold mb-4">
                Still Need Help?
              </h2>
              <p className="font-sans text-muted-foreground mb-6">
                Can&apos;t find what you&apos;re looking for? Our support team
                is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="font-sans bg-foreground hover:bg-foreground/90 text-background px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  Contact Support
                </Link>
                <a
                  href="mailto:support@genmail.io"
                  className="font-sans border border-foreground text-foreground hover:bg-foreground/5 px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  Email Us Directly
                </a>
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
