"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X } from "lucide-react";

interface MobileHeaderProps {
  currentPage?: string;
}

export default function MobileHeader({ currentPage }: MobileHeaderProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Close menu when clicking outside or pressing escape
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const navigation = [
    { name: "Pricing", href: "/pricing" },
    { name: "Contact Us", href: "/contact" },
    { name: "Help", href: "/help" },
  ];

  return (
    <>
      <header className="flex justify-between items-center p-4 md:p-6 relative z-50">
        {/* Left side - Logo and Desktop Navigation */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            {mounted && (
              <Image
                src={theme === "dark" ? "/logo-dark.png" : "/logo.png"}
                alt="Genmail Logo"
                width={64}
                height={22}
              />
            )}
          </Link>

          {/* Desktop Navigation - Show on md+ screens, hide on mobile */}
          <div className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-sans text-sm transition-colors font-normal hover:text-foreground ${
                  currentPage === item.href
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <button className="font-sans text-sm border border-foreground/30 hover:border-foreground/50 bg-transparent px-3 py-1.5 rounded-md transition-colors">
              Sponsor Us
            </button>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Desktop Login/Signup - Show on md+ screens */}
          <div className="hidden md:flex items-center gap-2">
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
          </div>

          <ThemeToggle />

          {/* Mobile Menu Button - Show only on mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground hover:bg-secondary rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay - Only show on mobile */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm">
          <div
            className="fixed inset-0 bg-black/20 dark:bg-black/40"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Mobile Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-72 bg-background border-l border-border shadow-2xl">
            <div className="flex flex-col h-full">
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="font-sans font-semibold text-lg">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 p-4">
                <div className="space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block font-sans text-sm py-3 px-4 rounded-lg transition-colors ${
                        currentPage === item.href
                          ? "bg-secondary text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}

                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-left font-sans text-sm py-3 px-4 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                  >
                    Sponsor Us
                  </button>
                </div>

                {/* Separator */}
                <div className="my-6 h-px bg-border" />

                {/* Account Actions */}
                <div className="space-y-3">
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block font-sans text-sm py-3 px-4 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block"
                  >
                    <Button className="font-sans w-full bg-foreground hover:bg-foreground/90 text-background">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </nav>

              {/* Menu Footer */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="relative flex h-2 w-2">
                    <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></div>
                    <div className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></div>
                  </div>
                  <span className="font-sans">Service Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
