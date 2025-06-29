"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase-simple";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";

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
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Mobile-specific state
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isMobileEmailView, setIsMobileEmailView] = useState(false);

  // Calculate time remaining
  const getTimeRemaining = useCallback(() => {
    const now = new Date().getTime();
    const expiry = expiresAt.getTime();
    const remaining = Math.max(0, expiry - now);
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return { minutes, seconds, expired: remaining <= 0 };
  }, [expiresAt]);

  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining);

  // Manual refresh function for when realtime is disabled
  const refreshEmails = async () => {
    setIsLoading(true);
    try {
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
      console.error("Error refreshing emails:", err);
      setError("Failed to refresh emails");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!inboxId) return;

    let isMounted = true;

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
          if (isMounted) setError("Failed to load emails");
        } else {
          if (isMounted) setEmails(existingEmails || []);
        }
      } catch (err) {
        console.error("Error initializing inbox:", err);
        if (isMounted) setError("Failed to initialize inbox");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    // Subscribe to realtime updates
    const subscribeToEmails = () => {
      // Temporarily disable realtime to avoid WebSocket errors
      console.log("Realtime temporarily disabled - use refresh button instead");

      // TODO: Re-enable once WebSocket connection is fixed
      /*
      // Clean up existing subscription if any
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

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
            if (isMounted) {
              setEmails((prevEmails) => [newEmail, ...prevEmails]);
            }
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
            if (isMounted) {
              setEmails((prevEmails) =>
                prevEmails.map((email) =>
                  email.id === updatedEmail.id ? updatedEmail : email
                )
              );
            }
          }
        )
        .subscribe((status) => {
          console.log("Realtime subscription status:", status);
          if (status === "SUBSCRIBED") {
            console.log(`Successfully subscribed to inboxes:${inboxId}`);
          } else if (status === "CHANNEL_ERROR") {
            if (isMounted) setError("Failed to connect to realtime updates");
          }
        });

      channelRef.current = realtimeChannel;
      */
    };

    initializeInbox();
    subscribeToEmails();

    // Countdown timer
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining());
      if (new Date() >= expiresAt) {
        clearInterval(interval);
      }
    }, 1000);

    // Cleanup function
    return () => {
      isMounted = false;
      if (channelRef.current) {
        console.log(`Unsubscribing from inboxes:${inboxId}`);
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      clearInterval(interval);
    };
  }, [inboxId, expiresAt, getTimeRemaining]);

  const handleManualRefresh = () => {
    refreshEmails();
  };

  // Mobile email selection handler
  const handleMobileEmailSelect = (email: Email) => {
    setSelectedEmail(email);
    setIsMobileEmailView(true);
  };

  // Mobile back to inbox handler
  const handleMobileBackToInbox = () => {
    setIsMobileEmailView(false);
    setSelectedEmail(null);
  };

  const renderEmailContent = (content: string) => {
    // A simple approach to render basic HTML.
    // For production, you MUST use a sanitizer to prevent XSS attacks.
    return { __html: content };
  };

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

  if (!inboxId) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 font-sans">
      <div className="bg-secondary/50 border border-border rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-border bg-background/50">
          {/* Desktop Header - Unchanged */}
          <div className="hidden sm:flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-foreground font-sans">
                Your Temporary Inbox
              </h2>
              <p className="text-sm text-muted-foreground mt-1 truncate font-sans">
                <span className="font-normal text-foreground/80">
                  {emailAddress}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground font-sans">
                  Expires in:
                </p>
                <p
                  className={`text-lg font-medium font-sans ${
                    timeRemaining.expired ||
                    (timeRemaining.minutes === 0 && timeRemaining.seconds <= 59)
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {timeRemaining.expired
                    ? "Expired"
                    : `${String(timeRemaining.minutes).padStart(
                        2,
                        "0"
                      )}:${String(timeRemaining.seconds).padStart(2, "0")}`}
                </p>
              </div>
              <Button
                onClick={handleManualRefresh}
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="font-sans"
              >
                {isLoading ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>

          {/* Mobile Header - Stacked Layout */}
          <div className="sm:hidden space-y-3">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-foreground font-sans">
                Your Temporary Inbox
              </h2>
              <p className="text-sm text-muted-foreground mt-1 font-sans break-all">
                <span className="font-normal text-foreground/80 tracking-tight">
                  {emailAddress}
                </span>
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-sm text-muted-foreground font-sans">
                  Expires in:
                </p>
                <p
                  className={`text-lg font-medium font-sans ${
                    timeRemaining.expired ||
                    (timeRemaining.minutes === 0 && timeRemaining.seconds <= 59)
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {timeRemaining.expired
                    ? "Expired"
                    : `${String(timeRemaining.minutes).padStart(
                        2,
                        "0"
                      )}:${String(timeRemaining.seconds).padStart(2, "0")}`}
                </p>
              </div>
              <Button
                onClick={handleManualRefresh}
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="font-sans"
              >
                {isLoading ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop View - Unchanged */}
        <div className="hidden md:flex h-[60vh]">
          {/* Email List */}
          <div className="w-1/3 border-r border-border overflow-y-auto bg-background/20">
            {isLoading && emails.length === 0 && (
              <p className="p-4 text-center text-muted-foreground font-sans">
                Loading emails...
              </p>
            )}
            {!isLoading && emails.length === 0 && (
              <div className="p-6 text-center flex flex-col items-center justify-center h-full">
                <h3 className="font-semibold text-foreground font-sans">
                  Waiting for emails...
                </h3>
                <p className="text-sm text-muted-foreground mt-1 font-sans">
                  Emails sent to your address will appear here.
                </p>
              </div>
            )}
            <ul>
              {emails.map((email) => (
                <li
                  key={email.id}
                  onClick={() => setSelectedEmail(email)}
                  className={`p-4 cursor-pointer border-b border-border transition-colors ${
                    selectedEmail?.id === email.id
                      ? "bg-blue-500/10"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="flex justify-between items-baseline">
                    <p className="font-semibold text-sm truncate text-foreground font-sans">
                      {email.from_address}
                    </p>
                    <p className="text-xs text-muted-foreground font-sans">
                      {new Date(email.received_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-1 font-sans">
                    {email.subject}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Email Content */}
          <div className="w-2/3 overflow-y-auto p-6 bg-background">
            {selectedEmail ? (
              <div>
                <div className="border-b border-border pb-4">
                  <h3 className="text-xl font-semibold text-foreground font-sans">
                    {selectedEmail.subject}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 font-sans">
                    From:{" "}
                    <span className="font-medium text-foreground/80">
                      {selectedEmail.from_address}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 font-sans">
                    Received:{" "}
                    {new Date(selectedEmail.received_at).toLocaleString()}
                  </p>
                </div>
                <div
                  className="prose prose-sm dark:prose-invert max-w-none mt-6 font-sans"
                  dangerouslySetInnerHTML={renderEmailContent(
                    selectedEmail.body
                  )}
                />
                {/* Attachment Section */}
                {selectedEmail.attachments &&
                  selectedEmail.attachments.length > 0 && (
                    <div className="mt-8">
                      <h4 className="font-semibold text-foreground mb-3 font-sans">
                        Attachments ({selectedEmail.attachments.length})
                      </h4>
                      <ul className="space-y-3">
                        {selectedEmail.attachments.map((att) => {
                          const check = isAttachmentAllowed(
                            att.content_type,
                            att.filename,
                            att.file_size
                          );
                          return (
                            <li
                              key={att.id}
                              className="border border-border rounded-lg p-3"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">
                                  {getFileIcon(att.content_type, att.filename)}
                                </span>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-foreground font-sans">
                                    {att.filename}
                                  </p>
                                  <p className="text-xs text-muted-foreground font-sans">
                                    {formatFileSize(att.file_size)}
                                  </p>
                                </div>
                                {check.allowed ? (
                                  <a
                                    href={att.download_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                    className="text-sm text-blue-500 hover:text-blue-600 font-medium font-sans"
                                  >
                                    Download
                                  </a>
                                ) : (
                                  <span
                                    className="text-sm text-red-500 cursor-not-allowed font-sans"
                                    title={check.reason}
                                  >
                                    Blocked
                                  </span>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <svg
                  className="w-12 h-12 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
                <p className="font-medium font-sans">Select an email to read</p>
                <p className="text-sm font-sans">Nothing selected</p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile View - Page System */}
        <div className="md:hidden h-[60vh]">
          {!isMobileEmailView ? (
            // Mobile Email List Page
            <div className="h-full overflow-y-auto">
              {isLoading && emails.length === 0 && (
                <p className="p-4 text-center text-muted-foreground font-sans">
                  Loading emails...
                </p>
              )}
              {!isLoading && emails.length === 0 && (
                <div className="p-6 text-center flex flex-col items-center justify-center h-full">
                  <h3 className="font-semibold text-foreground font-sans">
                    Waiting for emails...
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 font-sans">
                    Emails sent to your address will appear here.
                  </p>
                </div>
              )}
              <ul className="divide-y divide-border">
                {emails.map((email) => (
                  <li
                    key={email.id}
                    onClick={() => handleMobileEmailSelect(email)}
                    className="p-4 cursor-pointer hover:bg-muted transition-colors"
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <p className="font-semibold text-sm text-foreground font-sans truncate">
                        {email.from_address}
                      </p>
                      <p className="text-xs text-muted-foreground font-sans ml-2">
                        {new Date(email.received_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground font-sans truncate">
                      {email.subject}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            // Mobile Email View Page
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-border bg-background/50">
                <Button
                  onClick={handleMobileBackToInbox}
                  variant="outline"
                  size="sm"
                  className="mb-3 font-sans"
                >
                  ← Back to Inbox
                </Button>
                {selectedEmail && (
                  <>
                    <h3 className="text-lg font-semibold text-foreground font-sans">
                      {selectedEmail.subject}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 font-sans">
                      From: {selectedEmail.from_address}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-sans">
                      Received:{" "}
                      {new Date(selectedEmail.received_at).toLocaleString()}
                    </p>
                  </>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {selectedEmail && (
                  <>
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none font-sans"
                      dangerouslySetInnerHTML={renderEmailContent(
                        selectedEmail.body
                      )}
                    />
                    {/* Mobile Attachment Section */}
                    {selectedEmail.attachments &&
                      selectedEmail.attachments.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-semibold text-foreground mb-3 font-sans">
                            Attachments ({selectedEmail.attachments.length})
                          </h4>
                          <ul className="space-y-3">
                            {selectedEmail.attachments.map((att) => {
                              const check = isAttachmentAllowed(
                                att.content_type,
                                att.filename,
                                att.file_size
                              );
                              return (
                                <li
                                  key={att.id}
                                  className="border border-border rounded-lg p-3"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="text-xl">
                                      {getFileIcon(
                                        att.content_type,
                                        att.filename
                                      )}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-foreground font-sans truncate">
                                        {att.filename}
                                      </p>
                                      <p className="text-xs text-muted-foreground font-sans">
                                        {formatFileSize(att.file_size)}
                                      </p>
                                    </div>
                                    {check.allowed ? (
                                      <a
                                        href={att.download_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                        className="text-sm text-blue-500 hover:text-blue-600 font-medium font-sans"
                                      >
                                        Download
                                      </a>
                                    ) : (
                                      <span
                                        className="text-sm text-red-500 cursor-not-allowed font-sans"
                                        title={check.reason}
                                      >
                                        Blocked
                                      </span>
                                    )}
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
