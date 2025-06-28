"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { cn } from "@/lib/utils";
import InboxViewer from "@/components/InboxViewer";
import supabase from "@/lib/supabaseClient";
import SeoContent from "@/components/SeoContent";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import PrivacyFeatures from "@/components/PrivacyFeatures";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [inboxId, setInboxId] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [sponsorBanner, setSponsorBanner] = useState<{
    banner_url: string;
    target_url: string;
    name: string;
  } | null>(null);
  const { theme } = useTheme();
  const { userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    fetchSponsorBanner();
  }, []);

  const fetchSponsorBanner = async () => {
    try {
      console.log("Fetching sponsor banner...");

      // First, let's try a simple query without date filters
      const { data, error } = await supabase
        .from("sponsors")
        .select("banner_url, target_url, name, is_active, start_date, end_date")
        .eq("is_active", true)
        .limit(1);

      console.log("Sponsor query result:", { data, error });

      if (error) {
        console.error("Error fetching sponsor banner:", error);
        return;
      }

      if (data && data.length > 0) {
        console.log("Setting sponsor banner:", data[0]);
        setSponsorBanner(data[0]);
      } else {
        console.log("No active sponsor banners found");
      }
    } catch (error) {
      console.error("Error fetching sponsor banner:", error);
    }
  };

  // Close QR popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        showQR &&
        !target.closest(".qr-popup") &&
        !target.closest(".qr-button")
      ) {
        setShowQR(false);
      }
    };

    if (showQR) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showQR]);

  const generateInbox = async () => {
    if (userId) {
      router.push("/dashboard");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/createInbox", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setEmailAddress(data.emailAddress);
        setExpiresAt(new Date(data.expiresAt));
        setInboxId(data.inboxId);
      } else {
        // Handle different types of errors
        if (response.status === 429 || data.code === "RATE_LIMIT_EXCEEDED") {
          alert(
            "⏱️ Rate Limit Reached\n\n" +
              "You can only create 5 temporary emails per hour. Please wait a bit or upgrade to Pro for unlimited access.\n\n" +
              "💡 Tip: Upgrade to Pro to get unlimited inboxes with custom lifespans!"
          );
        } else {
          alert(
            `Failed to generate inbox: ${
              data.message || data.error || "Please try again."
            }`
          );
        }
      }
    } catch (error) {
      console.error("Error generating inbox:", error);
      alert("Network error: Please check your connection and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen text-foreground transition-colors relative overflow-hidden",
        "bg-background"
      )}
    >
      {/* Header is now handled by layout.tsx */}

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-1 px-6 pt-10 pb-20 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="relative inline-block mb-4 md:mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#372F84] to-blue-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
            <Link
              href="/pricing"
              className="relative font-sans inline-flex items-center gap-2 bg-secondary border border-border rounded-full px-4 py-1.5 text-sm font-medium hover:bg-accent transition-colors"
            >
              <span>Introducing Custom Inboxes</span>
              <span className="font-semibold">Go Pro →</span>
            </Link>
          </div>
          {/* Tagline */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-[60px] font-bold tracking-tight mb-6 leading-tight">
            Private, Temporary Email
            <br className="md:hidden" />{" "}
            <span className="text-black dark:text-white">in 1 Click</span>
          </h1>

          <p className="font-sans text-[16px] text-black dark:text-white mb-12 max-w-2xl mx-auto leading-relaxed">
            Generate anonymous, disposable email addresses that self-destruct
            after 10 minutes. No signup, no tracking. Perfect for protecting
            your privacy online.
          </p>

          {/* Email Input Box with Generate Button */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-lg">
              <div className="flex items-center bg-secondary border border-border rounded-lg overflow-hidden shadow-2xl">
                {/* Generate Button */}
                <button
                  onClick={generateInbox}
                  disabled={isGenerating}
                  className="font-sans bg-foreground hover:bg-foreground/90 disabled:bg-gray-400 text-background font-semibold px-4 py-2 text-sm transition-all disabled:cursor-not-allowed h-[40px] flex items-center gap-2 m-2 rounded-md shadow-lg"
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Generating...
                    </>
                  ) : emailAddress ? (
                    "New Email"
                  ) : (
                    "Generate Email"
                  )}
                </button>

                {/* Email Display Area */}
                <div className="flex-1 px-4 py-2 min-h-[40px] flex items-center relative">
                  {emailAddress ? (
                    <div className="flex items-center gap-2 w-full">
                      <code className="font-mono text-sm text-secondary-foreground flex-1 truncate">
                        {emailAddress}
                      </code>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(emailAddress)
                        }
                        className="text-muted-foreground hover:text-foreground transition-colors p-1"
                        title="Copy email address"
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
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => setShowQR(!showQR)}
                        className="qr-button text-muted-foreground hover:text-foreground transition-colors p-1"
                        title="Show QR Code"
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
                            d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <span className="font-sans text-muted-foreground text-sm">
                      Your temporary email will appear here
                    </span>
                  )}

                  {/* QR Code Popup */}
                  {showQR && emailAddress && (
                    <div className="qr-popup fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
                      <div className="bg-background/80 dark:bg-background/90 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl max-w-sm mx-4 relative overflow-hidden">
                        {/* Purple gradient background */}
                        <div
                          className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none"
                          style={{
                            background:
                              "radial-gradient(ellipse 80% 80% at 50% 0%, #372F84, transparent 70%)",
                          }}
                        />

                        <div className="relative flex flex-col items-center">
                          {/* Header */}
                          <div className="flex items-center gap-2 mb-6">
                            <svg
                              className="w-5 h-5 text-[#372F84] dark:text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                              />
                            </svg>
                            <h3 className="font-sans text-xl font-reg tracking-tight text-foreground">
                              QR Code
                            </h3>
                          </div>

                          {/* QR Code */}
                          <div className="bg-white p-4 rounded-xl shadow-lg mb-6">
                            <QRCodeSVG
                              value={emailAddress}
                              size={180}
                              bgColor="#ffffff"
                              fgColor="#000000"
                            />
                          </div>

                          {/* Email address */}
                          <div className="bg-secondary rounded-lg px-4 py-2 mb-2 max-w-full">
                            <code className="font-mono text-sm text-secondary-foreground break-all">
                              {emailAddress}
                            </code>
                          </div>

                          {/* Instructions */}
                          <p className="font-sans text-sm text-muted-foreground text-center mb-6 leading-relaxed">
                            Scan with your phone&apos;s camera to copy this
                            email address
                          </p>

                          {/* Close button */}
                          <button
                            onClick={() => setShowQR(false)}
                            className="font-sans w-full bg-foreground hover:bg-foreground/90 text-background font-semibold px-6 py-3 rounded-lg transition-all shadow-lg"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Availability Indicator */}
          <div className="mt-4 flex items-center justify-center font-sans text-sm font-medium text-green-500">
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Limited free emails available
          </div>
        </div>
        {/* Inbox Section - Shows below hero when generated */}
        {emailAddress && expiresAt && inboxId && (
          <section className="w-full">
            <InboxViewer
              inboxId={inboxId}
              emailAddress={emailAddress}
              expiresAt={expiresAt}
            />
          </section>
        )}
        {/* Built with Section */}
        <section className="pt-16 pb-4 sm:pb-8 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center">
              <div className="flex items-center gap-3 sm:gap-4 text-base sm:text-lg text-muted-foreground font-sans">
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
                    width={70}
                    height={13}
                    className="dark:hidden sm:hidden"
                  />
                  <Image
                    src="/lovable-logo-white.svg"
                    alt="Lovable"
                    width={70}
                    height={13}
                    className="hidden dark:block sm:dark:hidden"
                  />
                  <Image
                    src="/lovable-logo-black.svg"
                    alt="Lovable"
                    width={100}
                    height={18}
                    className="hidden sm:block dark:sm:hidden"
                  />
                  <Image
                    src="/lovable-logo-white.svg"
                    alt="Lovable"
                    width={100}
                    height={18}
                    className="hidden sm:dark:block"
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
                    width={54}
                    height={10}
                    className="dark:hidden sm:hidden"
                  />
                  <Image
                    src="/cursor-logo-white.svg"
                    alt="Cursor"
                    width={54}
                    height={10}
                    className="hidden dark:block sm:dark:hidden"
                  />
                  <Image
                    src="/cursor-logo.svg"
                    alt="Cursor"
                    width={78}
                    height={15}
                    className="hidden sm:block dark:sm:hidden"
                  />
                  <Image
                    src="/cursor-logo-white.svg"
                    alt="Cursor"
                    width={78}
                    height={15}
                    className="hidden sm:dark:block"
                  />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SeoContent />
      <div id="how-it-works">
        <div id="tutorial">
          <HowItWorks />
        </div>
      </div>
      {/* Pro Features Section */}
      <section id="pro-features" className="py-20 px-6 font-sans relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-sans text-4xl font-semibold tracking-tighter mb-4">
              Pro Features
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed tracking-tight max-w-2xl mx-auto">
              Unlock advanced capabilities and enhanced privacy controls with{" "}
              <span className="font-serif font-semibold">genmail</span> Pro
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Multiple Inboxes */}
            <div className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 80% at 50% 0%, #372F84, transparent 70%)",
                }}
              />
              <div className="relative">
                <div className="w-12 h-12 bg-[#372F84]/10 dark:bg-white/10 rounded-xl flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-[#372F84] dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-lg mb-3 tracking-tight">
                  Multiple Inboxes
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Manage up to 10 simultaneous temporary inboxes for different
                  purposes and projects.
                </p>
              </div>
            </div>

            {/* Custom Lifespans */}
            <div className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 80% at 50% 0%, #372F84, transparent 70%)",
                }}
              />
              <div className="relative">
                <div className="w-12 h-12 bg-[#372F84]/10 dark:bg-white/10 rounded-xl flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-[#372F84] dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-lg mb-3 tracking-tight">
                  Custom Lifespans
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Choose inbox duration from 10 minutes to 1 week. Perfect for
                  different use cases.
                </p>
              </div>
            </div>

            {/* Password Protection */}
            <div className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 80% at 50% 0%, #372F84, transparent 70%)",
                }}
              />
              <div className="relative">
                <div className="w-12 h-12 bg-[#372F84]/10 dark:bg-white/10 rounded-xl flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-[#372F84] dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-lg mb-3 tracking-tight">
                  Password Protection
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Secure your temporary inboxes with password protection for
                  enhanced privacy.
                </p>
              </div>
            </div>

            {/* Enhanced Attachments */}
            <div className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 80% at 50% 0%, #372F84, transparent 70%)",
                }}
              />
              <div className="relative">
                <div className="w-12 h-12 bg-[#372F84]/10 dark:bg-white/10 rounded-xl flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-[#372F84] dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-lg mb-3 tracking-tight">
                  Enhanced Attachments
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Receive larger attachments up to 50MB and download emails in
                  multiple formats.
                </p>
              </div>
            </div>

            {/* Inbox Management */}
            <div className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 80% at 50% 0%, #372F84, transparent 70%)",
                }}
              />
              <div className="relative">
                <div className="w-12 h-12 bg-[#372F84]/10 dark:bg-white/10 rounded-xl flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-[#372F84] dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-lg mb-3 tracking-tight">
                  Inbox Management
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Advanced dashboard to organize, label, and manage all your
                  temporary inboxes.
                </p>
              </div>
            </div>

            {/* Priority Support */}
            <div className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 80% at 50% 0%, #372F84, transparent 70%)",
                }}
              />
              <div className="relative">
                <div className="w-12 h-12 bg-[#372F84]/10 dark:bg-white/10 rounded-xl flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-[#372F84] dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-lg mb-3 tracking-tight">
                  Priority Support
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Get dedicated support with faster response times and priority
                  assistance.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-[#372F84]/10 to-transparent dark:from-[#372F84]/20 border border-[#372F84]/20 rounded-2xl p-8">
              <h3 className="font-serif text-2xl font-bold mb-4">
                Ready to Go Pro?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
                Upgrade to Pro and unlock powerful features for enhanced
                privacy, productivity, and control over your temporary email
                experience.
              </p>
              <a
                href="/pricing"
                className="inline-flex items-center gap-2 bg-[#372F84] hover:bg-[#372F84]/90 text-white px-8 py-3 rounded-lg transition-colors font-medium"
              >
                View Pricing
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
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <PrivacyFeatures />

      <div className="w-full max-w-6xl mx-auto">
        <Pricing />
      </div>

      {/* Technology Section */}
      <section id="technology" className="py-20 px-6 font-sans relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-sans text-4xl font-semibold tracking-tighter mb-6">
            The Technology Behind <span className="font-serif">genmail</span>:
            Temporary Emails
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Built on modern cloud infrastructure with privacy and security at
            its core
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {/* Real-time Email Processing */}
            <div className="bg-secondary/50 border border-border rounded-xl p-6 hover:bg-secondary/70 transition-colors">
              <div className="w-12 h-12 bg-[#372F84]/10 dark:bg-white/10 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-[#372F84] dark:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-3">
                Real-time Email Processing
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Incoming emails are processed instantly using modern
                event-driven architecture, ensuring you receive messages the
                moment they arrive.
              </p>
            </div>

            {/* Secure Email Routing */}
            <div className="bg-secondary/50 border border-border rounded-xl p-6 hover:bg-secondary/70 transition-colors">
              <div className="w-12 h-12 bg-[#372F84]/10 dark:bg-white/10 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-[#372F84] dark:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-3">
                Secure Email Routing
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Advanced email routing protocols ensure messages reach the
                correct temporary inbox while maintaining complete isolation
                between users.
              </p>
            </div>

            {/* Auto-Expiration System */}
            <div className="bg-secondary/50 border border-border rounded-xl p-6 hover:bg-secondary/70 transition-colors">
              <div className="w-12 h-12 bg-[#372F84]/10 dark:bg-white/10 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-[#372F84] dark:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-3">
                Auto-Expiration System
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Smart scheduling algorithms automatically clean up expired
                inboxes and data, ensuring zero digital footprint after
                expiration.
              </p>
            </div>

            {/* Privacy-First Design */}
            <div className="bg-secondary/50 border border-border rounded-xl p-6 hover:bg-secondary/70 transition-colors">
              <div className="w-12 h-12 bg-[#372F84]/10 dark:bg-white/10 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-[#372F84] dark:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-3">
                Privacy-First Design
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                No personal information required. No tracking cookies. No data
                retention. Built from the ground up to protect your digital
                privacy.
              </p>
            </div>

            {/* Scalable Infrastructure */}
            <div className="bg-secondary/50 border border-border rounded-xl p-6 hover:bg-secondary/70 transition-colors">
              <div className="w-12 h-12 bg-[#372F84]/10 dark:bg-white/10 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-[#372F84] dark:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-3">
                Scalable Infrastructure
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Built on modern cloud platforms with auto-scaling capabilities
                to handle thousands of concurrent users and email volumes.
              </p>
            </div>

            {/* Modern Web Technologies */}
            <div className="bg-secondary/50 border border-border rounded-xl p-6 hover:bg-secondary/70 transition-colors">
              <div className="w-12 h-12 bg-[#372F84]/10 dark:bg-white/10 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-[#372F84] dark:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-3">
                Modern Web Technologies
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Powered by cutting-edge web frameworks, real-time databases, and
                serverless functions for lightning-fast performance and
                reliability.
              </p>
            </div>
          </div>

          <div className="mt-16 bg-gradient-to-r from-[#372F84]/10 to-transparent dark:from-[#372F84]/20 border border-[#372F84]/20 rounded-2xl p-8">
            <h3 className="font-serif text-2xl font-bold mb-4">
              Enterprise-Grade Security
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
              Our infrastructure employs industry-standard encryption, secure
              protocols, and compliance measures to ensure your temporary emails
              remain private and secure throughout their lifecycle.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-[#372F84]/10 dark:bg-white/10 px-4 py-2 rounded-full">
                TLS Encryption
              </span>
              <span className="bg-[#372F84]/10 dark:bg-white/10 px-4 py-2 rounded-full">
                Zero Data Retention
              </span>
              <span className="bg-[#372F84]/10 dark:bg-white/10 px-4 py-2 rounded-full">
                GDPR Compliant
              </span>
              <span className="bg-[#372F84]/10 dark:bg-white/10 px-4 py-2 rounded-full">
                End-to-End Privacy
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 font-sans relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-sans text-4xl font-semibold tracking-tighter mb-4 text-center">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground mb-12 text-center leading-relaxed tracking-tight">
            Everything you need to know about temporary emails
          </p>

          <div className="space-y-4">
            <FAQItem
              question="How long do temporary emails last?"
              answer="Free emails automatically expire after 10 minutes. Pro users can customize the lifespan to 10 minutes, 1 hour, or 24 hours depending on their needs."
            />

            <FAQItem
              question="Is my privacy really protected?"
              answer="Absolutely. We don't require any personal information, don't use tracking cookies, and automatically delete all data when emails expire. Your digital footprint is completely erased."
            />

            <FAQItem
              question="Can I receive attachments and images?"
              answer="Yes! You can receive emails with attachments up to 10MB on the free plan. Pro users get enhanced attachment support and can download emails in .eml or .txt format."
            />

            <FAQItem
              question="How many temporary emails can I create?"
              answer="Free users can create unlimited emails, but only one at a time. Pro users can manage up to 10 simultaneous inboxes with custom lifespans and password protection."
            />

            <FAQItem
              question="What happens to my emails after they expire?"
              answer="All emails and associated data are permanently deleted from our servers. There's no recovery option, ensuring complete privacy and zero data retention."
            />

            <FAQItem
              question="Can I use this for account verification?"
              answer="Yes! Temporary emails work perfectly for account verifications, newsletter signups, downloading files, and any situation where you need a quick email address."
            />

            <FAQItem
              question="Do you block any email providers?"
              answer="Our service accepts emails from all legitimate providers. We have advanced spam filtering to ensure you only receive relevant messages in your temporary inbox."
            />

            <FAQItem
              question="Is there a mobile app?"
              answer="Currently, we're a web-only service optimized for all devices. However, you can use our QR code feature to easily share email addresses between your devices."
            />
          </div>
        </div>
      </section>

      {/* Practical Use Cases Section */}
      <section id="use-cases" className="py-20 px-6 font-sans relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-sans text-4xl font-semibold tracking-tighter mb-4">
              Practical Use Cases
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed tracking-tight max-w-2xl mx-auto">
              Real-world scenarios where temporary emails protect your privacy
              and inbox
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Account Verification */}
            <div className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 80% at 50% 0%, #372F84, transparent 70%)",
                }}
              />
              <div className="relative">
                <div className="w-12 h-12 bg-[#372F84]/10 dark:bg-white/10 rounded-xl flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-[#372F84] dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-lg mb-3 tracking-tight">
                  Account Verification
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Perfect for verifying new accounts without cluttering your
                  main inbox with confirmation emails.
                </p>
              </div>
            </div>

            {/* Newsletter Trials */}
            <div className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 80% at 50% 0%, #372F84, transparent 70%)",
                }}
              />
              <div className="relative">
                <div className="w-12 h-12 bg-[#372F84]/10 dark:bg-white/10 rounded-xl flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-[#372F84] dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-lg mb-3 tracking-tight">
                  Newsletter Trials
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Test out newsletters and subscriptions before committing your
                  real email address.
                </p>
              </div>
            </div>

            {/* File Downloads */}
            <div className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 80% at 50% 0%, #372F84, transparent 70%)",
                }}
              />
              <div className="relative">
                <div className="w-12 h-12 bg-[#372F84]/10 dark:bg-white/10 rounded-xl flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-[#372F84] dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-lg mb-3 tracking-tight">
                  File Downloads
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Download whitepapers, ebooks, and resources that require email
                  registration without spam.
                </p>
              </div>
            </div>

            {/* Shopping & Deals */}
            <div className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 80% at 50% 0%, #372F84, transparent 70%)",
                }}
              />
              <div className="relative">
                <div className="w-12 h-12 bg-[#372F84]/10 dark:bg-white/10 rounded-xl flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-[#372F84] dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-lg mb-3 tracking-tight">
                  Shopping & Deals
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Get discount codes and promotional offers without endless
                  marketing emails afterward.
                </p>
              </div>
            </div>

            {/* Contest Entries */}
            <div className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 80% at 50% 0%, #372F84, transparent 70%)",
                }}
              />
              <div className="relative">
                <div className="w-12 h-12 bg-[#372F84]/10 dark:bg-white/10 rounded-xl flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-[#372F84] dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-lg mb-3 tracking-tight">
                  Contest Entries
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Enter giveaways and contests safely without worry about
                  long-term spam consequences.
                </p>
              </div>
            </div>

            {/* Software Testing */}
            <div className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 80% at 50% 0%, #372F84, transparent 70%)",
                }}
              />
              <div className="relative">
                <div className="w-12 h-12 bg-[#372F84]/10 dark:bg-white/10 rounded-xl flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-[#372F84] dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-lg mb-3 tracking-tight">
                  Software Testing
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Test applications, forms, and email workflows during
                  development without using real addresses.
                </p>
              </div>
            </div>

            {/* Privacy Protection */}
            <div className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 80% at 50% 0%, #372F84, transparent 70%)",
                }}
              />
              <div className="relative">
                <div className="w-12 h-12 bg-[#372F84]/10 dark:bg-white/10 rounded-xl flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-[#372F84] dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-lg mb-3 tracking-tight">
                  Privacy Protection
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Protect your identity when signing up for services you&apos;re
                  unsure about or don&apos;t fully trust.
                </p>
              </div>
            </div>

            {/* One-time Access */}
            <div className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 80% at 50% 0%, #372F84, transparent 70%)",
                }}
              />
              <div className="relative">
                <div className="w-12 h-12 bg-[#372F84]/10 dark:bg-white/10 rounded-xl flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-[#372F84] dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-lg mb-3 tracking-tight">
                  One-time Access
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Perfect for one-time access to services, forums, or websites
                  but you&apos;ll only use once.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-[#372F84]/10 to-transparent dark:from-[#372F84]/20 border border-[#372F84]/20 rounded-2xl p-8 max-w-3xl mx-auto">
              <h3 className="font-serif text-2xl font-bold mb-4">
                Your Privacy, Your Control
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Every temporary email you create gives you complete control over
                your digital footprint. No more unwanted emails, no more data
                collection, and no more compromised privacy. Use temporary
                emails whenever you need protection without sacrifice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsored Banner Section */}
      {sponsorBanner && (
        <section className="py-12 px-6 font-sans relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Banner Ad Container */}
            <div className="text-center">
              {/* Dynamic sponsor banner */}
              <div className="w-full max-w-[1200px] mx-auto relative">
                {sponsorBanner.target_url ? (
                  <a
                    href={
                      sponsorBanner.target_url.startsWith("http")
                        ? sponsorBanner.target_url
                        : `https://${sponsorBanner.target_url}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative"
                  >
                    <Image
                      src={sponsorBanner.banner_url}
                      alt={`Sponsored by ${sponsorBanner.name}`}
                      width={1200}
                      height={200}
                      className="w-full h-auto rounded-lg"
                      priority={false}
                    />
                    {/* Sponsored label overlay */}
                    <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm border border-[#372F84]/20 rounded-lg px-2 py-1">
                      <p className="text-[10px] text-muted-foreground/70 uppercase tracking-tight font-normal">
                        Sponsored
                      </p>
                    </div>
                  </a>
                ) : (
                  <div className="relative">
                    <Image
                      src={sponsorBanner.banner_url}
                      alt={`Sponsored by ${sponsorBanner.name}`}
                      width={1200}
                      height={200}
                      className="w-full h-auto rounded-lg"
                      priority={false}
                    />
                    {/* Sponsored label overlay */}
                    <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm border border-[#372F84]/20 rounded-lg px-2 py-1">
                      <p className="text-[10px] text-muted-foreground/70 uppercase tracking-tight font-normal">
                        Sponsored
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center mt-4">
              <p className="text-xs text-muted-foreground/60">
                Sponsors help keep <span className="font-serif">genmail</span>{" "}
                free and privacy-focused
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Final CTA Section */}
      <section className="py-20 px-6 font-sans relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-background/60 backdrop-blur-sm border border-border/30 rounded-3xl p-12 relative overflow-hidden">
            {/* Diagonal purple gradient background */}
            <div
              className="absolute inset-0 opacity-20 dark:opacity-25 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, #372F84 0%, transparent 50%, #372F84 100%)",
              }}
            />

            <div className="relative">
              <h2 className="font-serif text-4xl font-bold tracking-tighter mb-4">
                Ready to protect your privacy?
              </h2>

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed tracking-tight">
                Generate your first temporary email in seconds. No signup
                required.
              </p>

              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="font-sans bg-foreground hover:bg-foreground/90 text-background font-regular px-8 py-4 rounded-lg transition-all text-lg tracking-tight shadow-lg"
              >
                Generate an Email
              </button>

              <p className="text-sm text-muted-foreground mt-6 tracking-tight">
                ✓ Instant setup ✓ Zero data retention ✓ Complete privacy
              </p>
            </div>
          </div>
        </div>
      </section>

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

// FAQ Accordion Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
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
          <h3 className="font-medium text-lg pr-4 tracking-tight">
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
            <p className="text-muted-foreground leading-relaxed text-[15px]">
              {answer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
