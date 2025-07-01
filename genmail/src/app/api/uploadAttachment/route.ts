import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseServiceClient } from "@/lib/supabaseClient";

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
  // Images
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  // Archives
  "application/zip",
  "application/x-rar-compressed",
  "application/x-7z-compressed",
];

export async function POST(request: NextRequest) {
  try {
    console.log("--- [API /api/uploadAttachment] Received request ---");

    // Check authentication
    const user = await currentUser();
    if (!user) {
      console.log("[API /api/uploadAttachment] User not authenticated");
      return NextResponse.json(
        { success: false, error: "User must be authenticated" },
        { status: 401 }
      );
    }

    const userId = user.id;
    console.log(`[API /api/uploadAttachment] Authenticated user ID: ${userId}`);

    if (!supabaseServiceClient) {
      console.error(
        "[API /api/uploadAttachment] Supabase service client not configured"
      );
      return NextResponse.json(
        { success: false, error: "Database service not available" },
        { status: 500 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const emailId = formData.get("emailId") as string;

    if (!file || !emailId) {
      return NextResponse.json(
        { success: false, error: "File and emailId are required" },
        { status: 400 }
      );
    }

    // Validate file
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "File type not allowed" },
        { status: 400 }
      );
    }

    // Verify user owns the email/inbox
    const { data: emailData, error: emailError } = await supabaseServiceClient
      .from("emails")
      .select(
        `
        id,
        inbox_id,
        inboxes!inner(user_id, is_active, expires_at)
      `
      )
      .eq("id", emailId)
      .single();

    if (emailError || !emailData) {
      console.error("[API /api/uploadAttachment] Email not found:", emailError);
      return NextResponse.json(
        { success: false, error: "Email not found" },
        { status: 404 }
      );
    }

    const inbox = (
      emailData as {
        inboxes: { user_id: string; is_active: boolean; expires_at: string }[];
      }
    ).inboxes[0];
    if (inbox.user_id !== userId) {
      console.log(
        `[API /api/uploadAttachment] Access denied. User ${userId} does not own email ${emailId}`
      );
      return NextResponse.json(
        { success: false, error: "Access denied. You do not own this email" },
        { status: 403 }
      );
    }

    if (!inbox.is_active || new Date(inbox.expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, error: "Cannot upload to expired or inactive inbox" },
        { status: 400 }
      );
    }

    // Generate unique storage path
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const storagePath = `${userId}/${emailData.inbox_id}/${emailId}/${timestamp}_${sanitizedFilename}`;

    // Upload file to Supabase storage
    const fileBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabaseServiceClient.storage
      .from("email-attachments")
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
      });

    if (uploadError) {
      console.error(
        "[API /api/uploadAttachment] Storage upload error:",
        uploadError
      );
      return NextResponse.json(
        { success: false, error: "Failed to upload file to storage" },
        { status: 500 }
      );
    }

    // Create SHA-256 hash for deduplication
    const hashBuffer = await crypto.subtle.digest("SHA-256", fileBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const fileHash = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Save attachment metadata to database
    const { data: attachmentData, error: attachmentError } =
      await supabaseServiceClient
        .from("attachments")
        .insert({
          email_id: emailId,
          filename: sanitizedFilename,
          original_filename: file.name,
          content_type: file.type,
          file_size: file.size,
          file_hash: fileHash,
          storage_path: storagePath,
          is_allowed: true,
        })
        .select()
        .single();

    if (attachmentError) {
      console.error(
        "[API /api/uploadAttachment] Database insert error:",
        attachmentError
      );

      // Clean up uploaded file if database insert fails
      await supabaseServiceClient.storage
        .from("email-attachments")
        .remove([storagePath]);

      return NextResponse.json(
        { success: false, error: "Failed to save attachment metadata" },
        { status: 500 }
      );
    }

    console.log(
      `[API /api/uploadAttachment] Successfully uploaded attachment ${attachmentData.id}`
    );

    return NextResponse.json({
      success: true,
      attachment: {
        id: attachmentData.id,
        filename: attachmentData.filename,
        original_filename: attachmentData.original_filename,
        content_type: attachmentData.content_type,
        file_size: attachmentData.file_size,
        created_at: attachmentData.created_at,
      },
    });
  } catch (error) {
    console.error("[API /api/uploadAttachment] Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
