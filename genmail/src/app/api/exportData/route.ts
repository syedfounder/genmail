import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

// Force dynamic rendering to prevent static generation errors
export const dynamic = "force-dynamic";

export async function GET() {
  console.log("--- [API /api/exportData] Received request ---");

  try {
    const { userId } = await auth();

    if (!userId) {
      console.warn("[API /api/exportData] Unauthorized request: No userId");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(`[API /api/exportData] Starting export for userId: ${userId}`);

    // Initialize Supabase Admin Client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Fetch all inboxes and their associated emails for the user
    const { data: inboxes, error } = await supabaseAdmin
      .from("inboxes")
      .select(
        `
        id,
        email_address,
        created_at,
        expires_at,
        is_active,
        subscription_tier,
        max_emails,
        current_email_count,
        last_accessed_at,
        user_id,
        custom_name,
        emails (
          *
        )
      `
      )
      .eq("user_id", userId);

    if (error) {
      console.error(
        `[API /api/exportData] Supabase error fetching data for userId: ${userId}`,
        error
      );
      return NextResponse.json(
        { error: "Failed to fetch user data." },
        { status: 500 }
      );
    }

    // Structure the data for export
    const exportData = {
      exported_at: new Date().toISOString(),
      user_id: userId,
      inbox_count: inboxes?.length || 0,
      inboxes: inboxes,
    };

    console.log(
      `[API /api/exportData] Successfully fetched ${exportData.inbox_count} inboxes for userId: ${userId}`
    );

    return NextResponse.json(exportData);
  } catch (error) {
    console.error("[API /api/exportData] An unexpected error occurred:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}
