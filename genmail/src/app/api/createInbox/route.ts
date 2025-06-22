import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

// Helper function to validate and clean URL
function validateSupabaseUrl(url: string): string {
  if (!url) {
    throw new Error("Supabase URL is required");
  }

  // Remove any potential "value: " or "Value: " prefix that might be causing issues
  const cleanUrl = url.replace(/^value:\s*/i, "").trim();

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

// Helper function to extract client IP from request headers
function getClientIP(request: NextRequest): string {
  // Try different header sources in order of preference
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const remoteAddr = request.headers.get("x-forwarded-host");

  // x-forwarded-for can contain multiple IPs, take the first one
  if (forwardedFor) {
    const ips = forwardedFor.split(",");
    return ips[0].trim();
  }

  if (realIP) {
    return realIP.trim();
  }

  if (remoteAddr) {
    return remoteAddr.trim();
  }

  // Fallback - this shouldn't happen in production on Vercel
  return "127.0.0.1";
}

export async function POST(request: NextRequest) {
  try {
    console.log("Creating inbox - starting process");

    // Extract client IP for rate limiting
    const clientIP = getClientIP(request);
    const userAgent = request.headers.get("user-agent") || "unknown";

    console.log("Client IP:", clientIP, "User Agent:", userAgent);

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

    // Check rate limit before attempting to create inbox
    console.log("Checking rate limit for IP:", clientIP);

    const { data: rateLimitCheck, error: rateLimitError } = await supabase.rpc(
      "check_inbox_rate_limit",
      { client_ip: clientIP }
    );

    if (rateLimitError) {
      console.error("Rate limit check error:", rateLimitError);
      // Continue anyway - don't block on rate limit check failure
    } else if (rateLimitCheck === false) {
      console.log("Rate limit exceeded for IP:", clientIP);
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message:
            "You can only create 5 inboxes per hour. Please try again later or upgrade to Pro for higher limits.",
          code: "RATE_LIMIT_EXCEEDED",
        },
        { status: 429 }
      );
    }

    // Generate a random email address with the correct domain
    const randomId = Math.random().toString(36).substring(2, 8);
    const emailAddress = `${randomId}@gminbox.com`;

    console.log("Generated email address:", emailAddress);

    // Set expiration to 10 minutes from now (free tier)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const createdAt = new Date();

    console.log("Attempting to insert into database...");

    // Set request context for database functions to access IP and user agent
    const requestHeaders = {
      "x-forwarded-for": clientIP,
      "x-real-ip": clientIP,
      "user-agent": userAgent,
    };

    // Store inbox in Supabase database with request context
    const { data, error } = await supabase
      .rpc("set_config", {
        setting_name: "request.headers",
        setting_value: JSON.stringify(requestHeaders),
        is_local: true,
      })
      .then(() =>
        supabase
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
          .single()
      );

    if (error) {
      console.error("Supabase error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });

      // Check if this is a rate limit violation from RLS policy
      if (
        error.code === "42501" ||
        error.message.includes("rate limit") ||
        error.message.includes("check_inbox_rate_limit")
      ) {
        return NextResponse.json(
          {
            error: "Rate limit exceeded",
            message:
              "You can only create 5 inboxes per hour. Please try again later or upgrade to Pro for higher limits.",
            code: "RATE_LIMIT_EXCEEDED",
          },
          { status: 429 }
        );
      }

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

    // Record the rate limit entry (as backup, the trigger should handle this)
    try {
      await supabase.rpc("record_inbox_creation", {
        client_ip: clientIP,
        client_user_agent: userAgent,
        created_inbox_id: data.id,
      });
    } catch (recordError) {
      console.warn(
        "Failed to record rate limit (trigger should handle this):",
        recordError
      );
      // Don't fail the request if recording fails
    }

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
