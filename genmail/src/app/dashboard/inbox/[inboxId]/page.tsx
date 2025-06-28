"use client";

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import supabase from "@/lib/supabaseClient";
import { useUser } from "@clerk/nextjs";
import { Mail, Inbox, ChevronLeft, Trash2, Lock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmailViewer } from "@/components/EmailViewer";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useInboxStore } from "@/lib/inbox-store";

// Expanded type to include html_body
type Email = {
  id: string;
  from_address: string;
  subject: string;
  body: string;
  html_body?: string;
  received_at: string;
  is_read: boolean;
};

type InboxDetails = {
  id: string;
  email_address: string;
  user_id: string;
  password_hash: string | null;
};

function formatRelativeTime(date: string) {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  );
  let interval = seconds / 31536000;
  if (interval > 1) return `${Math.floor(interval)}y ago`;
  interval = seconds / 2592000;
  if (interval > 1) return `${Math.floor(interval)}mo ago`;
  interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)}d ago`;
  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)}h ago`;
  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)}m ago`;
  return `${Math.floor(seconds)}s ago`;
}

// New component for the password prompt
function PasswordPrompt({
  onSubmit,
  loading,
}: {
  onSubmit: (password: string) => void;
  loading: boolean;
}) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-secondary/40 rounded-lg">
      <form onSubmit={handleSubmit} className="w-full max-w-sm text-center">
        <Mail className="h-16 w-16 text-muted-foreground mb-4 inline-block" />
        <h2 className="text-xl font-semibold">
          This inbox is password protected.
        </h2>
        <p className="text-muted-foreground mt-1 mb-6">
          Please enter the password to view its contents.
        </p>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter inbox password"
          className="text-center"
        />
        <Button type="submit" className="mt-4 w-full" disabled={loading}>
          {loading ? "Unlocking..." : "Unlock Inbox"}
        </Button>
      </form>
    </div>
  );
}

export default function InboxPage() {
  const params = useParams();
  const { inboxId } = params;
  const { user } = useUser();
  const router = useRouter();
  const { deleteInbox } = useInboxStore();

  const [inboxDetails, setInboxDetails] = useState<InboxDetails | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  // Using the validated Supabase client

  // Move fetchEmails outside useEffect so it can be called from handlePasswordSubmit
  const fetchEmails = async () => {
    const { data: emailsData, error: emailsError } = await supabase
      .from("emails")
      .select(
        "id, from_address, subject, body, html_body, received_at, is_read"
      )
      .eq("inbox_id", inboxId)
      .order("received_at", { ascending: false });

    if (emailsError) {
      throw new Error("Failed to fetch emails for this inbox.");
    }
    setEmails(emailsData || []);
  };

  useEffect(() => {
    if (!user || !inboxId) return;

    const fetchInboxData = async () => {
      setLoading(true);
      setError(null);
      setIsUnlocked(false);

      try {
        const { data: inboxData, error: inboxError } = await supabase
          .from("inboxes")
          .select("id, email_address, user_id, password_hash")
          .eq("id", inboxId)
          .single();

        if (inboxError || !inboxData) {
          throw new Error("Could not find inbox or you don't have permission.");
        }

        if (inboxData.user_id !== user.id) {
          throw new Error("Access denied. You do not own this inbox.");
        }

        setInboxDetails(inboxData);

        if (!inboxData.password_hash) {
          setIsUnlocked(true);
          await fetchEmails();
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInboxData();
  }, [user, inboxId, fetchEmails]);

  const handleDeleteInbox = async () => {
    if (!inboxDetails || isDeleting) return;

    setIsDeleting(true);
    try {
      // If inbox has password, verify it first
      if (inboxDetails.password_hash) {
        if (!deletePassword.trim()) {
          toast.error("Password is required to delete this inbox.");
          setIsDeleting(false);
          return;
        }

        // Verify password before deletion
        const verifyResponse = await fetch("/api/verifyInboxPassword", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            inboxId: inboxDetails.id,
            password: deletePassword,
          }),
        });

        const verifyResult = await verifyResponse.json();

        if (!verifyResponse.ok || !verifyResult.success) {
          toast.error("Incorrect password. Cannot delete inbox.");
          setIsDeleting(false);
          return;
        }
      }

      // Proceed with deletion
      const response = await fetch("/api/deleteInbox", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inboxId: inboxDetails.id }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Inbox deleted successfully!");
        deleteInbox(inboxDetails.id);
        router.push("/dashboard");
      } else {
        toast.error(result.error || "Failed to delete inbox.");
      }
    } catch {
      toast.error("An error occurred while deleting the inbox.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePasswordSubmit = async (password: string) => {
    setPasswordLoading(true);
    try {
      const response = await fetch("/api/verifyInboxPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inboxId, password }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Inbox unlocked!");
        setIsUnlocked(true);
        await fetchEmails();
      } else {
        toast.error(data.error || "Incorrect password.");
      }
    } catch {
      toast.error("Failed to verify password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSelectEmail = async (email: Email) => {
    setSelectedEmail(email);
    if (!email.is_read) {
      const { error } = await supabase
        .from("emails")
        .update({ is_read: true })
        .eq("id", email.id);

      if (!error) {
        setEmails(
          emails.map((e) => (e.id === email.id ? { ...e, is_read: true } : e))
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading inbox...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!inboxDetails) {
    return (
      <div className="flex items-center justify-center h-full">
        Inbox not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full font-sans">
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="font-sans">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-sans">
              Delete Inbox
            </AlertDialogTitle>
            <AlertDialogDescription className="font-sans">
              Are you sure you want to delete the inbox{" "}
              <strong>{inboxDetails?.email_address}</strong>? This action will
              permanently delete the inbox and all its emails. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {inboxDetails?.password_hash && (
            <div className="space-y-2 font-sans">
              <Label
                htmlFor="delete-password"
                className="flex items-center gap-2 font-sans"
              >
                <Lock className="h-4 w-4" />
                This inbox is password-protected. Enter password to confirm
                deletion:
              </Label>
              <Input
                id="delete-password"
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter inbox password"
                disabled={isDeleting}
                className="font-sans"
              />
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              onClick={() => {
                setDeletePassword("");
                setDeleteDialogOpen(false);
              }}
              className="font-sans"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteInbox}
              disabled={
                isDeleting ||
                (!!inboxDetails?.password_hash && !deletePassword.trim())
              }
              className="bg-red-600 hover:bg-red-700 font-sans"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="p-4 sm:p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => router.back()}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-foreground truncate">
                {inboxDetails?.email_address}
              </h1>
              {inboxDetails?.password_hash && (
                <Lock className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setDeleteDialogOpen(true)}
            className="h-8 w-8"
            aria-label="Delete Inbox"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-grow">
        <ResizablePanel defaultSize={40} minSize={30}>
          <div className="bg-background h-full overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-right">Received</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emails.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">
                      <Inbox className="inline-block h-6 w-6 mb-2 text-muted-foreground" />
                      <p className="font-medium">Empty Inbox</p>
                      <p className="text-sm text-muted-foreground">
                        Waiting for new emails to arrive...
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  emails.map((email) => (
                    <TableRow
                      key={email.id}
                      onClick={() => handleSelectEmail(email)}
                      className={`cursor-pointer ${
                        selectedEmail?.id === email.id ? "bg-accent" : ""
                      } ${!email.is_read ? "font-bold" : ""}`}
                    >
                      <TableCell>{email.from_address}</TableCell>
                      <TableCell>{email.subject}</TableCell>
                      <TableCell className="text-right">
                        {formatRelativeTime(email.received_at)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={60} minSize={30}>
          {!isUnlocked ? (
            <PasswordPrompt
              onSubmit={handlePasswordSubmit}
              loading={passwordLoading}
            />
          ) : (
            <EmailViewer email={selectedEmail} />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
