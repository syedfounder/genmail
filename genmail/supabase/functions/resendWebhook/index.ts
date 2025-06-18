import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Type definitions for Resend webhook payload
interface ResendWebhookPayload {
  type: string;
  created_at: string;
  data: {
    id: string;
    to: string[];
    from: string;
    subject: string;
    html?: string;
    text?: string;
    reply_to?: string;
    cc?: string[];
    bcc?: string[];
    headers?: Record<string, string>;
    attachments?: Array<{
      filename: string;
      content: string; // base64 encoded
      content_type: string;
      size: number;
    }>;
    // Spam detection fields from Resend
    spam_score?: number;
    dkim_valid?: boolean;
    spf_valid?: boolean;
    dmarc_valid?: boolean;
  };
}

// Attachment restrictions (matching InboxViewer)
const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
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

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Calculate spam score based on SPF/DKIM/DMARC validation
function calculateSpamScore(data: ResendWebhookPayload["data"]): {
  score: number;
  is_spam: boolean;
} {
  let spamScore = data.spam_score || 0;

  // Increase spam score for failed authentication
  if (data.dkim_valid === false) spamScore += 2.0;
  if (data.spf_valid === false) spamScore += 1.5;
  if (data.dmarc_valid === false) spamScore += 2.5;

  // Additional heuristics
  const subject = data.subject?.toLowerCase() || "";
  const text = data.text?.toLowerCase() || "";

  // Common spam indicators
  const spamKeywords = [
    "viagra",
    "casino",
    "lottery",
    "winner",
    "free money",
    "click here",
    "act now",
  ];
  const keywordMatches = spamKeywords.filter(
    (keyword) => subject.includes(keyword) || text.includes(keyword)
  ).length;

  spamScore += keywordMatches * 0.5;

  // Excessive caps in subject
  if (subject.length > 0) {
    const capsRatio = (subject.match(/[A-Z]/g) || []).length / subject.length;
    if (capsRatio > 0.7) spamScore += 1.0;
  }

  // Determine if spam (threshold: 5.0)
  const isSpam = spamScore >= 5.0;

  return { score: Math.min(spamScore, 10.0), is_spam: isSpam };
}

// Validate attachment
function validateAttachment(
  attachment: ResendWebhookPayload["data"]["attachments"][0]
): { allowed: boolean; reason?: string } {
  // Check file size
  if (attachment.size > MAX_ATTACHMENT_SIZE) {
    return { allowed: false, reason: `File size exceeds 10MB limit` };
  }

  // Check content type
  if (!ALLOWED_FILE_TYPES.includes(attachment.content_type)) {
    return { allowed: false, reason: "File type not allowed" };
  }

  // Check filename for suspicious extensions
  const filename = attachment.filename.toLowerCase();
  const dangerousExtensions = [
    ".exe",
    ".bat",
    ".cmd",
    ".scr",
    ".com",
    ".pif",
    ".vbs",
    ".js",
  ];
  if (dangerousExtensions.some((ext) => filename.endsWith(ext))) {
    return { allowed: false, reason: "Potentially dangerous file type" };
  }

  return { allowed: true };
}

