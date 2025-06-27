"use client";

import { Mail, User, Clock, Paperclip } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type Email = {
  id: string;
  from_address: string;
  subject: string;
  body: string;
  html_body?: string;
  received_at: string;
  is_read: boolean;
};

interface EmailViewerProps {
  email: Email | null;
}

function formatFullDateTime(date: string) {
  return new Date(date).toLocaleString(undefined, {
    dateStyle: "full",
    timeStyle: "medium",
  });
}

export function EmailViewer({ email }: EmailViewerProps) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!email) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-secondary/40 text-center p-8 rounded-lg">
        <Mail className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold">Select an email to read</h2>
        <p className="text-muted-foreground mt-1">
          Your messages will be displayed here.
        </p>
      </div>
    );
  }

  // Determine the current theme
  const currentTheme = mounted
    ? theme === "system"
      ? systemTheme
      : theme
    : "light";
  const isDark = currentTheme === "dark";

  // Inject theme-aware CSS into HTML emails
  const getThemedHtmlContent = (htmlContent: string) => {
    const themeStyles = `
      <style>
        html, body {
          background-color: ${isDark ? "#000000" : "#ffffff"} !important;
          color: ${isDark ? "#ffffff" : "#000000"} !important;
          font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !important;
          margin: 0 !important;
          padding: 16px !important;
        }
        * {
          background-color: ${isDark ? "#000000" : "#ffffff"} !important;
          color: ${isDark ? "#ffffff" : "#000000"} !important;
        }
        a {
          color: ${isDark ? "#60a5fa" : "#2563eb"} !important;
        }
        table, tr, td, th {
          background-color: ${isDark ? "#000000" : "#ffffff"} !important;
          color: ${isDark ? "#ffffff" : "#000000"} !important;
        }
        div, p, span {
          background-color: ${isDark ? "#000000" : "#ffffff"} !important;
          color: ${isDark ? "#ffffff" : "#000000"} !important;
        }
      </style>
    `;

    // Insert the styles at the beginning of the HTML
    if (htmlContent.includes("<head>")) {
      return htmlContent.replace("<head>", `<head>${themeStyles}`);
    } else if (htmlContent.includes("<html>")) {
      return htmlContent.replace("<html>", `<html><head>${themeStyles}</head>`);
    } else {
      return `<html><head>${themeStyles}</head><body>${htmlContent}</body></html>`;
    }
  };

  return (
    <div className="bg-background rounded-lg border h-full flex flex-col font-sans">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold tracking-tight">
          {email.subject || "(no subject)"}
        </h2>
        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>
              From:{" "}
              <span className="font-medium text-foreground">
                {email.from_address}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{formatFullDateTime(email.received_at)}</span>
          </div>
        </div>
      </div>
      <div className="p-4 flex-grow overflow-y-auto bg-background">
        {email.html_body ? (
          <iframe
            srcDoc={getThemedHtmlContent(email.html_body)}
            className="w-full h-full border-0 bg-background"
            sandbox="allow-same-origin"
          />
        ) : (
          <pre className="whitespace-pre-wrap text-sm text-foreground bg-background font-sans">
            {email.body}
          </pre>
        )}
      </div>
      <div className="p-4 border-t flex items-center gap-2">
        <Paperclip className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm font-medium">0 Attachments</span>
      </div>
    </div>
  );
}
