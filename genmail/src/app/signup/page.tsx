"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function SignUp() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      alert("Please accept the terms and conditions");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    setIsLoading(true);

    // TODO: Implement actual signup logic
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
        {/* Gradients */}
        {mounted && (
          <>
            <div
              className="absolute top-0 left-0 w-full h-[1400px] pointer-events-none"
              style={{
                background:
                  theme === "dark"
                    ? "radial-gradient(ellipse 50% 50% at 50% 0%, #372F84, transparent 80%)"
                    : "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(55, 47, 132, 0.25), transparent 75%)",
              }}
            />
            <div className="absolute top-0 left-0 w-full h-[800px] pointer-events-none bg-noise opacity-[0.05]"></div>
          </>
        )}

        {/* Header */}
        <header className="flex justify-between items-center p-6 relative z-10">
          <div className="flex items-center gap-6">
            <Link href="/">
              {mounted && (
                <Image
                  src={theme === "dark" ? "/logo-dark.png" : "/logo.png"}
                  alt="Genmail Logo"
                  width={80}
                  height={28}
                />
              )}
            </Link>
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
            <button className="font-sans text-sm border border-foreground/30 hover:border-foreground/50 bg-transparent px-3 py-1.5 rounded-md transition-colors">
              Sponsor Us
            </button>
          </div>
          <div className="font-sans flex items-center gap-2">
            <Link
              href="/login"
              className="font-sans text-sm text-muted-foreground transition-colors font-normal hover:text-foreground px-3 py-2"
            >
              Login
            </Link>
            <Link href="/">
              <Button className="font-sans bg-foreground hover:bg-foreground/90 text-background">
                Back to Home
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-col items-center justify-center flex-1 px-6 pt-10 pb-20 relative z-10">
          <div className="max-w-md w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="font-serif text-4xl font-bold tracking-tighter mb-4">
                Create Account
              </h1>
              <p className="font-sans text-muted-foreground">
                Start protecting your privacy with{" "}
                <span className="font-serif font-semibold">genmail</span>
              </p>
            </div>

            {/* Signup Form */}
            <div className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-2xl p-8 relative overflow-hidden">
              {/* Subtle gradient background */}
              <div
                className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 100% 100% at 50% 0%, #372F84, transparent 70%)",
                }}
              />

              <div className="relative">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="font-sans block text-sm font-medium text-foreground mb-2"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="font-sans w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#372F84] focus:border-transparent transition-colors"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="font-sans block text-sm font-medium text-foreground mb-2"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="font-sans w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#372F84] focus:border-transparent transition-colors"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="font-sans block text-sm font-medium text-foreground mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="font-sans w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#372F84] focus:border-transparent transition-colors"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  {/* Password Fields */}
                  <div>
                    <label
                      htmlFor="password"
                      className="font-sans block text-sm font-medium text-foreground mb-2"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="font-sans w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#372F84] focus:border-transparent transition-colors"
                      placeholder="Create a strong password"
                      required
                      minLength={8}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="font-sans block text-sm font-medium text-foreground mb-2"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="font-sans w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#372F84] focus:border-transparent transition-colors"
                      placeholder="Confirm your password"
                      required
                      minLength={8}
                    />
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 text-[#372F84] bg-secondary border-border rounded focus:ring-[#372F84] focus:ring-2"
                      required
                    />
                    <label
                      htmlFor="acceptTerms"
                      className="font-sans text-sm text-muted-foreground"
                    >
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-[#372F84] hover:text-[#372F84]/80 transition-colors"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-[#372F84] hover:text-[#372F84]/80 transition-colors"
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="font-sans w-full bg-[#372F84] hover:bg-[#372F84]/90 text-white font-semibold py-3 transition-all"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 mr-2"
                          viewBox="0 0 24 24"
                        >
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
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center">
                  <div className="flex-1 border-t border-border/30"></div>
                  <span className="font-sans px-4 text-sm text-muted-foreground">
                    or
                  </span>
                  <div className="flex-1 border-t border-border/30"></div>
                </div>

                {/* Social Signup */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="font-sans w-full border-border/50 hover:border-border transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button>

                  <Button
                    variant="outline"
                    className="font-sans w-full border-border/50 hover:border-border transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.719-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.756-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"
                      />
                    </svg>
                    Continue with GitHub
                  </Button>
                </div>

                {/* Sign In Link */}
                <div className="mt-6 text-center">
                  <p className="font-sans text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-[#372F84] hover:text-[#372F84]/80 font-medium transition-colors"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-8 space-y-4">
              <div className="text-center">
                <h3 className="font-sans text-lg font-semibold text-foreground mb-4">
                  Why choose <span className="font-serif">genmail</span>?
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-5 h-5 rounded-full bg-[#372F84]/20 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-[#372F84]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="font-sans">
                    Instant temporary email generation
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-5 h-5 rounded-full bg-[#372F84]/20 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-[#372F84]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="font-sans">Complete privacy protection</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-5 h-5 rounded-full bg-[#372F84]/20 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-[#372F84]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="font-sans">No spam in your real inbox</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
