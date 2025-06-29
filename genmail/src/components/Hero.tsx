"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center flex-1 px-6 pt-16 pb-20 text-center">
      <Link href="/pricing" className="group relative inline-block mb-6">
        <div className="absolute inset-0.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 opacity-50 blur-lg group-hover:opacity-75 transition-opacity duration-300"></div>
        <div className="relative px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm">
          <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            Introducing Custom Inboxes{" "}
            <span className="font-bold text-primary transition-colors">
              Go Pro &rarr;
            </span>
          </span>
        </div>
      </Link>

      <h1 className="text-2xl sm:text-4xl md:text-7xl font-sans mb-6 leading-tight font-semibold tracking-tighter">
        Private,
        <br />
        Temporary Email
        <br />
        in <span className="text-primary">1 Click</span>
      </h1>

      <p className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto">
        Generate anonymous, disposable email addresses that self-destruct after
        10 minutes. No signup, no tracking. Perfect for protecting your privacy
        online.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-lg mx-auto">
        <Button size="lg" className="w-full sm:w-auto shine-button">
          Generate Email
        </Button>
        <div className="w-full sm:w-auto p-3 rounded-lg bg-background/80 backdrop-blur-sm text-muted-foreground border">
          Your temporary email will appear here
        </div>
      </div>
      <p className="text-sm text-green-500 mt-4">
        <span className="relative flex h-3 w-3 -mr-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        &nbsp;Limited free emails available
      </p>
    </section>
  );
}
