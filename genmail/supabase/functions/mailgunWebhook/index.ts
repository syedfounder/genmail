// @ts-ignore
// deno-lint-ignore-file
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Mailgun webhook payload interface (comes as FormData, not JSON)
interface MailgunWebhookData {
  recipient: string;
  sender: string;
  subject: string;
  "body-plain": string;
  "body-html": string;
  "stripped-text": string;
  "stripped-html": string;
  "attachment-count": string;
  timestamp: string;
  token: string;
  signature: string;
  "message-headers": string; // JSON string of headers
  // Attachments come as separate form fields: attachment-1, attachment-2, etc.
}

// Attachment restrictions (PRD Section 4)
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

// Verify Mailgun webhook signature
async function verifyMailgunSignature(
  timestamp: string,
  token: string,
  signature: string
): Promise<boolean> {
  const signingKey = Deno.env.get("MAILGUN_WEBHOOK_SIGNING_KEY");

  if (!signingKey) {
    console.warn("MAILGUN_WEBHOOK_SIGNING_KEY not set, rejecting request");
    return false; // Reject if no signing key in production
  }

  try {
    // Mailgun signature verification: HMAC-SHA256(timestamp + token, signing_key)
    const encoder = new TextEncoder();
    const message = encoder.encode(timestamp + token);
    const key = encoder.encode(signingKey);

    // Import the key for HMAC
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      key,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    // Generate the signature
    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      cryptoKey,
      message
    );
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Compare with provided signature (case-insensitive)
    return expectedSignature.toLowerCase() === signature.toLowerCase();
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

// Calculate spam score based on email content and headers
function calculateSpamScore(data: MailgunWebhookData): {
  score: number;
  is_spam: boolean;
} {
  let spamScore = 0;

  const subject = data.subject?.toLowerCase() || "";
  const bodyText = data["body-plain"]?.toLowerCase() || "";
  const sender = data.sender?.toLowerCase() || "";

  // Parse headers for spam indicators
  let headers: Record<string, string> = {};
  try {
    headers = JSON.parse(data["message-headers"] || "[]").reduce(
      (acc: any, [key, value]: [string, string]) => {
        acc[key.toLowerCase()] = value;
        return acc;
      },
      {}
    );
  } catch (e) {
    console.warn("Failed to parse message headers:", e);
  }

  // Check SPF, DKIM, DMARC from headers
  const spfResult = headers["received-spf"] || "";
  const dkimResult = headers["dkim-signature"] || "";

  if (spfResult.includes("fail")) spamScore += 2.0;
  if (spfResult.includes("softfail")) spamScore += 1.0;
  if (!dkimResult) spamScore += 1.5; // No DKIM signature

  // Content-based spam detection
  const spamKeywords = [
    "viagra",
    "casino",
    "lottery",
    "winner",
    "free money",
    "click here",
    "act now",
    "limited time",
    "make money fast",
    "no obligation",
    "risk free",
    "guarantee",
    "urgent",
    "congratulations",
  ];

  const keywordMatches = spamKeywords.filter(
    (keyword) => subject.includes(keyword) || bodyText.includes(keyword)
  ).length;
  spamScore += keywordMatches * 0.5;

  // Suspicious sender patterns
  if (sender.includes("noreply")) spamScore += 0.5;
  if (sender.match(/\d{5,}/)) spamScore += 1.0; // Many numbers in sender

  // Excessive caps in subject
  if (subject.length > 0) {
    const capsRatio = (subject.match(/[A-Z]/g) || []).length / subject.length;
    if (capsRatio > 0.7) spamScore += 1.5;
  }

  // Excessive exclamation marks
  const exclamationCount = (subject.match(/!/g) || []).length;
  spamScore += Math.min(exclamationCount * 0.3, 2.0);

  // Short subject with promotional words
  if (
    subject.length < 10 &&
    spamKeywords.some((word) => subject.includes(word))
  ) {
    spamScore += 1.0;
  }

  // Determine if spam (threshold: 4.0 for Mailgun, as it has some built-in filtering)
  const isSpam = spamScore >= 4.0;

  return { score: Math.min(spamScore, 10.0), is_spam: isSpam };
}

// Validate attachment
function validateAttachment(file: File): { allowed: boolean; reason?: string } {
  // Check file size
  if (file.size > MAX_ATTACHMENT_SIZE) {
    return { allowed: false, reason: `File size exceeds 10MB limit` };
  }

  // Check content type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { allowed: false, reason: "File type not allowed" };
  }

  // Check filename for suspicious extensions
  const filename = file.name.toLowerCase();
  const dangerousExtensions = [
    ".exe",
    ".bat",
    ".cmd",
    ".scr",
    ".com",
    ".pif",
    ".vbs",
    ".js",
    ".jar",
  ];
  if (dangerousExtensions.some((ext) => filename.endsWith(ext))) {
    return { allowed: false, reason: "Potentially dangerous file type" };
  }

  return { allowed: true };
}

