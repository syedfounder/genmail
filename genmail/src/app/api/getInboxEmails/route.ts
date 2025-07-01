import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseServiceClient } from "@/lib/supabaseClient";

export async function GET(request: NextRequest) {
  try {
    console.log("--- [API /api/getInboxEmails] Received request ---");

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
      console.log("[API /api/getInboxEmails] User not authenticated");
      return NextResponse.json(
        { success: false, error: "User must be authenticated" },
        { status: 401 }
      );
    }

    const userId = user.id;
    console.log(
      `[API /api/getInboxEmails] Authenticated user ID: ${userId}, Inbox ID: ${inboxId}`
    );

    if (!supabaseServiceClient) {
      console.error(
        "[API /api/getInboxEmails] Supabase service client not configured"
      );
      return NextResponse.json(
        { success: false, error: "Database service not available" },
        { status: 500 }
      );
    }

    // First verify user owns this inbox
    const { data: inboxData, error: inboxError } = await supabaseServiceClient
      .from("inboxes")
      .select("user_id")
      .eq("id", inboxId)
      .single();

    if (inboxError || !inboxData) {
      console.error("[API /api/getInboxEmails] Inbox not found:", inboxError);
      return NextResponse.json(
        { success: false, error: "Inbox not found" },
        { status: 404 }
      );
    }

    if (inboxData.user_id !== userId) {
      console.log(
        `[API /api/getInboxEmails] Access denied. User ${userId} does not own inbox ${inboxId}`
      );
      return NextResponse.json(
        { success: false, error: "Access denied. You do not own this inbox" },
        { status: 403 }
      );
    }

    // Fetch emails for this inbox with attachments using service role (bypasses RLS)
    const { data, error } = await supabaseServiceClient
      .from("emails")
      .select(
        `
        id, 
        from_address, 
        subject, 
        body, 
        html_body, 
        received_at, 
        is_read,
        attachment_count,
        total_size_bytes,
        attachments (
          id,
          filename,
          original_filename,
          content_type,
          file_size,
          is_allowed,
          created_at,
          download_count
        )
      `
      )
      .eq("inbox_id", inboxId)
      .order("received_at", { ascending: false });

    if (error) {
      console.error("[API /api/getInboxEmails] Database error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch emails for this inbox" },
        { status: 500 }
      );
    }

    console.log(
      `[API /api/getInboxEmails] Found ${
        data?.length || 0
      } emails for inbox ${inboxId}`
    );

    return NextResponse.json({
      success: true,
      emails: data || [],
    });
  } catch (error) {
    console.error("[API /api/getInboxEmails] Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
