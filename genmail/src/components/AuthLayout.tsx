"use client";

import Link from "next/link";
import { ShieldCheck, Mail, Users } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-muted/20 relative">
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2">
            {mounted && (
              <Image
                src={theme === "dark" ? "/logo-dark.png" : "/logo.png"}
                alt="Genmail Logo"
                width={100}
                height={34}
              />
            )}
          </Link>

          <div className="mt-16 space-y-12 text-foreground">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <ShieldCheck
                  className="h-8 w-8 text-primary"
                  strokeWidth={1.5}
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold font-sans tracking-tight">
                  Built-in security
                </h3>
                <p className="mt-2 text-muted-foreground font-sans">
                  Protect your identity with secure, anonymous email aliases
                  that keep your real inbox safe from spam and phishing.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <Mail className="h-8 w-8 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-semibold font-sans tracking-tight">
                  Unlimited private inboxes
                </h3>
                <p className="mt-2 text-muted-foreground font-sans">
                  Create as many email aliases as you need. Organize your
                  digital life without compromising your privacy.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-semibold font-sans tracking-tight">
                  For individuals and teams
                </h3>
                <p className="mt-2 text-muted-foreground font-sans">
                  Whether you&apos;re a solo user or part of a team, genmail
                  offers the flexibility to manage your email privacy
                  effectively.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-10 flex items-center justify-between text-muted-foreground">
          <div className="flex gap-6 text-sm font-sans">
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/help" className="hover:text-foreground">
              Help
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-[#372F84]/20 via-transparent to-transparent blur-3xl" />
          <div className="absolute right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-blue-500/20 via-transparent to-transparent blur-3xl" />
        </div>
        <div className="relative z-10 w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
