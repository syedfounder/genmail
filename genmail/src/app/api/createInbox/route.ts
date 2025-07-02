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
  // Check multiple headers in order of preference
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

      // Validate the IP format (basic check)
      if (ip && ip !== "unknown" && !ip.includes("<script")) {
        console.log(`[IP Detection] Found IP ${ip} from header: ${header}`);
        return ip;
      }
    }
  }

  // If we reach here, we couldn't detect the IP - this is a problem in production
  console.warn(
    "[IP Detection] Could not detect client IP - using fallback 127.0.0.1"
  );
  console.warn(
    "[IP Detection] Available headers:",
    Object.fromEntries(request.headers.entries())
  );

  return "127.0.0.1";
}

export async function POST(request: NextRequest) {
  console.log("--- [API /api/createInbox] Received request ---");
  try {
    const { userId } = await auth();
    console.log(`[API /api/createInbox] Auth check: userId is ${userId}`);

    const body = await request.json().catch(() => ({}));
    const { custom_name, password, ttl, subscription_tier = "free" } = body;

    const clientIP = getClientIP(request);
    console.log(`[API /api/createInbox] Detected client IP: ${clientIP}`);
    console.log(`[API /api/createInbox] Request headers for debugging:`, {
      "cf-connecting-ip": request.headers.get("cf-connecting-ip"),
      "x-forwarded-for": request.headers.get("x-forwarded-for"),
      "x-real-ip": request.headers.get("x-real-ip"),
      "user-agent": request.headers.get("user-agent")?.substring(0, 50) + "...",
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase environment variables are not set.");
    }

    const cleanSupabaseUrl = validateSupabaseUrl(supabaseUrl);
    const supabase = createClient(cleanSupabaseUrl, supabaseServiceKey);

    // Determine final subscription tier
    // For anonymous users, always use "free"
    // For authenticated users, use the provided subscription_tier (could be "premium" if they're subscribers)
    const finalSubscriptionTier = userId ? subscription_tier : "free";
    console.log(`[API /api/createInbox] Subscription tier determination:`, {
      userId: userId ? "authenticated" : "anonymous",
      providedTier: subscription_tier,
      finalTier: finalSubscriptionTier,
      willCheckRateLimit: finalSubscriptionTier === "free",
    });

    // For free tier, implement robust rate limiting
    if (finalSubscriptionTier === "free") {
      console.log(
        `[API /api/createInbox] Checking rate limit for IP: ${clientIP}`
      );

      // CRITICAL: We must enforce rate limiting before any database operations
      // since service role bypasses RLS policies

      let rateLimitPassed = false;
      let dbRateLimitWorking = false;

      // First try the database function
      try {
        console.log(
          `[API /api/createInbox] Calling check_inbox_rate_limit with IP: ${clientIP}`
        );
        const { data: rateLimitCheck, error: rateLimitError } =
          await supabase.rpc("check_inbox_rate_limit", { client_ip: clientIP });

        console.log(`[API /api/createInbox] Rate limit RPC response:`, {
          data: rateLimitCheck,
          error: rateLimitError,
        });

        if (!rateLimitError && rateLimitCheck !== null) {
          dbRateLimitWorking = true;
          rateLimitPassed = rateLimitCheck === true;
          console.log(
            `[API /api/createInbox] DB rate limit check result: ${rateLimitPassed} (dbWorking: ${dbRateLimitWorking})`
          );
        } else {
          console.error(
            "[API /api/createInbox] CRITICAL: DB rate limiting failed in production:",
            rateLimitError
          );
          // In production, if DB rate limiting fails, we should block to be safe
          dbRateLimitWorking = false;
          rateLimitPassed = false;
        }
      } catch (error) {
        console.error(
          "[API /api/createInbox] CRITICAL: DB rate limiting exception:",
          error
        );
        // In production, if DB rate limiting fails, we should block to be safe
        dbRateLimitWorking = false;
        rateLimitPassed = false;
      }

      // If database rate limiting isn't working, block the request in production
      // In-memory backup is unreliable in serverless environments like Vercel
      if (!dbRateLimitWorking) {
        console.error(
          `[API /api/createInbox] PRODUCTION SAFETY: Blocking request due to DB rate limiting failure for IP: ${clientIP}`
        );
        return NextResponse.json(
          {
            error:
              "Rate limiting service temporarily unavailable. Please try again in a few minutes.",
            code: "RATE_LIMIT_SERVICE_ERROR",
          },
          { status: 503 }
        );
      }

      // ENFORCE RATE LIMITING: If rate limit check failed, absolutely block the request
      if (!rateLimitPassed) {
        console.warn(
          `[API /api/createInbox] Rate limit exceeded for IP: ${clientIP} - BLOCKING REQUEST`
        );
        return NextResponse.json(
          {
            error:
              "Rate limit exceeded. You can create up to 5 inboxes per hour.",
            code: "RATE_LIMIT_EXCEEDED",
          },
          { status: 429 }
        );
      }

      // ADDITIONAL SAFETY CHECK: Double-check rate limit right before insertion
      // This helps prevent race conditions in high-traffic scenarios
      console.log(
        `[API /api/createInbox] Performing final rate limit verification for IP: ${clientIP}`
      );
      try {
        const { data: finalCheck, error: finalError } = await supabase.rpc(
          "check_inbox_rate_limit",
          { client_ip: clientIP }
        );

        if (finalError || finalCheck !== true) {
          console.warn(
            `[API /api/createInbox] Final rate limit check failed for IP: ${clientIP}`,
            { data: finalCheck, error: finalError }
          );
          return NextResponse.json(
            {
              error:
                "Rate limit exceeded. You can create up to 5 inboxes per hour.",
              code: "RATE_LIMIT_EXCEEDED",
            },
            { status: 429 }
          );
        }
        console.log(
          `[API /api/createInbox] Final rate limit check passed for IP: ${clientIP}`
        );
      } catch (error) {
        console.error(
          `[API /api/createInbox] Final rate limit check exception for IP: ${clientIP}`,
          error
        );
        return NextResponse.json(
          {
            error:
              "Rate limiting service temporarily unavailable. Please try again in a few minutes.",
            code: "RATE_LIMIT_SERVICE_ERROR",
          },
          { status: 503 }
        );
      }

      console.log(
        `[API /api/createInbox] All rate limit checks passed for IP: ${clientIP} - proceeding with inbox creation`
      );
    }

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
      subscription_tier: finalSubscriptionTier,
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

    // If using backup rate limiting, record the successful attempt
    if (finalSubscriptionTier === "free") {
      try {
        // Verify that database recorded the attempt
        const { data: recorded } = await supabase
          .from("inbox_rate_limits")
          .select("id")
          .eq("inbox_id", data.id)
          .maybeSingle();

        if (!recorded) {
          console.error(
            "[API /api/createInbox] CRITICAL: Database failed to record rate limiting attempt for inbox:",
            data.id
          );
          // This is a serious issue - the rate limiting tracking failed
          // We should consider this a system error
        } else {
          console.log(
            "[API /api/createInbox] Rate limiting attempt successfully recorded in database"
          );
        }
      } catch (error) {
        console.error(
          "[API /api/createInbox] Error verifying rate limiting record:",
          error
        );
      }
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
