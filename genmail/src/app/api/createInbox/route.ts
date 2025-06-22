import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Helper function to validate and clean URL
function validateSupabaseUrl(url: string): string {
  if (!url) {
    throw new Error("Supabase URL is required");
  }

  // Remove any potential "value: " prefix that might be causing issues
  const cleanUrl = url.replace(/^value:\s*/, "").trim();

  // Ensure it starts with https://
  if (!cleanUrl.startsWith("https://")) {
    throw new Error(`Invalid Supabase URL format: ${cleanUrl}`);
  }

  // Validate it's a proper URL
  try {
    new URL(cleanUrl);
    return cleanUrl;
  } catch {
    throw new Error(`Invalid Supabase URL: ${cleanUrl}`);
  }
}

export async function POST() {
  try {
    console.log("Creating inbox - starting process");

    // Initialize Supabase client with validation
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
      throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
    }

    if (!supabaseServiceKey) {
      throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
    }

    // Validate and clean the URL
    const cleanSupabaseUrl = validateSupabaseUrl(supabaseUrl);

    // Create Supabase client
    const supabase = createClient(cleanSupabaseUrl, supabaseServiceKey);

    // Generate a random email address with the correct domain
    const randomId = Math.random().toString(36).substring(2, 8);
    const emailAddress = `${randomId}@gminbox.com`;

    console.log("Generated email address:", emailAddress);

    // Set expiration to 10 minutes from now (free tier)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const createdAt = new Date();

    console.log("Attempting to insert into database...");

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
        subscription_tier: "free",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return NextResponse.json(
        {
          error: "Failed to create inbox",
          details: error.message,
          code: error.code,
        },
        { status: 500 }
      );
    }

    console.log("Database insert successful:", data);

    return NextResponse.json({
      success: true,
      emailAddress,
      expiresAt: expiresAt.toISOString(),
      inboxId: data.id,
    });
  } catch (error) {
    console.error("Unexpected error in createInbox API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
