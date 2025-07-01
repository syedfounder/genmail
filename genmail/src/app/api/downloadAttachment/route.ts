import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseServiceClient } from "@/lib/supabaseClient";

// Type for the nested query result
interface AttachmentWithEmail {
  id: string;
  filename: string;
  original_filename: string;
  content_type: string;
  file_size: number;
  storage_path: string;
  is_allowed: boolean;
  download_count: number;
  emails: {
    id: string;
    inbox_id: string;
    inboxes: {
      user_id: string;
      is_active: boolean;
      expires_at: string;
    }[];
  }[];
}

export async function GET(request: NextRequest) {
  try {
    console.log("--- [API /api/downloadAttachment] Received request ---");

    // Check authentication
    const user = await currentUser();
    if (!user) {
      console.log("[API /api/downloadAttachment] User not authenticated");
      return NextResponse.json(
        { success: false, error: "User must be authenticated" },
        { status: 401 }
      );
    }

    const userId = user.id;

    // Get attachment ID from URL
    const { searchParams } = new URL(request.url);
    const attachmentId = searchParams.get("attachmentId");

    if (!attachmentId) {
      return NextResponse.json(
        { success: false, error: "Attachment ID is required" },
        { status: 400 }
      );
    }

    console.log(
      `[API /api/downloadAttachment] User ${userId} requesting attachment ${attachmentId}`
    );

    if (!supabaseServiceClient) {
      console.error(
        "[API /api/downloadAttachment] Supabase service client not configured"
      );
      return NextResponse.json(
        { success: false, error: "Database service not available" },
        { status: 500 }
      );
    }

    // Verify user owns the attachment and get file details
    const { data: attachmentData, error: attachmentError } =
      await supabaseServiceClient
        .from("attachments")
        .select(
          `
        id,
        filename,
        original_filename,
        content_type,
        file_size,
        storage_path,
        is_allowed,
        download_count,
        emails!inner(
          id,
          inbox_id,
          inboxes!inner(user_id, is_active, expires_at)
        )
      `
        )
        .eq("id", attachmentId)
        .single();

    if (attachmentError || !attachmentData) {
      console.error(
        "[API /api/downloadAttachment] Attachment not found:",
        attachmentError
      );
      return NextResponse.json(
        { success: false, error: "Attachment not found" },
        { status: 404 }
      );
    }

    // Check ownership
    const inbox = (attachmentData as AttachmentWithEmail).emails[0].inboxes[0];
    if (inbox.user_id !== userId) {
      console.log(
        `[API /api/downloadAttachment] Access denied. User ${userId} does not own attachment ${attachmentId}`
      );
      return NextResponse.json(
        {
          success: false,
          error: "Access denied. You do not own this attachment",
        },
        { status: 403 }
      );
    }

    // Check if inbox is still active
    if (!inbox.is_active || new Date(inbox.expires_at) < new Date()) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot download from expired or inactive inbox",
        },
        { status: 400 }
      );
    }

    // Check if attachment is allowed
    if (!attachmentData.is_allowed) {
      return NextResponse.json(
        { success: false, error: "This attachment has been blocked" },
        { status: 403 }
      );
    }

    // Download file from Supabase storage
    const { data: fileData, error: downloadError } =
      await supabaseServiceClient.storage
        .from("email-attachments")
        .download(attachmentData.storage_path);

    if (downloadError || !fileData) {
      console.error(
        "[API /api/downloadAttachment] Storage download error:",
        downloadError
      );
      return NextResponse.json(
        { success: false, error: "Failed to download file from storage" },
        { status: 500 }
      );
    }

    // Update download count
    await supabaseServiceClient
      .from("attachments")
      .update({
        download_count: attachmentData.download_count + 1,
        downloaded_at: new Date().toISOString(),
      })
      .eq("id", attachmentId);

    console.log(
      `[API /api/downloadAttachment] Successfully served attachment ${attachmentId}`
    );

    // Convert blob to array buffer for response
    const arrayBuffer = await fileData.arrayBuffer();

    // Return file with appropriate headers
    return new Response(arrayBuffer, {
      headers: {
        "Content-Type": attachmentData.content_type,
        "Content-Disposition": `attachment; filename="${attachmentData.original_filename}"`,
        "Content-Length": attachmentData.file_size.toString(),
        "Cache-Control": "private, no-cache",
      },
    });
  } catch (error) {
    console.error("[API /api/downloadAttachment] Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("--- [API /api/downloadAttachment] POST - Get signed URL ---");

    // Check authentication
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User must be authenticated" },
        { status: 401 }
      );
    }

    const userId = user.id;
    const body = await request.json();
    const { attachmentId, expiresIn = 3600 } = body; // Default 1 hour

    if (!attachmentId) {
      return NextResponse.json(
        { success: false, error: "Attachment ID is required" },
        { status: 400 }
      );
    }

    if (!supabaseServiceClient) {
      return NextResponse.json(
        { success: false, error: "Database service not available" },
        { status: 500 }
      );
    }

    // Verify ownership (same as GET)
    const { data: attachmentData, error: attachmentError } =
      await supabaseServiceClient
        .from("attachments")
        .select(
          `
        id,
        storage_path,
        original_filename,
        emails!inner(
          inboxes!inner(user_id, is_active, expires_at)
        )
      `
        )
        .eq("id", attachmentId)
        .single();

    if (attachmentError || !attachmentData) {
      return NextResponse.json(
        { success: false, error: "Attachment not found" },
        { status: 404 }
      );
    }

    const inbox = (
      attachmentData as {
        emails: {
          inboxes: {
            user_id: string;
            is_active: boolean;
            expires_at: string;
          }[];
        }[];
      }
    ).emails[0].inboxes[0];
    if (inbox.user_id !== userId) {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    if (!inbox.is_active || new Date(inbox.expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, error: "Cannot download from expired inbox" },
        { status: 400 }
      );
    }

    // Generate signed URL
    const { data: signedUrlData, error: signedUrlError } =
      await supabaseServiceClient.storage
        .from("email-attachments")
        .createSignedUrl(attachmentData.storage_path, expiresIn, {
          download: attachmentData.original_filename,
        });

    if (signedUrlError || !signedUrlData) {
      console.error(
        "[API /api/downloadAttachment] Signed URL error:",
        signedUrlError
      );
      return NextResponse.json(
        { success: false, error: "Failed to generate download URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      download_url: signedUrlData.signedUrl,
      expires_at: new Date(Date.now() + expiresIn * 1000).toISOString(),
    });
  } catch (error) {
    console.error("[API /api/downloadAttachment] POST error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
