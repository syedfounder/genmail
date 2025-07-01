import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import bcrypt from "bcryptjs";

// Force dynamic rendering to prevent static generation errors
export const dynamic = "force-dynamic";

// Helper function to validate and clean URL
function validateSupabaseUrl(url: string): string {
  if (!url) {
    throw new Error("Supabase URL is required");
  }
  const cleanUrl = url
    .replace(/^value:\s*/i, "")
    .replace(/^["']|["']$/g, "")
    .trim();
  if (!cleanUrl) {
    throw new Error("Supabase URL is empty after cleaning");
  }
  if (
    !cleanUrl.startsWith("https://") &&
    !cleanUrl.startsWith("http://127.0.0.1") &&
    !cleanUrl.startsWith("http://localhost")
  ) {
    throw new Error(`Invalid Supabase URL format: ${cleanUrl}`);
  }
  try {
    new URL(cleanUrl);
    return cleanUrl;
  } catch {
    throw new Error(`Invalid Supabase URL - failed to parse: ${cleanUrl}.`);
  }
}

// Helper function to extract client IP from request headers
function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const ip = forwardedFor.split(",")[0].trim();
    // Normalize IPv6 localhost to IPv4 for consistency
    return ip === "::1" ? "127.0.0.1" : ip;
  }
  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    const ip = realIP.trim();
    // Normalize IPv6 localhost to IPv4 for consistency
    return ip === "::1" ? "127.0.0.1" : ip;
  }
  // Fallback - NextRequest doesn't have ip property, so use default
  const ip = "127.0.0.1";
  return ip;
}

export async function POST(request: NextRequest) {
  console.log("--- [API /api/createInbox] Received request ---");
  try {
    const { userId } = await auth();
    console.log(`[API /api/createInbox] Auth check: userId is ${userId}`);

    const body = await request.json().catch(() => ({}));
    const { custom_name, password, ttl, subscription_tier = "free" } = body;

    const clientIP = getClientIP(request);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase environment variables are not set.");
    }

    const cleanSupabaseUrl = validateSupabaseUrl(supabaseUrl);
    const supabase = createClient(cleanSupabaseUrl, supabaseServiceKey);

    // Set the client IP in the database context for rate limiting
    // This allows the trigger and RLS policies to access the real IP
    console.log(
      `[API /api/createInbox] Setting client IP in database context: ${clientIP}`
    );
    const { error: configError } = await supabase.rpc("set_client_ip", {
      ip_address: clientIP,
    });

    if (configError) {
      console.warn(
        "[API /api/createInbox] Could not set IP context:",
        configError
      );
      // Continue anyway - the trigger will fall back to header extraction
    }

    // For free tier, pre-check rate limiting for better error handling
    if (subscription_tier === "free") {
      console.log(
        `[API /api/createInbox] Checking rate limit for IP: ${clientIP}`
      );
      const { data: rateLimitCheck, error: rateLimitError } =
        await supabase.rpc("check_inbox_rate_limit", { client_ip: clientIP });

      console.log(
        `[API /api/createInbox] Rate limit check result - IP: ${clientIP}, allowed: ${rateLimitCheck}, error: ${
          rateLimitError?.message || "none"
        }`
      );

      if (rateLimitError) {
        console.error(
          "[API /api/createInbox] Rate limit check RPC error:",
          rateLimitError
        );
        // SECURITY: If we can't check rate limiting, BLOCK the request for safety
        // This prevents bypassing rate limiting when service is down
        return NextResponse.json(
          {
            error: "Rate limiting service unavailable. Please try again later.",
            code: "RATE_LIMIT_SERVICE_ERROR",
          },
          { status: 503 }
        );
      } else if (rateLimitCheck === false) {
        console.warn(
          `[API /api/createInbox] Rate limit exceeded for IP: ${clientIP}`
        );
        return NextResponse.json(
          {
            error:
              "Rate limit exceeded. You can create up to 5 inboxes per hour.",
            code: "RATE_LIMIT_EXCEEDED",
          },
          { status: 429 }
        );
      } else {
        console.log(
          `[API /api/createInbox] Rate limit check passed for IP: ${clientIP}`
        );
      }
    }

    if (userId) {
      // Authenticated user logic: Check total inbox count
      console.log(`[API /api/createInbox] Authenticated user ID: ${userId}`);
      const { count, error: countError } = await supabase
        .from("inboxes")
        .select("user_id", { count: "exact", head: true })
        .eq("user_id", userId)
        .gt("expires_at", new Date().toISOString());

      if (countError) {
        console.error(
          `[API /api/createInbox] Supabase error counting inboxes for user ${userId}:`,
          countError
        );
      }

      const maxInboxes = 10;
      if (count !== null && count >= maxInboxes) {
        console.warn(
          `[API /api/createInbox] User ${userId} has reached the inbox limit of ${maxInboxes}.`
        );
        return NextResponse.json(
          { error: "You have reached the maximum number of inboxes." },
          { status: 403 }
        );
      }
    }

    // Generate email and expiration
    const randomId = Math.random().toString(36).substring(2, 10);
    const emailAddress = `${randomId}@gminbox.com`;
    let expiresAt: Date;
    const now = new Date();
    switch (ttl) {
      case "1h":
        expiresAt = new Date(now.getTime() + 60 * 60 * 1000);
        break;
      case "24h":
        expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        break;
      case "1w":
        expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      default:
        expiresAt = new Date(now.getTime() + 10 * 60 * 1000);
        break;
    }

    let password_hash = null;
    if (password && password.length > 0) {
      const salt = await bcrypt.genSalt(10);
      password_hash = await bcrypt.hash(password, salt);
    }

    const inboxToInsert = {
      email_address: emailAddress,
      expires_at: expiresAt.toISOString(),
      created_at: now.toISOString(),
      is_active: true,
      user_id: userId,
      subscription_tier: userId ? subscription_tier : "free",
      custom_name: userId ? custom_name : null,
      password_hash: userId ? password_hash : null,
    };

    const { data, error } = await supabase
      .from("inboxes")
      .insert(inboxToInsert)
      .select()
      .single();

    if (error) {
      console.error(
        "[API /api/createInbox] Supabase insert error:",
        error.message,
        "Code:",
        error.code,
        "Details:",
        error.details
      );
      let userFriendlyMessage = "Failed to create inbox in database.";
      if (error.message.includes("duplicate")) {
        userFriendlyMessage = "Email address already exists. Please try again.";
      }
      return NextResponse.json(
        {
          error: userFriendlyMessage,
          details: error.message,
          debug: {
            code: error.code,
            details: error.details,
            emailAddress: inboxToInsert.email_address,
          },
        },
        { status: 500 }
      );
    }

    console.log("[API /api/createInbox] Inbox created successfully:", data);
    return NextResponse.json({
      success: true,
      inboxId: data.id,
      emailAddress: data.email_address,
      expiresAt: data.expires_at,
      ...data,
    });
  } catch (e: unknown) {
    const errorMessage =
      e instanceof Error ? e.message : "An unknown error occurred";
    console.error("[API /api/createInbox] Unhandled exception:", e);
    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