// Generate file hash for deduplication
async function generateFileHash(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Upload attachment to Supabase Storage
async function uploadAttachment(
  attachment: ResendWebhookPayload["data"]["attachments"][0],
  emailId: string
): Promise<{ storage_path: string; download_url: string } | null> {
  try {
    // Decode base64 content
    const fileContent = Uint8Array.from(atob(attachment.content), (c) =>
      c.charCodeAt(0)
    );

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `${emailId}/${timestamp}_${attachment.filename}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("attachments")
      .upload(fileName, fileContent, {
        contentType: attachment.content_type,
        upsert: false,
      });

    if (error) {
      console.error("Storage upload error:", error);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("attachments")
      .getPublicUrl(fileName);

    return {
      storage_path: fileName,
      download_url: urlData.publicUrl,
    };
  } catch (error) {
    console.error("Attachment upload error:", error);
    return null;
  }
}

serve(async (req) => {
  try {
    // Verify request method
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify webhook signature (in production, verify Resend webhook signature)
    const signature = req.headers.get("resend-signature");
    if (!signature) {
      console.warn("Missing webhook signature");
      // In production, you should verify the signature
      // return new Response('Unauthorized', { status: 401 });
    }

    // Parse webhook payload
    const payload: ResendWebhookPayload = await req.json();

    // Log the event type for debugging
    console.log(`Received webhook event: ${payload.type}`);

    // Process inbound email events (update based on actual Resend event types)
    const inboundEventTypes = [
      "email.received",
      "email.delivered",
      "inbound.email",
    ];
    if (!inboundEventTypes.includes(payload.type)) {
      console.log(`Event type ${payload.type} not processed`);
      return new Response(
        JSON.stringify({
          message: "Event type not processed",
          event_type: payload.type,
          processed_types: inboundEventTypes,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const emailData = payload.data;
    const toAddress = emailData.to[0]; // Get first recipient

    // Find the inbox for this email address
    const { data: inbox, error: inboxError } = await supabase
      .from("inboxes")
      .select("id, expires_at, is_active, current_email_count, max_emails")
      .eq("email_address", toAddress)
      .eq("is_active", true)
      .gte("expires_at", new Date().toISOString())
      .single();

    if (inboxError || !inbox) {
      console.log(`No active inbox found for ${toAddress}`);
      return new Response(
        JSON.stringify({
          message: "Inbox not found or expired",
          email: toAddress,
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Check if inbox has reached email limit
    if (inbox.current_email_count >= inbox.max_emails) {
      console.log(`Inbox ${toAddress} has reached email limit`);
      return new Response(
        JSON.stringify({
          message: "Inbox email limit reached",
          limit: inbox.max_emails,
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Calculate spam score
    const spamAnalysis = calculateSpamScore(emailData);

    // Insert email into database
    const { data: insertedEmail, error: emailError } = await supabase
      .from("emails")
      .insert({
        inbox_id: inbox.id,
        from_address: emailData.from,
        to_address: toAddress,
        subject: emailData.subject || "",
        body: emailData.text || "",
        html_body: emailData.html || "",
        headers: emailData.headers || {},
        message_id: emailData.id,
        reply_to: emailData.reply_to,
        cc_addresses: emailData.cc || [],
        bcc_addresses: emailData.bcc || [],
        spam_score: spamAnalysis.score,
        is_spam: spamAnalysis.is_spam,
        attachment_count: emailData.attachments?.length || 0,
        received_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (emailError) {
      console.error("Email insert error:", emailError);
      return new Response(JSON.stringify({ error: "Failed to save email" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const emailId = insertedEmail.id;
    let totalAttachmentSize = 0;
    let attachmentResults = [];

    // Process attachments if any
    if (emailData.attachments && emailData.attachments.length > 0) {
      for (const attachment of emailData.attachments) {
        const validation = validateAttachment(attachment);

        if (validation.allowed) {
          // Upload to storage
          const uploadResult = await uploadAttachment(attachment, emailId);

          if (uploadResult) {
            // Generate file hash
            const fileHash = await generateFileHash(attachment.content);

            // Insert attachment record
            const { error: attachmentError } = await supabase
              .from("attachments")
              .insert({
                email_id: emailId,
                filename: attachment.filename,
                original_filename: attachment.filename,
                content_type: attachment.content_type,
                file_size: attachment.size,
                file_hash: fileHash,
                storage_path: uploadResult.storage_path,
                download_url: uploadResult.download_url,
                is_allowed: true,
              });

            if (!attachmentError) {
              totalAttachmentSize += attachment.size;
              attachmentResults.push({
                filename: attachment.filename,
                status: "uploaded",
                size: attachment.size,
              });
            } else {
              console.error("Attachment insert error:", attachmentError);
              attachmentResults.push({
                filename: attachment.filename,
                status: "failed",
                error: "Database insert failed",
              });
            }
          } else {
            attachmentResults.push({
              filename: attachment.filename,
              status: "failed",
              error: "Upload failed",
            });
          }
        } else {
          // Insert blocked attachment record
          await supabase.from("attachments").insert({
            email_id: emailId,
            filename: attachment.filename,
            original_filename: attachment.filename,
            content_type: attachment.content_type,
            file_size: attachment.size,
            file_hash: await generateFileHash(attachment.content),
            storage_path: "",
            download_url: "",
            is_allowed: false,
            blocked_reason: validation.reason,
          });

          attachmentResults.push({
            filename: attachment.filename,
            status: "blocked",
            reason: validation.reason,
          });
        }
      }
    }

    // Update email with total attachment size
    if (totalAttachmentSize > 0) {
      await supabase
        .from("emails")
        .update({ total_size_bytes: totalAttachmentSize })
        .eq("id", emailId);
    }

    // Log successful processing
    console.log(
      `Email processed: ${emailId} for inbox ${toAddress}, spam_score: ${spamAnalysis.score}`
    );

    // Return success response
    return new Response(
      JSON.stringify({
        message: "Email processed successfully",
        email_id: emailId,
        inbox_id: inbox.id,
        spam_score: spamAnalysis.score,
        is_spam: spamAnalysis.is_spam,
        attachments: attachmentResults,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
