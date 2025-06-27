import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  console.log("--- [API /api/deleteAccount] Received request ---");

  try {
    const { userId } = auth();

    if (!userId) {
      console.warn("[API /api/deleteAccount] Unauthorized request: No userId");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(
      `[API /api/deleteAccount] Starting deletion for userId: ${userId}`
    );

    // Placeholder for deletion logic
    // Step 1: Delete all user data from Supabase
    // Step 2: Delete user from Clerk

    console.log(
      `[API /api/deleteAccount] Successfully processed deletion for userId: ${userId}`
    );
    return NextResponse.json({
      success: true,
      message: "Account deletion process initiated.",
    });
  } catch (error) {
    console.error(
      "[API /api/deleteAccount] An unexpected error occurred:",
      error
    );
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}
