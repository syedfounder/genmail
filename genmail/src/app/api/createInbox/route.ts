import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    // Generate a random email address with the correct domain
    const randomId = Math.random().toString(36).substring(2, 8);
    const emailAddress = `${randomId}@gminbox.com`;

    // Set expiration to 10 minutes from now (free tier)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const createdAt = new Date();

    // Store inbox in Supabase database
    const { data, error } = await supabase
      .from("inboxes")
      .insert({
        email_address: emailAddress,
        expires_at: expiresAt.toISOString(),
        created_at: createdAt.toISOString(),
        is_active: true,
        current_email_count: 0,
        max_emails: 50, // Free tier limit
        password_hash: null, // No password for free tier
        subscription_tier: "free",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating inbox:", error);
      return NextResponse.json(
        { error: "Failed to create inbox" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      emailAddress,
      expiresAt: expiresAt.toISOString(),
      inboxId: data.id,
    });
  } catch (error) {
    console.error("Error in createInbox API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
