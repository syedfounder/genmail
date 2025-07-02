import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

// Force dynamic rendering to prevent static generation errors
export const dynamic = "force-dynamic";

// Helper function to validate and clean URL
function validateSupabaseUrl(url: string): string {
  if (!url) {
    throw new Error("Supabase URL is required");
  }

  // Clean the URL - remove any prefixes or quotes that might be present
  const cleanUrl = url
    .replace(/^value:\s*/i, "")
    .replace(/^["']|["']$/g, "")
    .trim();

  if (!cleanUrl) {
    throw new Error("Supabase URL is empty after cleaning");
  }

  // Allow various URL formats for different environments
  if (
    !cleanUrl.startsWith("https://") &&
    !cleanUrl.startsWith("http://127.0.0.1") &&
    !cleanUrl.startsWith("http://localhost")
  ) {
    throw new Error(`Invalid Supabase URL format: ${cleanUrl}`);
  }

  // Validate that it's a proper URL
  try {
    new URL(cleanUrl);
    return cleanUrl;
  } catch {
    throw new Error(`Invalid Supabase URL - failed to parse: ${cleanUrl}`);
  }
}

// Helper function to generate random string for email addresses
function generateRandomString(length: number): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

// Helper function to parse TTL and return expiration date
function getExpirationDate(ttl?: string): Date {
  const now = new Date();
  switch (ttl) {
    case "1h":
      return new Date(now.getTime() + 60 * 60 * 1000);
    case "24h":
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    case "1w":
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes default
  }
}

// Helper function to extract client IP from request headers
function getClientIP(request: NextRequest): string {
  const headers = [
    "cf-connecting-ip", // Cloudflare
    "x-forwarded-for", // Standard proxy header
    "x-real-ip", // Nginx proxy
    "x-client-ip", // Apache
    "x-forwarded", // General
    "forwarded-for", // Alternative
    "forwarded", // RFC 7239
  ];

  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      // For forwarded-for headers, take the first (original client) IP
      let ip = value.split(",")[0].trim();

      // Handle IPv6 localhost normalization
      if (ip === "::1") ip = "127.0.0.1";

      // Basic IP validation
      if (ip && ip !== "unknown" && !ip.includes("<script")) {
        return ip;
      }
    }
  }

  // Fallback for development
  return "127.0.0.1";
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

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

    // Determine final subscription tier
    const finalSubscriptionTier = userId ? subscription_tier : "free";

    // For free tier, implement rate limiting
    if (finalSubscriptionTier === "free") {
      let rateLimitPassed = false;
      let dbRateLimitWorking = false;

      // Check database rate limiting
      try {
        const { data: rateLimitCheck, error: rateLimitError } =
          await supabase.rpc("check_inbox_rate_limit", { client_ip: clientIP });

        if (!rateLimitError && rateLimitCheck !== null) {
          dbRateLimitWorking = true;
          rateLimitPassed = rateLimitCheck === true;
        } else {
          console.error("DB rate limiting failed:", rateLimitError);
          dbRateLimitWorking = false;
          rateLimitPassed = false;
        }
      } catch (error) {
        console.error("DB rate limiting exception:", error);
        dbRateLimitWorking = false;
        rateLimitPassed = false;
      }

      // If database rate limiting isn't working, block the request
      if (!dbRateLimitWorking) {
        return NextResponse.json(
          {
            error:
              "Rate limiting service temporarily unavailable. Please try again in a few minutes.",
            code: "RATE_LIMIT_SERVICE_ERROR",
          },
          { status: 503 }
        );
      }

      // Enforce rate limiting
      if (!rateLimitPassed) {
        return NextResponse.json(
          {
            error:
              "Rate limit exceeded. You can create up to 5 inboxes per hour.",
            code: "RATE_LIMIT_EXCEEDED",
          },
          { status: 429 }
        );
      }

      // Double-check rate limit before insertion
      try {
        const { data: finalCheck, error: finalError } = await supabase.rpc(
          "check_inbox_rate_limit",
          { client_ip: clientIP }
        );

        if (finalError || finalCheck !== true) {
          return NextResponse.json(
            {
              error:
                "Rate limit exceeded. You can create up to 5 inboxes per hour.",
              code: "RATE_LIMIT_EXCEEDED",
            },
            { status: 429 }
          );
        }
      } catch (error) {
        console.error("Final rate limit check exception:", error);
        return NextResponse.json(
          {
            error:
              "Rate limiting service temporarily unavailable. Please try again in a few minutes.",
            code: "RATE_LIMIT_SERVICE_ERROR",
          },
          { status: 503 }
        );
      }
    }

    // Check inbox limits for authenticated users
    if (userId) {
      const { count, error: countError } = await supabase
        .from("inboxes")
        .select("user_id", { count: "exact", head: true })
        .eq("user_id", userId)
        .gt("expires_at", new Date().toISOString());

      if (countError) {
        console.error("Error counting inboxes for user:", countError);
      }

      const maxInboxes = 10;
      if (count !== null && count >= maxInboxes) {
        return NextResponse.json(
          { error: "You have reached the maximum number of inboxes." },
          { status: 403 }
        );
      }
    }

    // Set client IP context (for any remaining triggers)
    await supabase.rpc("set_client_ip", { ip_address: clientIP });

    // Generate unique inbox ID
    const inboxId = uuidv4();

    // Create the inbox
    const { data, error } = await supabase
      .from("inboxes")
      .insert({
        id: inboxId,
        email_address: `${generateRandomString(8)}@gminbox.com`,
        expires_at: getExpirationDate(ttl).toISOString(),
        user_id: userId,
        custom_name: custom_name || null,
        password_hash: password ? await bcrypt.hash(password, 10) : null,
        subscription_tier: finalSubscriptionTier,
      })
      .select()
      .single();

    if (error) {
      console.error("Database error creating inbox:", error);
      return NextResponse.json(
        { error: "Failed to create inbox. Please try again." },
        { status: 500 }
      );
    }

    // Record rate limiting attempt for free tier
    if (finalSubscriptionTier === "free") {
      try {
        const { error: rateLimitRecordError } = await supabase
          .from("inbox_rate_limits")
          .insert({
            ip_address: clientIP,
            inbox_id: inboxId,
            created_at: new Date().toISOString(),
          });

        if (rateLimitRecordError) {
          console.error(
            "Failed to record rate limiting attempt:",
            rateLimitRecordError
          );
        }
      } catch (error) {
        console.error("Exception recording rate limiting attempt:", error);
      }
    }

    // Return the inbox data in the format expected by the frontend
    return NextResponse.json(
      {
        // Database/store format (for dashboard)
        id: data.id,
        email_address: data.email_address,
        created_at: data.created_at,
        expires_at: data.expires_at,
        is_active: data.is_active,
        password_hash: data.password_hash,
        custom_name: data.custom_name,
        user_id: data.user_id,
        subscription_tier: data.subscription_tier,
        // Legacy format (for main page)
        success: true,
        inboxId: data.id,
        emailAddress: data.email_address,
        expiresAt: data.expires_at,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unhandled exception in createInbox:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
