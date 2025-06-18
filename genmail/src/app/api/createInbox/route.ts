import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // TODO: Integrate with Supabase to create actual inbox
    // For now, simulate inbox creation

    // Generate a random email address
    const randomId = Math.random().toString(36).substring(2, 8);
    const emailAddress = `${randomId}@genmail.app`;

    // Set expiration to 10 minutes from now (free tier)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // TODO: Store inbox in Supabase database
    // const { data, error } = await supabase
    //   .from('inboxes')
    //   .insert({
    //     email_address: emailAddress,
    //     expires_at: expiresAt,
    //     created_at: new Date(),
    //     is_active: true
    //   })
    //   .select()
    //   .single()

    // if (error) {
    //   console.error('Error creating inbox:', error)
    //   return NextResponse.json(
    //     { error: 'Failed to create inbox' },
    //     { status: 500 }
    //   )
    // }

    return NextResponse.json({
      success: true,
      emailAddress,
      expiresAt: expiresAt.toISOString(),
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
