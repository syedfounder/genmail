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
  const { isLoaded, signUp } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setError("");

    try {
      await signUp.create({
        emailAddress,
        password,
      });
      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err.errors[0]?.longMessage || "An error occurred during sign up."
      );
    }
  };

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
            <Button type="submit" className="w-full font-sans">
              Create Account
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
