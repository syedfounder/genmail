import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseServiceClient } from "@/lib/supabaseClient";

export async function GET(request: NextRequest) {
  try {
    console.log("--- [API /api/getInboxDetails] Received request ---");

    // Get inboxId from URL
    const { searchParams } = new URL(request.url);
    const inboxId = searchParams.get("inboxId");

    if (!inboxId) {
      return NextResponse.json(
        { success: false, error: "Inbox ID is required" },
        { status: 400 }
      );
    }

    // Check authentication
    const user = await currentUser();
    if (!user) {
      console.log("[API /api/getInboxDetails] User not authenticated");
      return NextResponse.json(
        { success: false, error: "User must be authenticated" },
        { status: 401 }
      );
    }

    const userId = user.id;
    console.log(
      `[API /api/getInboxDetails] Authenticated user ID: ${userId}, Inbox ID: ${inboxId}`
    );

    if (!supabaseServiceClient) {
      console.error(
        "[API /api/getInboxDetails] Supabase service client not configured"
      );
      return NextResponse.json(
        { success: false, error: "Database service not available" },
        { status: 500 }
      );
    }

    // Fetch inbox details using service role (bypasses RLS)
    const { data, error } = await supabaseServiceClient
      .from("inboxes")
      .select("id, email_address, user_id, password_hash")
      .eq("id", inboxId)
      .single();

    if (error) {
      console.error("[API /api/getInboxDetails] Database error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Could not find inbox or you don't have permission",
        },
        { status: 404 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Inbox not found" },
        { status: 404 }
      );
    }

    // Check if user owns this inbox
    if (data.user_id !== userId) {
      console.log(
        `[API /api/getInboxDetails] Access denied. User ${userId} does not own inbox ${inboxId}`
      );
      return NextResponse.json(
        { success: false, error: "Access denied. You do not own this inbox" },
        { status: 403 }
      );
    }

    console.log(
      `[API /api/getInboxDetails] Successfully retrieved inbox details for ${inboxId}`
    );

    return NextResponse.json({
      success: true,
      inbox: data,
    });
  } catch (error) {
    console.error("[API /api/getInboxDetails] Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
