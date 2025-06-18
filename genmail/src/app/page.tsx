"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);

  const generateInbox = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch("/api/createInbox", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create inbox");
      }

      const data = await response.json();

      if (data.success) {
        setEmailAddress(data.emailAddress);
        setExpiresAt(new Date(data.expiresAt));
      } else {
        throw new Error(data.error || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Error generating inbox:", error);
      // TODO: Show error message to user with proper UI
      alert("Failed to generate inbox. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      {/* Header */}
      <header className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="text-2xl font-bold">
          <span className="text-blue-400">Gen</span>mail
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button className="text-gray-600 dark:text-gray-300 hover:text-blue-400 transition-colors">
            Upgrade
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center flex-1 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tagline */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Private, Disposable Email
            <br />
            <span className="text-blue-400">in 1 Click</span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Generate anonymous, temporary email addresses that self-destruct
            after 10 minutes. No signup, no ads, no tracking. Perfect for
            protecting your privacy online.
          </p>

          {/* Generate Inbox Button */}
          <button
            onClick={generateInbox}
            disabled={isGenerating}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg hover:shadow-blue-500/25 disabled:cursor-not-allowed"
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
          </button>

          {/* Generated Email Display */}
          {emailAddress && expiresAt && (
            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 max-w-lg mx-auto">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                  ✓ Inbox Generated
                </h3>

                {/* Email Address */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                    Your Temporary Email:
                  </label>
                  <div className="flex items-center justify-center gap-2">
                    <code className="bg-white dark:bg-gray-900 px-3 py-2 rounded border text-blue-600 dark:text-blue-400 font-mono text-sm">
                      {emailAddress}
                    </code>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(emailAddress)
                      }
                      className="text-gray-500 hover:text-blue-500 transition-colors"
                      title="Copy to clipboard"
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
                  </div>
                </div>

                {/* Expiration Time */}
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Expires:</span>{" "}
                  <span className="text-red-500 dark:text-red-400">
                    {expiresAt.toLocaleTimeString()} (
                    {Math.round((expiresAt.getTime() - Date.now()) / 60000)} min
                    remaining)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Features */}
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
              <p className="text-gray-500 dark:text-gray-400">
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
              <p className="text-gray-500 dark:text-gray-400">
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
              <p className="text-gray-500 dark:text-gray-400">
                Receive emails instantly with live updates.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-800">
        <p>&copy; 2024 Genmail. Privacy-first disposable email service.</p>
      </footer>
    </div>
  );
}
