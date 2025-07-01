import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseServiceClient } from "@/lib/supabaseClient";

export async function GET() {
  try {
    console.log("--- [API /api/getInboxes] Received request ---");

    // Check authentication
    const user = await currentUser();
    if (!user) {
      console.log("[API /api/getInboxes] User not authenticated");
      return NextResponse.json(
        { success: false, error: "User must be authenticated" },
        { status: 401 }
      );
    }

    const userId = user.id;
    console.log(`[API /api/getInboxes] Authenticated user ID: ${userId}`);

    if (!supabaseServiceClient) {
      console.error(
        "[API /api/getInboxes] Supabase service client not configured"
      );
      return NextResponse.json(
        { success: false, error: "Database service not available" },
        { status: 500 }
      );
    }

    // Fetch user's inboxes using service role (bypasses RLS)
    const { data, error } = await supabaseServiceClient
      .from("inboxes")
      .select(
        "id, email_address, created_at, expires_at, is_active, password_hash, custom_name"
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[API /api/getInboxes] Database error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch inboxes" },
        { status: 500 }
      );
    }

    // Filter active inboxes (not expired)
    const activeInboxes = (data || []).filter(
      (inbox) => new Date(inbox.expires_at) > new Date()
    );

    console.log(
      `[API /api/getInboxes] Found ${activeInboxes.length} active inboxes for user`
    );

    return NextResponse.json({
      success: true,
      inboxes: activeInboxes,
    });
  } catch (error) {
    console.error("[API /api/getInboxes] Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
