import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { getClientIP } from "@/lib/utils";

// Force dynamic rendering to prevent static generation errors
export const dynamic = "force-dynamic";

// Simple in-memory rate limiting for password verification
const rateLimitMap = new Map<string, { count: number; firstAttempt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_ATTEMPTS = 10;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, firstAttempt: now });
    return false;
  }

  // Reset if window has passed
  if (now - record.firstAttempt > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, firstAttempt: now });
    return false;
  }

  // Increment count
  record.count++;

  // Clean up old entries periodically
  if (rateLimitMap.size > 1000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (now - value.firstAttempt > RATE_LIMIT_WINDOW) {
        rateLimitMap.delete(key);
      }
    }
  }

  return record.count > RATE_LIMIT_MAX_ATTEMPTS;
}

export async function POST(request: NextRequest) {
  console.log("--- [API /api/verifyInboxPassword] Starting verification ---");

  try {
    const clientIP = getClientIP(request);

    // Simple rate limiting check
    if (isRateLimited(clientIP)) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Initialize Supabase Admin Client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Debug: Check if auth() works
    console.log("Attempting to get auth...");
    const authResult = await auth();
    console.log("Auth result:", authResult);

    const { userId } = authResult;
    console.log("UserId extracted:", userId);

    if (!userId) {
      console.log("No userId found - user not authenticated");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { inboxId, password } = await request.json();
    console.log("Request data:", { inboxId, passwordLength: password?.length });

    if (!inboxId || !password) {
      console.log("Missing required fields");
      return NextResponse.json(
        { error: "Inbox ID and password are required" },
        { status: 400 }
      );
    }

    // 1. Fetch the inbox details using the admin client
    console.log("Fetching inbox from database...");
    const { data: inbox, error: fetchError } = await supabaseAdmin
      .from("inboxes")
      .select("user_id, password_hash")
      .eq("id", inboxId)
      .single();

    console.log("Inbox fetch result:", { inbox, fetchError });

    if (fetchError || !inbox) {
      console.log("Inbox not found in database");
      return NextResponse.json({ error: "Inbox not found" }, { status: 404 });
    }

    // 2. Verify ownership
    console.log("Checking ownership:", {
      inboxUserId: inbox.user_id,
      requestUserId: userId,
    });
    if (inbox.user_id !== userId) {
      console.log("Access denied - user does not own this inbox");
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3. Check if the inbox is actually password-protected
    console.log("Password hash check:", {
      hasPasswordHash: !!inbox.password_hash,
    });
    if (!inbox.password_hash) {
      console.log("Inbox is not password-protected");
      return NextResponse.json({
        success: true,
        message: "Inbox is not password-protected.",
      });
    }

    // 4. Compare the provided password with the stored hash
    console.log("Comparing passwords...");
    const isMatch = await bcrypt.compare(password, inbox.password_hash);
    console.log("Password comparison result:", isMatch);

    if (isMatch) {
      console.log("Password verified successfully");
      return NextResponse.json({
        success: true,
        message: "Password verified.",
      });
    } else {
      console.log("Password verification failed");
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error verifying inbox password:", error);
    return NextResponse.json(
      { error: "An internal error occurred" },
      { status: 500 }
    );
  }
}
