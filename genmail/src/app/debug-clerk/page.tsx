"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function DebugClerk() {
  const { user, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);
  const [debugInfo, setDebugInfo] = useState<{
    publishableKey?: string;
    keyType?: string;
    domain?: string;
    protocol?: string;
    nodeEnv?: string;
    userLoaded?: boolean;
    userExists?: boolean;
    currentUrl?: string;
  }>({});

  useEffect(() => {
    setMounted(true);

    // Gather debug information
    const info = {
      publishableKey:
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 15) + "...",
      keyType: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith(
        "pk_live_"
      )
        ? "Production"
        : process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_test_")
        ? "Development"
        : "Unknown",
      domain: typeof window !== "undefined" ? window.location.host : "Server",
      protocol:
        typeof window !== "undefined" ? window.location.protocol : "Unknown",
      nodeEnv: process.env.NODE_ENV,
      userLoaded: isLoaded,
      userExists: !!user,
      currentUrl:
        typeof window !== "undefined" ? window.location.href : "Server",
    };

    setDebugInfo(info);
  }, [isLoaded, user]);

  if (!mounted) {
    return <div>Loading debug info...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔧 Clerk Debug Information</h1>

        <div className="grid gap-6">
          {/* Environment Check */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Environment Variables
            </h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    debugInfo.publishableKey ? "bg-green-500" : "bg-red-500"
                  }`}
                ></span>
                <strong>Publishable Key:</strong>{" "}
                {debugInfo.publishableKey || "❌ NOT SET"}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    debugInfo.keyType === "Production"
                      ? "bg-green-500"
                      : debugInfo.keyType === "Development"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                ></span>
                <strong>Key Type:</strong> {debugInfo.keyType}
                {debugInfo.keyType === "Development" && (
                  <span className="text-yellow-600 text-sm">
                    (Should be Production for live site)
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    debugInfo.nodeEnv === "production"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                ></span>
                <strong>NODE_ENV:</strong> {debugInfo.nodeEnv}
              </div>
            </div>
          </div>

          {/* Domain Check */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Domain Configuration</h2>
            <div className="space-y-2">
              <div>
                <strong>Current Domain:</strong> {debugInfo.domain}
              </div>
              <div>
                <strong>Protocol:</strong> {debugInfo.protocol}
              </div>
              <div>
                <strong>Full URL:</strong> {debugInfo.currentUrl}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                ⚠️ Make sure this domain is added to your Clerk Dashboard →
                Configure → Domain & URLs
              </div>
            </div>
          </div>

          {/* Clerk Status */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Clerk Status</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    debugInfo.userLoaded ? "bg-green-500" : "bg-red-500"
                  }`}
                ></span>
                <strong>Clerk Loaded:</strong>{" "}
                {debugInfo.userLoaded ? "✅ Yes" : "❌ No"}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    debugInfo.userExists ? "bg-green-500" : "bg-gray-500"
                  }`}
                ></span>
                <strong>User Signed In:</strong>{" "}
                {debugInfo.userExists
                  ? "✅ Yes"
                  : "➖ No (not required for this test)"}
              </div>
              {user && (
                <div className="mt-2 p-2 bg-green-50 rounded">
                  <strong>User Email:</strong>{" "}
                  {user.primaryEmailAddress?.emailAddress}
                </div>
              )}
            </div>
          </div>

          {/* Fix Instructions */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">🚨 Common Fixes</h2>

            {debugInfo.keyType === "Development" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-red-800 mb-2">
                  ❌ Using Development Keys in Production
                </h3>
                <p className="text-sm text-red-700">
                  You&apos;re using development Clerk keys (
                  <code>pk_test_</code>) in production. You need to update your
                  environment variables with production keys (
                  <code>pk_live_</code>).
                </p>
                <div className="mt-2">
                  <strong>Steps to fix:</strong>
                  <ol className="list-decimal list-inside text-sm mt-1 space-y-1">
                    <li>
                      Go to{" "}
                      <a
                        href="https://dashboard.clerk.com"
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        Clerk Dashboard
                      </a>
                    </li>
                    <li>Navigate to Configure → API Keys</li>
                    <li>
                      Copy your <strong>Production</strong> keys (pk_live_ and
                      sk_live_)
                    </li>
                    <li>Update your Vercel/deployment environment variables</li>
                    <li>Redeploy your application</li>
                  </ol>
                </div>
              </div>
            )}

            {!debugInfo.publishableKey && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-red-800 mb-2">
                  ❌ Missing Publishable Key
                </h3>
                <p className="text-sm text-red-700">
                  <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> environment
                  variable is not set.
                </p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">
                📋 Environment Variables Needed
              </h3>
              <div className="text-sm space-y-1">
                <div>
                  <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...</code>
                </div>
                <div>
                  <code>CLERK_SECRET_KEY=sk_live_...</code>
                </div>
              </div>
              <p className="text-sm text-blue-700 mt-2">
                Also ensure <strong>{debugInfo.domain}</strong> is added to your
                Clerk Dashboard → Domain & URLs
              </p>
            </div>
          </div>

          {/* Network Test */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Network Test</h2>
            <p className="text-sm text-muted-foreground mb-2">
              Open browser dev tools → Network tab and look for failed requests
              to:
            </p>
            <ul className="text-sm space-y-1">
              <li>
                • <code>*.clerk.com</code> - Should return 200
              </li>
              <li>
                • <code>clerk.genmail.app</code> - Should return 200
              </li>
              <li>• Look for 400/401/403 errors</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
