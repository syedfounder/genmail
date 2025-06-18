"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { RealtimeChannel } from "@supabase/supabase-js";

// Attachment restrictions (PRD Section 4: Core Features)
const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024; // 10 MB in bytes
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

const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".txt",
  ".csv",
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".svg",
  ".zip",
  ".rar",
  ".7z",
];

// Utility functions for attachments
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getFileIcon = (contentType: string, filename: string): string => {
  // Image files
  if (contentType.startsWith("image/")) return "🖼️";

  // Document types
  if (contentType === "application/pdf") return "📄";
  if (
    contentType.includes("word") ||
    filename.endsWith(".doc") ||
    filename.endsWith(".docx")
  )
    return "📝";
  if (
    contentType.includes("excel") ||
    filename.endsWith(".xls") ||
    filename.endsWith(".xlsx")
  )
    return "📊";
  if (
    contentType.includes("powerpoint") ||
    filename.endsWith(".ppt") ||
    filename.endsWith(".pptx")
  )
    return "📋";
  if (contentType === "text/plain" || filename.endsWith(".txt")) return "📃";
  if (contentType === "text/csv" || filename.endsWith(".csv")) return "📈";

  // Archive types
  if (
    contentType.includes("zip") ||
    contentType.includes("rar") ||
    contentType.includes("7z")
  )
    return "🗜️";

  // Default
  return "📎";
};

const isAttachmentAllowed = (
  contentType: string,
  filename: string,
  fileSize: number
): { allowed: boolean; reason?: string } => {
  // Check file size
  if (fileSize > MAX_ATTACHMENT_SIZE) {
    return {
      allowed: false,
      reason: `File size exceeds ${formatFileSize(MAX_ATTACHMENT_SIZE)} limit`,
    };
  }

  // Check content type
  if (!ALLOWED_FILE_TYPES.includes(contentType)) {
    // Check by file extension as fallback
    const extension = filename
      .toLowerCase()
      .substring(filename.lastIndexOf("."));
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return { allowed: false, reason: "File type not allowed" };
    }
  }

  return { allowed: true };
};

// Type definitions
interface Attachment {
  id: string;
  email_id: string;
  filename: string;
  content_type: string;
  file_size: number;
  download_url: string;
  created_at: string;
}

interface Email {
  id: string;
  inbox_id: string;
  from_address: string;
  subject: string;
  body: string;
  received_at: string;
  created_at: string;
  attachments?: Attachment[];
}

interface InboxViewerProps {
  inboxId: string;
  emailAddress: string;
  expiresAt: Date;
}

