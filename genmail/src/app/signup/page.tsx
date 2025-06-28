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
import ShineBorder from "@/components/ui/ShineBorder";

export default function SignupPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
        firstName,
        lastName,
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
        <div id="clerk-captcha" className="mb-4"></div>
        <Card className="mx-auto max-w-md bg-card border-border backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-sans text-card-foreground">
              Verify Email
            </CardTitle>
            <CardDescription className="font-sans text-muted-foreground">
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
                <Label
                  htmlFor="code"
                  className="font-sans text-muted-foreground"
                >
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
                className="w-full font-sans bg-[#372F84] text-white hover:bg-[#372F84]/90"
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
      <div id="clerk-captcha" className="mb-4"></div>
      <Card className="w-full max-w-md bg-card border-border backdrop-blur-sm text-card-foreground">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold tracking-tighter font-sans">
            Create your account
          </CardTitle>
          <CardDescription className="font-sans text-muted-foreground">
            No credit card required.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3 text-center font-sans">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="first-name"
                  className="font-sans text-muted-foreground"
                >
                  First Name
                </Label>
                <Input
                  id="first-name"
                  name="first-name"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="font-sans"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="last-name"
                  className="font-sans text-muted-foreground"
                >
                  Last Name
                </Label>
                <Input
                  id="last-name"
                  name="last-name"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="font-sans"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="font-sans text-muted-foreground"
              >
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
              <Label
                htmlFor="password"
                className="font-sans text-muted-foreground"
              >
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-sans"
              />
              <p className="text-xs text-muted-foreground font-sans">
                Minimum length is 8 characters.
              </p>
            </div>
            <ShineBorder>
              <Button
                type="submit"
                className="w-full font-sans bg-[#372F84] text-white hover:bg-[#372F84]/90 text-base py-6"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </ShineBorder>
          </form>
          <p className="text-center text-sm text-muted-foreground font-sans">
            By creating an account, you agree to the{" "}
            <Link href="/terms" className="underline hover:text-[#372F84]">
              Terms of Service
            </Link>
            .
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground font-sans">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#000000] dark:text-[#ffffff] hover:underline"
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
