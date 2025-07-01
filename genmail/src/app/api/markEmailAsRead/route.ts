import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseServiceClient } from "@/lib/supabaseClient";

export async function POST(request: NextRequest) {
  try {
    console.log("--- [API /api/markEmailAsRead] Received request ---");

    // Check authentication
    const user = await currentUser();
    if (!user) {
      console.log("[API /api/markEmailAsRead] User not authenticated");
      return NextResponse.json(
        { success: false, error: "User must be authenticated" },
        { status: 401 }
      );
    }

    const userId = user.id;

    // Parse request body
    const body = await request.json();
    const { emailId } = body;

    if (!emailId) {
      return NextResponse.json(
        { success: false, error: "Email ID is required" },
        { status: 400 }
      );
    }

    console.log(
      `[API /api/markEmailAsRead] Authenticated user ID: ${userId}, Email ID: ${emailId}`
    );

    if (!supabaseServiceClient) {
      console.error(
        "[API /api/markEmailAsRead] Supabase service client not configured"
      );
      return NextResponse.json(
        { success: false, error: "Database service not available" },
        { status: 500 }
      );
    }

    // First verify user owns the inbox that contains this email
    const { data: emailData, error: emailError } = await supabaseServiceClient
      .from("emails")
      .select("id, inbox_id")
      .eq("id", emailId)
      .single();

    if (emailError || !emailData) {
      console.error("[API /api/markEmailAsRead] Email not found:", emailError);
      return NextResponse.json(
        { success: false, error: "Email not found" },
        { status: 404 }
      );
    }

    // Check if user owns the inbox
    const { data: inboxData, error: inboxError } = await supabaseServiceClient
      .from("inboxes")
      .select("user_id")
      .eq("id", emailData.inbox_id)
      .single();

    if (inboxError || !inboxData) {
      console.error("[API /api/markEmailAsRead] Inbox not found:", inboxError);
      return NextResponse.json(
        { success: false, error: "Inbox not found" },
        { status: 404 }
      );
    }

    if (inboxData.user_id !== userId) {
      console.log(
        `[API /api/markEmailAsRead] Access denied. User ${userId} does not own email ${emailId}`
      );
      return NextResponse.json(
        { success: false, error: "Access denied. You do not own this email" },
        { status: 403 }
      );
    }

    // Mark email as read using service role (bypasses RLS)
    const { error: updateError } = await supabaseServiceClient
      .from("emails")
      .update({ is_read: true })
      .eq("id", emailId);

    if (updateError) {
      console.error("[API /api/markEmailAsRead] Database error:", updateError);
      return NextResponse.json(
        { success: false, error: "Failed to mark email as read" },
        { status: 500 }
      );
    }

    console.log(
      `[API /api/markEmailAsRead] Successfully marked email ${emailId} as read`
    );

    return NextResponse.json({
      success: true,
      message: "Email marked as read",
    });
  } catch (error) {
    console.error("[API /api/markEmailAsRead] Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
