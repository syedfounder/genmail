"use client";

import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DebugClerk() {
  const { user, isSignedIn } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isSignedIn) {
    return <div>Please sign in to view debug info</div>;
  }

  const handleUpgradeToPro = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch("/api/test-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "upgrade_to_pro" }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Successfully upgraded to Pro! Refreshing session...");

        // Set persistent development flag via cookie (accessible in middleware)
        document.cookie = "dev_pro_override=true; path=/; max-age=86400"; // 24 hours

        // Force user object to reload from server
        await user?.reload();

        // Add a longer delay to ensure session propagation
        setTimeout(() => {
          alert(
            "Session refreshed! You now have Pro access - navigate anywhere!"
          );
          window.location.replace("/dashboard");
        }, 1500);
      } else {
        throw new Error(data.error || "Failed to upgrade");
      }
    } catch (error) {
      console.error("Error updating metadata:", error);
      alert("Error updating subscription status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDowngradeToFree = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch("/api/test-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "downgrade_to_free" }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Successfully downgraded to Free! Redirecting to pricing...");
        // Remove development override cookie
        document.cookie =
          "dev_pro_override=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = "/pricing";
      } else {
        throw new Error(data.error || "Failed to downgrade");
      }
    } catch (error) {
      console.error("Error updating metadata:", error);
      alert("Error updating subscription status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>🔍 User Debug Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <strong>User ID:</strong> {user?.id}
            </div>
            <div>
              <strong>Email:</strong> {user?.primaryEmailAddress?.emailAddress}
            </div>
            <div>
              <strong>Public Metadata:</strong>
              <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2 text-sm overflow-auto">
                {JSON.stringify(user?.publicMetadata, null, 2)}
              </pre>
            </div>
            <div>
              <strong>Session Claims:</strong>
              <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2 text-sm overflow-auto">
                Available in middleware only
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🧪 Development Testing Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-4">
              Since webhooks don&apos;t work in localhost, use these buttons to
              manually test subscription states:
            </p>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={handleUpgradeToPro}
                disabled={isUpdating}
                className="bg-green-600 hover:bg-green-700"
              >
                {isUpdating ? "Updating..." : "🚀 Simulate Pro Upgrade"}
              </Button>
              <Button
                onClick={handleDowngradeToFree}
                disabled={isUpdating}
                variant="outline"
              >
                {isUpdating ? "Updating..." : "⬇️ Simulate Free Downgrade"}
              </Button>
              <Button
                onClick={() => {
                  document.cookie =
                    "dev_pro_override=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                  alert(
                    "Development override cleared! You&apos;ll now be treated as free tier."
                  );
                  window.location.reload();
                }}
                variant="secondary"
                size="sm"
              >
                🧹 Clear Override
              </Button>
            </div>
            <p className="text-xs text-orange-600">
              ⚠️ This is for development testing only. In production, Stripe
              webhooks handle this automatically.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
