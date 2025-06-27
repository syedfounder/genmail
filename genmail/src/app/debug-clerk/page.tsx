"use client";

import { useEffect, useState } from "react";

export default function DebugClerkPage() {
  const [envVars, setEnvVars] = useState<any>({});
  const [clerkStatus, setClerkStatus] = useState<string>("Checking...");

  useEffect(() => {
    // Check environment variables (only public ones)
    const env = {
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
    };
    setEnvVars(env);

    // Check if Clerk is loading
    const checkClerk = () => {
      if (typeof window !== "undefined") {
        if ((window as any).Clerk) {
          setClerkStatus("✅ Clerk loaded successfully");
        } else {
          setClerkStatus("❌ Clerk failed to load");
        }
      }
    };

    // Check immediately and after a delay
    checkClerk();
    const timer = setTimeout(checkClerk, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Clerk Debug Page</h1>

        <div className="space-y-6">
          {/* Environment Variables */}
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">
              Environment Variables
            </h2>
            <div className="space-y-2 font-mono text-sm">
              {Object.entries(envVars).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-muted-foreground">{key}:</span>
                  <span className={value ? "text-green-500" : "text-red-500"}>
                    {value
                      ? `${String(value).substring(0, 20)}...`
                      : "❌ Missing"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Clerk Status */}
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Clerk Status</h2>
            <p className="text-lg">{clerkStatus}</p>
          </div>

          {/* Network Test */}
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Network Connectivity</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Current domain:{" "}
              {typeof window !== "undefined"
                ? window.location.hostname
                : "Unknown"}
            </p>
            <p className="text-sm text-muted-foreground">
              Protocol:{" "}
              {typeof window !== "undefined"
                ? window.location.protocol
                : "Unknown"}
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-yellow-600">
              Production Checklist
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                ✅ Verify NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set (production
                key)
              </li>
              <li>✅ Verify CLERK_SECRET_KEY is set (production key)</li>
              <li>✅ Add your production domain to Clerk Dashboard</li>
              <li>✅ Check Clerk instance is in correct region</li>
              <li>✅ Verify CSP allows Clerk domains</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
