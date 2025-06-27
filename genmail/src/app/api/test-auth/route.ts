import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  console.log("--- [API /api/test-auth] Testing authentication ---");

  try {
    // In Clerk v6/Core 2, auth() must be awaited
    const authResult = await auth();
    const { userId } = authResult;

    console.log("Auth result:", authResult);

    if (!userId) {
      console.log("No userId found - user not authenticated");
      return NextResponse.json(
        { error: "User not authenticated", userId: null, authResult },
        { status: 401 }
      );
    }

    console.log("User authenticated successfully:", userId);
    return NextResponse.json({
      success: true,
      userId,
      authResult,
      message: "User is authenticated",
    });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      {
        error: "Auth error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET(); // Same logic for POST
}
