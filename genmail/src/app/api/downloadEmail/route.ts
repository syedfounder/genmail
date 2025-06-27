import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

// Force dynamic rendering to prevent static generation errors
export const dynamic = "force-dynamic";

// Sanitize filename to prevent path traversal and other attacks
function sanitizeFilename(subject: string, format: "eml" | "txt"): string {
  // Replace potentially problematic characters with an underscore
  const safeSubject = subject.replace(/[^a-z0-9_.-]/gi, "_").substring(0, 50);
  return `${safeSubject || "email"}.${format}`;
}

// Construct a valid .eml file content from email data
function constructEml(email: any): string {
  let emlContent = "";

  // Add standard headers
  emlContent += `From: ${email.from_address}\r\n`;
  emlContent += `To: ${email.to_address}\r\n`;
  emlContent += `Subject: ${email.subject}\r\n`;
  emlContent += `Date: ${new Date(email.received_at).toUTCString()}\r\n`;
  emlContent += `Message-ID: <${
    email.message_id || `${email.id}@genmail.app`
  }>\r\n`;
  emlContent += "MIME-Version: 1.0\r\n";
  emlContent += 'Content-Type: text/plain; charset="UTF-8"\r\n';
  emlContent += "Content-Transfer-Encoding: 7bit\r\n\r\n";

  // Add the plain text body
  emlContent += email.body || "This email has no plain text content.";

  return emlContent;
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Rate limit check based on userId
    const { data: isLimited, error: rateLimitError } = await supabase.rpc(
      "is_rate_limited",
      {
        p_event_type: "download_email_attempt",
        p_key: userId,
        p_limit_count: 60, // 60 downloads
        p_time_window: "1 hour",
      }
    );

    if (rateLimitError) {
      console.error("Rate limiting check failed:", rateLimitError);
    }

    if (isLimited) {
      console.warn(`Rate limit for downloadEmail exceeded for user: ${userId}`);
      return new NextResponse(
        JSON.stringify({
          error: "Too many requests. Please try again later.",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    const { searchParams } = new URL(request.url);
    const emailId = searchParams.get("emailId");
    const format = searchParams.get("format"); // 'eml' or 'txt'

    if (!emailId || !format) {
      return new NextResponse("Missing emailId or format", { status: 400 });
    }

    if (format !== "eml" && format !== "txt") {
      return new NextResponse("Invalid format specified", { status: 400 });
    }

    const { data: email, error } = await supabase
      .from("emails")
      .select(
        `
        *,
        inbox:inboxes ( user_id )
      `
      )
      .eq("id", emailId)
      .single();

    if (error || !email) {
      console.error("Error fetching email or email not found:", error);
      return new NextResponse("Email not found", { status: 404 });
    }

    // Security Check: Ensure the user owns the inbox this email belongs to
    if (email.inbox?.user_id !== userId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    let content = "";
    let contentType = "";
    let filename = "";

    const subject = email.subject || "no-subject";
    const sanitizedSubject = subject.replace(/[^a-z0-9]/gi, "_").toLowerCase();

    if (format === "txt") {
      contentType = "text/plain";
      filename = `${sanitizedSubject}.txt`;
      content = `From: ${
        email.from_address
      }\nSubject: ${subject}\nDate: ${new Date(
        email.received_at
      ).toUTCString()}\n\n${email.body}`;
    } else {
      // format === 'eml'
      contentType = "message/rfc822";
      filename = `${sanitizedSubject}.eml`;
      // The 'raw_content' column should contain the full EML source
      content =
        email.raw_content ||
        `From: ${email.from_address}\nTo: ${
          email.to_address
        }\nSubject: ${subject}\nDate: ${new Date(
          email.received_at
        ).toUTCString()}\n\n${email.body}`;
    }

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Content-Disposition", `attachment; filename="${filename}"`);

    return new NextResponse(content, { status: 200, headers });
  } catch (error) {
    console.error("[API /downloadEmail] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
