"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, ExternalLink, Loader2 } from "lucide-react";
import {
  useSubscription,
  isPremiumUser,
  createCheckoutSession,
} from "@/lib/subscription";
import { toast } from "sonner";

const proPriceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "";

export function BillingCard() {
  const [isLoading, setIsLoading] = useState(false);
  const subscription = useSubscription();
  const isProUser = isPremiumUser(subscription);

  const handleManageBilling = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/create-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to access billing portal");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Error accessing billing portal:", error);
      toast.error("Failed to access billing portal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      await createCheckoutSession(proPriceId);
    } catch (error) {
      console.error("Error starting checkout:", error);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-[#372F84]" />
          <CardTitle>Billing & Subscription</CardTitle>
        </div>
        <CardDescription>
          Manage your subscription and billing information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Current Plan</p>
            <div className="flex items-center gap-2">
              <Badge variant={isProUser ? "default" : "outline"}>
                {isProUser ? "Pro Plan" : "Free Plan"}
              </Badge>
              {isProUser && (
                <span className="text-xs text-muted-foreground">
                  $4.49/month
                </span>
              )}
            </div>
          </div>
          {isProUser ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleManageBilling}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Manage Billing
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={handleUpgrade}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Upgrade to Pro"
              )}
            </Button>
          )}
        </div>

        {isProUser && (
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="text-green-600">
                {subscription.subscriptionStatus === "active"
                  ? "Active"
                  : subscription.subscriptionStatus}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Next billing</span>
              <span>Automatic renewal</span>
            </div>
          </div>
        )}

        {!isProUser && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Upgrade to Pro for unlimited inboxes, custom lifespans, password
              protection, and more!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