export default function InboxViewer({
  inboxId,
  emailAddress,
  expiresAt,
}: InboxViewerProps) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!inboxId) return;

    // Initialize and fetch existing emails
    const initializeInbox = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch existing emails for this inbox with attachments
        const { data: existingEmails, error: fetchError } = await supabase
          .from("emails")
          .select(
            `
            *,
            attachments (
              id,
              filename,
              content_type,
              file_size,
              download_url,
              created_at
            )
          `
          )
          .eq("inbox_id", inboxId)
          .order("received_at", { ascending: false });

        if (fetchError) {
          console.error("Error fetching emails:", fetchError);
          setError("Failed to load emails");
        } else {
          setEmails(existingEmails || []);
        }
      } catch (err) {
        console.error("Error initializing inbox:", err);
        setError("Failed to initialize inbox");
      } finally {
        setIsLoading(false);
      }
    };

    // Subscribe to realtime updates
    const subscribeToEmails = () => {
      const realtimeChannel = supabase
        .channel(`inboxes:${inboxId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "emails",
            filter: `inbox_id=eq.${inboxId}`,
          },
          (payload) => {
            console.log("New email received:", payload);
            const newEmail = payload.new as Email;
            setEmails((prevEmails) => [newEmail, ...prevEmails]);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "emails",
            filter: `inbox_id=eq.${inboxId}`,
          },
          (payload) => {
            console.log("Email updated:", payload);
            const updatedEmail = payload.new as Email;
            setEmails((prevEmails) =>
              prevEmails.map((email) =>
                email.id === updatedEmail.id ? updatedEmail : email
              )
            );
          }
        )
        .subscribe((status) => {
          console.log("Realtime subscription status:", status);
          if (status === "SUBSCRIBED") {
            console.log(`Successfully subscribed to inboxes:${inboxId}`);
          } else if (status === "CHANNEL_ERROR") {
            setError("Failed to connect to realtime updates");
          }
        });

      setChannel(realtimeChannel);
    };

    initializeInbox();
    subscribeToEmails();

    // Cleanup function
    return () => {
      if (channel) {
        console.log(`Unsubscribing from inboxes:${inboxId}`);
        supabase.removeChannel(channel);
      }
    };
  }, [inboxId]);

  // Calculate time remaining
  const getTimeRemaining = () => {
    const now = new Date().getTime();
    const expiry = expiresAt.getTime();
    const remaining = Math.max(0, expiry - now);
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return { minutes, seconds, expired: remaining <= 0 };
  };

  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining());

  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(getTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-red-700 dark:text-red-300">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Inbox Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Your Inbox</h2>
            <div className="flex items-center gap-2">
              <code className="bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded text-blue-600 dark:text-blue-400 font-mono text-sm">
                {emailAddress}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(emailAddress)}
                className="text-gray-500 hover:text-blue-500 transition-colors"
                title="Copy email address"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="text-center">
            {timeRemaining.expired ? (
              <div className="text-red-500 font-semibold">
                <span className="block text-sm">EXPIRED</span>
                <span className="text-lg">Inbox Destroyed</span>
              </div>
            ) : (
              <div className="text-gray-600 dark:text-gray-300">
                <span className="block text-sm">Expires in:</span>
                <span className="text-lg font-mono">
                  {timeRemaining.minutes}:
                  {timeRemaining.seconds.toString().padStart(2, "0")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Email List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Emails ({emails.length})</h3>
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-500">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Loading...
            </div>
          )}
        </div>

        {emails.length === 0 && !isLoading ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <svg
              className="w-12 h-12 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <h4 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
              No emails yet
            </h4>
            <p className="text-gray-500 dark:text-gray-400">
              Emails sent to {emailAddress} will appear here automatically
            </p>
          </div>
        ) : (
          emails.map((email) => (
            <div
              key={email.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-gray-600 dark:text-gray-300">
                      From:
                    </span>
                    <span className="font-mono text-sm">
                      {email.from_address}
                    </span>
                  </div>
                  <h4 className="font-semibold text-lg mb-2">
                    {email.subject || "(No Subject)"}
                  </h4>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(email.received_at).toLocaleString()}
                </span>
              </div>

              <div className="prose prose-sm dark:prose-invert max-w-none mb-4">
                <div
                  className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: email.body || "(Empty message)",
                  }}
                />
              </div>

              {/* Attachments Section */}
              {email.attachments && email.attachments.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                  <h5 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                    Attachments ({email.attachments.length})
                  </h5>

                  <div className="grid gap-2">
                    {email.attachments.map((attachment) => {
                      const validation = isAttachmentAllowed(
                        attachment.content_type,
                        attachment.filename,
                        attachment.file_size
                      );

                      return (
                        <div
                          key={attachment.id}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                            validation.allowed
                              ? "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span
                              className="text-lg"
                              role="img"
                              aria-label="File type"
                            >
                              {getFileIcon(
                                attachment.content_type,
                                attachment.filename
                              )}
                            </span>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm truncate">
                                  {attachment.filename}
                                </span>
                                {!validation.allowed && (
                                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                                    Blocked
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                <span>
                                  {formatFileSize(attachment.file_size)}
                                </span>
                                <span>{attachment.content_type}</span>
                                {!validation.allowed && validation.reason && (
                                  <span className="text-red-500 dark:text-red-400">
                                    {validation.reason}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {validation.allowed ? (
                            <a
                              href={attachment.download_url}
                              download={attachment.filename}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              Download
                            </a>
                          ) : (
                            <div className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md cursor-not-allowed">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                                />
                              </svg>
                              Blocked
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Attachment Policy Notice */}
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <svg
                        className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div className="text-xs text-blue-700 dark:text-blue-300">
                        <span className="font-medium">Attachment Policy:</span>{" "}
                        Max {formatFileSize(MAX_ATTACHMENT_SIZE)} per file.
                        Allowed types: PDF, Office docs, images (JPG, PNG, GIF,
                        WebP, SVG), text files, and common archives.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