// Generate file hash for deduplication
async function generateFileHash(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Upload attachment to Supabase Storage
async function uploadAttachment(
  file: File,
  userId: string,
  inboxId: string,
  emailId: string
): Promise<{ storage_path: string } | null> {
  try {
    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const storagePath = `${userId}/${inboxId}/${emailId}/${timestamp}_${sanitizedName}`;

    // Convert file to array buffer
    const fileContent = await file.arrayBuffer();

    // Upload to the correct email-attachments bucket
    const { data, error } = await supabase.storage
      .from("email-attachments")
      .upload(storagePath, fileContent, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Storage upload error:", error);
      return null;
    }

    return {
      storage_path: storagePath,
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

    // Parse form data from Mailgun webhook
    const formData = await req.formData();

    // Extract webhook data
    const webhookData: Partial<MailgunWebhookData> = {};
    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") {
        webhookData[key as keyof MailgunWebhookData] = value;
      }
    }

    // Verify required fields
    if (
      !webhookData.recipient ||
      !webhookData.sender ||
      !webhookData.timestamp ||
      !webhookData.token ||
      !webhookData.signature
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required webhook fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Verify webhook signature
    const signatureValid = await verifyMailgunSignature(
      webhookData.timestamp!,
      webhookData.token!,
      webhookData.signature!
    );

    if (!signatureValid) {
      console.error("Mailgun signature verification failed");
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const toAddress = webhookData.recipient!;
    console.log(`Processing email for: ${toAddress}`);

    // Find the inbox for this email address
    const { data: inbox, error: inboxError } = await supabase
      .from("inboxes")
      .select(
        "id, user_id, expires_at, is_active, current_email_count, max_emails"
      )
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
    const spamAnalysis = calculateSpamScore(webhookData as MailgunWebhookData);

    // Parse headers
    let headers: Record<string, string> = {};
    try {
      headers = JSON.parse(webhookData["message-headers"] || "[]").reduce(
        (acc: any, [key, value]: [string, string]) => {
          acc[key] = value;
          return acc;
        },
        {}
      );
    } catch (e) {
      console.warn("Failed to parse headers:", e);
    }

    // Insert email into database
    const { data: insertedEmail, error: emailError } = await supabase
      .from("emails")
      .insert({
        inbox_id: inbox.id,
        from_address: webhookData.sender!,
        to_address: toAddress,
        subject: webhookData.subject || "",
        body: webhookData["stripped-text"] || webhookData["body-plain"] || "",
        html_body:
          webhookData["stripped-html"] || webhookData["body-html"] || "",
        headers: headers,
        message_id: headers["message-id"] || `mailgun-${Date.now()}`,
        reply_to: headers["reply-to"],
        spam_score: spamAnalysis.score,
        is_spam: spamAnalysis.is_spam,
        attachment_count: parseInt(webhookData["attachment-count"] || "0"),
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

    // Process attachments (Mailgun sends them as attachment-1, attachment-2, etc.)
    const attachmentCount = parseInt(webhookData["attachment-count"] || "0");
    for (let i = 1; i <= attachmentCount; i++) {
      const attachmentFile = formData.get(`attachment-${i}`) as File;
      if (attachmentFile && attachmentFile.size > 0) {
        const validation = validateAttachment(attachmentFile);

        if (validation.allowed) {
          // Upload to storage (use 'anonymous' if user_id is null for legacy inboxes)
          const uploadResult = await uploadAttachment(
            attachmentFile,
            inbox.user_id || "anonymous",
            inbox.id,
            emailId
          );

          if (uploadResult) {
            // Generate file hash
            const fileHash = await generateFileHash(attachmentFile);

            // Insert attachment record
            const { error: attachmentError } = await supabase
              .from("attachments")
              .insert({
                email_id: emailId,
                filename: attachmentFile.name,
                original_filename: attachmentFile.name,
                content_type: attachmentFile.type,
                file_size: attachmentFile.size,
                file_hash: fileHash,
                storage_path: uploadResult.storage_path,
                is_allowed: true,
              });

            if (!attachmentError) {
              totalAttachmentSize += attachmentFile.size;
              attachmentResults.push({
                filename: attachmentFile.name,
                status: "uploaded",
                size: attachmentFile.size,
              });
            } else {
              console.error("Attachment insert error:", attachmentError);
              attachmentResults.push({
                filename: attachmentFile.name,
                status: "failed",
                error: "Database insert failed",
              });
            }
          } else {
            attachmentResults.push({
              filename: attachmentFile.name,
              status: "failed",
              error: "Upload failed",
            });
          }
        } else {
          // Insert blocked attachment record
          const fileHash = await generateFileHash(attachmentFile);
          await supabase.from("attachments").insert({
            email_id: emailId,
            filename: attachmentFile.name,
            original_filename: attachmentFile.name,
            content_type: attachmentFile.type,
            file_size: attachmentFile.size,
            file_hash: fileHash,
            storage_path: "",
            is_allowed: false,
            blocked_reason: validation.reason,
          });

          attachmentResults.push({
            filename: attachmentFile.name,
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

    // Return success response (Mailgun expects 200 OK)
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
    console.error("Mailgun webhook processing error:", error);
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
