"use client";

import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/AuthLayout";
import Link from "next/link";

export default function SignupPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setError("");
    setIsLoading(true);

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send email verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
      setError("");
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(
        err.errors?.[0]?.longMessage || "An error occurred during sign up."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/dashboard");
      } else {
        console.error("Verification incomplete:", completeSignUp);
        setError("Verification failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(
        err.errors?.[0]?.longMessage || "Verification failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <AuthLayout>
        <Card className="mx-auto max-w-md bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-sans">Verify Email</CardTitle>
            <CardDescription className="font-sans">
              Enter the verification code sent to {emailAddress}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerification} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3 text-center font-sans">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="code" className="font-sans">
                  Verification Code
                </Label>
                <Input
                  id="code"
                  name="code"
                  type="text"
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="font-sans"
                  placeholder="Enter 6-digit code"
                />
              </div>
              <Button
                type="submit"
                className="w-full font-sans"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify Email"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setPendingVerification(false);
                setError("");
                setVerificationCode("");
              }}
              className="text-sm font-sans"
            >
              Back to Sign Up
            </Button>
          </CardFooter>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Card className="mx-auto max-w-md bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-sans">Create Account</CardTitle>
          <CardDescription className="font-sans">
            Start protecting your privacy with{" "}
            <span className="font-serif font-semibold text-foreground">
              genmail
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3 text-center font-sans">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-sans">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                className="font-sans"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-sans">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-sans"
                minLength={8}
              />
              <p className="text-xs text-muted-foreground font-sans pt-1">
                Minimum 8 characters.
              </p>
            </div>
            <Button
              type="submit"
              className="w-full font-sans"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <p className="text-center text-sm text-muted-foreground font-sans">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign In
            </Link>
          </p>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors font-sans"
          >
            &larr; Return to Home
          </Link>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
