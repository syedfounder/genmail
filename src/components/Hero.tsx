"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onGenerateInbox?: () => void;
}

export default function Hero({ onGenerateInbox }: HeroProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateInbox = async () => {
    setIsGenerating(true);

    // Call parent handler if provided
    if (onGenerateInbox) {
      onGenerateInbox();
    }

    // TODO: Implement actual inbox generation logic
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <section className="flex flex-col items-center justify-center flex-1 px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        {/* Tagline */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Private, Disposable Email
          <br />
          <span className="text-blue-400">in 1 Click</span>
        </h1>

        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Generate anonymous, temporary email addresses that self-destruct after
          10 minutes. No signup, no ads, no tracking. Perfect for protecting
          your privacy online.
        </p>

        {/* Generate Inbox Button - Using Shadcn UI Button */}
        <Button
          onClick={handleGenerateInbox}
          disabled={isGenerating}
          size="lg"
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-semibold py-4 px-8 text-lg shadow-lg hover:shadow-blue-500/25 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
            </span>
          ) : (
            "Generate Inbox"
          )}
        </Button>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-16 text-center">
          <div className="p-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-blue-400"
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
            <h3 className="text-lg font-semibold mb-2">Anonymous & Secure</h3>
            <p className="text-gray-400">
              No registration required. Your privacy is protected.
            </p>
          </div>

          <div className="p-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-blue-400"
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
            <h3 className="text-lg font-semibold mb-2">Auto-Destruct</h3>
            <p className="text-gray-400">
              Emails self-destruct after 10 minutes automatically.
            </p>
          </div>

          <div className="p-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-blue-400"
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
            <h3 className="text-lg font-semibold mb-2">Real-Time</h3>
            <p className="text-gray-400">
              Receive emails instantly with live updates.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
