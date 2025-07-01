import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";

// Force dynamic rendering to prevent static generation errors
export const dynamic = "force-dynamic";

export async function GET() {
  console.log("--- [API /api/test-auth] Testing authentication ---");

  try {
    const { userId } = await auth();

    if (!userId) {
      console.log("No userId found - user not authenticated");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("User authenticated successfully:", userId);
    return NextResponse.json({
      message: "Authentication successful",
      userId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Auth test error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === "upgrade_to_pro") {
      // Update user metadata to simulate pro subscription
      await (
        await clerkClient()
      ).users.updateUserMetadata(userId, {
        publicMetadata: {
          subscriptionStatus: "active",
          subscriptionTier: "premium",
          isPro: true,
          stripeCustomerId: "cus_test_dev_123",
          stripeSubscriptionId: "sub_test_dev_123",
        },
      });

      // Add a small delay to ensure metadata propagation
      await new Promise((resolve) => setTimeout(resolve, 500));

      return NextResponse.json({
        success: true,
        message: "User upgraded to Pro (development mode)",
        redirectTo: "/dashboard",
        debug: "Metadata updated, session should refresh",
      });
    }

    if (action === "downgrade_to_free") {
      // Update user metadata to simulate free tier
      await (
        await clerkClient()
      ).users.updateUserMetadata(userId, {
        publicMetadata: {
          subscriptionStatus: "canceled",
          subscriptionTier: "free",
          isPro: false,
          stripeCustomerId: null,
          stripeSubscriptionId: null,
        },
      });

      return NextResponse.json({
        success: true,
        message: "User downgraded to Free (development mode)",
        redirectTo: "/pricing",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating subscription status:", error);
    return NextResponse.json(
      { error: "Failed to update subscription status" },
      { status: 500 }
    );
  }
}
