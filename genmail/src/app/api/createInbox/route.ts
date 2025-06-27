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
  console.log("--- [API /api/createInbox] Received request ---");
  try {
    const authResult = await auth();
    const { userId } = authResult;
    console.log(`[API /api/createInbox] Auth check: userId is ${userId}`);

    const body = await request.json().catch(() => ({})); // Handle empty body for anonymous requests
    console.log("[API /api/createInbox] Parsed request body:", body);
    const { custom_name, password, ttl, subscription_tier = "free" } = body;

    const clientIP = getClientIP(request);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error(
        "[API /api/createInbox] Error: Supabase environment variables are not set."
      );
      throw new Error("Supabase environment variables are not set.");
    }

    const cleanSupabaseUrl = validateSupabaseUrl(supabaseUrl);
    const supabase = createClient(cleanSupabaseUrl, supabaseServiceKey);

    if (userId) {
      // Authenticated user logic
      console.log(`[API /api/createInbox] Authenticated user ID: ${userId}`);

      // Enforce inbox limit for authenticated users
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
        // Fail gracefully, maybe let them create one but log the error
      }

      const maxInboxes = 10; // This could be dynamic based on subscription_tier
      if (count !== null && count >= maxInboxes) {
        console.warn(
          `[API /api/createInbox] User ${userId} has reached the inbox limit of ${maxInboxes}.`
        );
        return NextResponse.json(
          { error: "You have reached the maximum number of inboxes." },
          { status: 403 } // 403 Forbidden is more appropriate than 429
        );
      }
    } else {
      // Anonymous user logic
      console.log(
        `[API /api/createInbox] Anonymous user request from IP: ${clientIP}`
      );
      // Rate limiting for anonymous/free tier
      const { data: rateLimitCheck, error: rateLimitError } =
        await supabase.rpc("check_inbox_rate_limit", { client_ip: clientIP });

      if (rateLimitError) {
        console.error(
          "[API /api/createInbox] Rate limit check RPC error:",
          rateLimitError
        );
        // Do not block creation, just log the error
      } else if (rateLimitCheck === false) {
        console.warn(
          `[API /api/createInbox] Rate limit exceeded for IP: ${clientIP}`
        );
        return NextResponse.json(
          { error: "Rate limit exceeded", code: "RATE_LIMIT_EXCEEDED" },
          { status: 429 }
        );
      }
    }

    // Generate email and expiration
    const randomId = Math.random().toString(36).substring(2, 8);
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
      case "10m":
      default:
        expiresAt = new Date(now.getTime() + 10 * 60 * 1000);
        break;
    }
    console.log(
      `[API /api/createInbox] Calculated expiration: ${expiresAt.toISOString()}`
    );

    let password_hash = null;
    if (password && password.length > 0) {
      console.log(
        "[API /api/createInbox] Password provided. Starting hashing..."
      );
      try {
        const salt = await bcrypt.genSalt(10);
        password_hash = await bcrypt.hash(password, salt);
        console.log("[API /api/createInbox] Password hashed successfully.");
      } catch (hashError) {
        console.error(
          "[API /api/createInbox] Error during password hashing:",
          hashError
        );
        return NextResponse.json(
          {
            error: "Failed to process password",
            details: (hashError as Error).message,
          },
          { status: 500 }
        );
      }
    }

    const inboxToInsert = {
      email_address: emailAddress,
      expires_at: expiresAt.toISOString(),
      created_at: now.toISOString(),
      is_active: true,
      user_id: userId, // This will be null for anonymous users, which is correct
      subscription_tier: userId ? subscription_tier : "free", // Ensure anonymous is free
      custom_name: userId ? custom_name : null, // Anonymous users don't get custom names
      password_hash: userId ? password_hash : null, // Anonymous users don't get passwords
    };

    console.log(
      "[API /api/createInbox] Attempting to insert into Supabase with data:",
      inboxToInsert
    );

    const { data, error } = await supabase
      .from("inboxes")
      .insert(inboxToInsert)
      .select()
      .single();

    if (error) {
      console.error(
        "[API /api/createInbox] Supabase insert error:",
        error.message
      );
      return NextResponse.json(
        {
          error: "Failed to create inbox in database.",
          details: error.message,
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
    console.error("[API /api/createInbox] Unhandled exception:", e);
    const errorMessage =
      e instanceof Error ? e.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
