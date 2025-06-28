"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { UserNav } from "./UserNav";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function Header() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const authRoutes = ["/login", "/signup"];

  // Don't render header on dashboard or auth pages
  if (
    pathname.startsWith("/dashboard") ||
    authRoutes.some((route) => pathname.startsWith(route))
  ) {
    return null;
  }

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex justify-between items-center p-6 relative z-10 mx-auto">
        <div className="flex items-center gap-6">
          <Link href="/">
            {mounted && (
              <Image
                src={theme === "dark" ? "/logo-dark.png" : "/logo.png"}
                alt="Genmail Logo"
                width={64}
                height={22}
              />
            )}
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/pricing"
              className="font-sans text-sm text-muted-foreground transition-colors font-normal hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className="font-sans text-sm text-muted-foreground transition-colors font-normal hover:text-foreground"
            >
              Contact Us
            </Link>
            <Link
              href="/help"
              className="font-sans text-sm text-muted-foreground transition-colors font-normal hover:text-foreground"
            >
              Help
            </Link>
          </div>
        </div>
        <div className="font-sans flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <SignedOut>
              <Link
                href="/login"
                className="font-sans text-sm text-muted-foreground transition-colors font-normal hover:text-foreground px-3 py-2"
              >
                Login
              </Link>
              <Link href="/signup">
                <Button className="font-sans bg-foreground hover:bg-foreground/90 text-background">
                  Get Started
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <UserNav />
            </SignedIn>
          </div>
          <ThemeToggle />
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger>
                <Menu className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                </SheetHeader>
                <div className="font-sans flex flex-col gap-4 py-8">
                  <Link
                    href="/pricing"
                    className="text-lg text-muted-foreground transition-colors font-normal hover:text-foreground"
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/contact"
                    className="text-lg text-muted-foreground transition-colors font-normal hover:text-foreground"
                  >
                    Contact Us
                  </Link>
                  <Link
                    href="/help"
                    className="text-lg text-muted-foreground transition-colors font-normal hover:text-foreground"
                  >
                    Help
                  </Link>

                  <hr className="my-4" />

                  <SignedOut>
                    <div className="flex flex-col gap-4">
                      <Link
                        href="/login"
                        className="text-lg text-muted-foreground transition-colors font-normal hover:text-foreground"
                      >
                        Login
                      </Link>
                      <Link href="/signup">
                        <Button className="w-full bg-foreground hover:bg-foreground/90 text-background">
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  </SignedOut>
                  <SignedIn>
                    <Link href="/dashboard">
                      <Button variant="outline" className="w-full">
                        Dashboard
                      </Button>
                    </Link>
                    <UserNav />
                  </SignedIn>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
