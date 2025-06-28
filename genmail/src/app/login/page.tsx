"use client";

import { useSignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

type View = "sign-in" | "forgot-password-email" | "forgot-password-code";

export default function LoginPage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successfulPasswordReset, setSuccessfulPasswordReset] = useState(false);
  const [view, setView] = useState<View>("sign-in");
  const router = useRouter();

  useEffect(() => {
    if (isUserLoaded && user) {
      router.push("/dashboard");
    }
  }, [isUserLoaded, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        console.error("Sign-in incomplete", result);
        setError("Invalid email or password.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.errors?.[0]?.longMessage || "An error occurred during login."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setError("");
    setIsLoading(true);

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: emailAddress,
      });
      setView("forgot-password-code");
    } catch (err: any) {
      setError(
        err.errors?.[0]?.longMessage || "An error occurred sending reset code."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password: password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        setSuccessfulPasswordReset(true);
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        setError("Invalid verification code or new password.");
      }
    } catch (err: any) {
      setError(
        err.errors?.[0]?.longMessage || "An error occurred resetting password."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (view === "forgot-password-email") {
    return (
      <AuthLayout>
        <Card className="w-full max-w-md bg-card border-border backdrop-blur-sm text-card-foreground">
          <CardHeader>
            <CardTitle className="text-2xl font-bold font-sans">
              Reset Password
            </CardTitle>
            <CardDescription className="font-sans text-muted-foreground">
              Enter your email address to receive a verification code.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3 text-center font-sans">
                  {error}
                </div>
              )}
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
              <Button
                type="submit"
                className="w-full font-sans bg-[#372F84] text-white hover:bg-[#372F84]/90 text-base py-6"
                disabled={isLoading}
              >
                {isLoading ? "Sending Code..." : "Send Verification Code"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <button
              onClick={() => setView("sign-in")}
              className="text-sm text-muted-foreground hover:text-[#372F84] font-sans"
            >
              Back to Login
            </button>
          </CardFooter>
        </Card>
      </AuthLayout>
    );
  }

  if (view === "forgot-password-code") {
    return (
      <AuthLayout>
        <Card className="w-full max-w-md bg-card border-border backdrop-blur-sm text-card-foreground">
          <CardHeader>
            <CardTitle className="text-2xl font-bold font-sans">
              Enter Verification Code
            </CardTitle>
            <CardDescription className="font-sans text-muted-foreground">
              Check your email for the code we sent.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {successfulPasswordReset ? (
              <div className="text-center text-green-500 font-sans p-4 bg-green-500/10 rounded-lg">
                Password reset successfully! Redirecting you to the dashboard...
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
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
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="font-sans"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="font-sans text-muted-foreground"
                  >
                    New Password
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
                </div>
                <Button
                  type="submit"
                  className="w-full font-sans bg-[#372F84] text-white hover:bg-[#372F84]/90 text-base py-6"
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <button
              onClick={() => setView("sign-in")}
              className="text-sm text-muted-foreground hover:text-[#000000] dark:text-[#ffffff] font-sans"
            >
              Back to Login
            </button>
          </CardFooter>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Card className="w-full max-w-md bg-card border-border backdrop-blur-sm text-card-foreground">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold tracking-tighter font-sans">
            Welcome back
          </CardTitle>
          <CardDescription className="font-sans font-normal tracking-tight">
            Login to continue to genmail.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isUserLoaded && user ? (
            <div className="text-center text-muted-foreground font-sans p-4 bg-secondary rounded-lg">
              You are already signed in. Redirecting to dashboard...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3 text-center font-sans">
                  {error}
                </div>
              )}
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
                <div className="flex justify-between">
                  <Label
                    htmlFor="password"
                    className="font-sans text-muted-foreground"
                  >
                    Password
                  </Label>
                  <p className="text-xs text-muted-foreground font-sans">
                    Forgot password?{" "}
                    <button
                      type="button"
                      onClick={() => setView("forgot-password-email")}
                      className="font-semibold text-[#372F84] hover:underline"
                    >
                      Reset it
                    </button>
                  </p>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="font-sans"
                />
              </div>
              <ShineBorder>
                <Button
                  type="submit"
                  className="w-full font-sans bg-[#372F84] text-white hover:bg-[#372F84]/90 text-base py-6"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </ShineBorder>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground font-sans">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[#000000] dark:text-[#ffffff] hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
