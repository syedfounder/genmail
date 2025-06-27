import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export async function DELETE(request: Request) {
  console.log("--- [API /api/deleteInbox] Starting deletion ---");

  try {
    // Authenticate the user
    const authResult = await auth();
    const { userId } = authResult;

    if (!userId) {
      console.log("No userId found - user not authenticated");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Initialize Supabase Admin Client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Rate limit check based on userId
    const { data: isLimited, error: rateLimitError } = await supabaseAdmin.rpc(
      "is_rate_limited",
      {
        p_event_type: "delete_inbox_attempt",
        p_key: userId,
        p_limit_count: 20, // 20 attempts
        p_time_window: "1 hour",
      }
    );

    if (rateLimitError) {
      console.error("Rate limiting check failed:", rateLimitError);
      // Fail open to not block legit users
    }

    if (isLimited) {
      console.warn(`Rate limit for deleteInbox exceeded for user: ${userId}`);
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { inboxId } = await request.json();
    console.log("Request to delete inbox:", inboxId);

    if (!inboxId) {
      console.log("Missing inbox ID");
      return NextResponse.json(
        { error: "Inbox ID is required" },
        { status: 400 }
      );
    }

    // 1. First verify the inbox exists and user owns it
    const { data: inbox, error: fetchError } = await supabaseAdmin
      .from("inboxes")
      .select("user_id, email_address")
      .eq("id", inboxId)
      .single();

    if (fetchError || !inbox) {
      console.log("Inbox not found:", fetchError);
      return NextResponse.json({ error: "Inbox not found" }, { status: 404 });
    }

    // 2. Verify ownership
    if (inbox.user_id !== userId) {
      console.log("Access denied - user does not own this inbox");
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3. Delete the inbox (emails will be cascade deleted due to foreign key constraint)
    const { error: deleteError } = await supabaseAdmin
      .from("inboxes")
      .delete()
      .eq("id", inboxId);

    if (deleteError) {
      console.error("Error deleting inbox:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete inbox" },
        { status: 500 }
      );
    }

    console.log("Inbox deleted successfully:", inbox.email_address);
    return NextResponse.json({
      success: true,
      message: "Inbox deleted successfully",
      deletedInboxId: inboxId,
    });
  } catch (error) {
    console.error("Error in delete inbox API:", error);
    return NextResponse.json(
      { error: "An internal error occurred" },
      { status: 500 }
    );
  }
}
