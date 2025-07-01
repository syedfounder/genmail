"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PlusCircle, Inbox, Copy, RefreshCw, Trash2, Lock } from "lucide-react";
import { useInboxStore } from "@/lib/inbox-store";
import { NewMailboxSheet } from "@/components/NewMailboxSheet";
import { toast } from "sonner";

function timeAgo(date: string) {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  );
  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

function timeUntil(date: string) {
  const seconds = Math.floor(
    (new Date(date).getTime() - new Date().getTime()) / 1000
  );
  if (seconds < 0) {
    return "Expired";
  }
  let interval = seconds / 31536000;
  if (interval > 1) {
    return `in ${Math.floor(interval)} years`;
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return `in ${Math.floor(interval)} months`;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return `in ${Math.floor(interval)} days`;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return `in ${Math.floor(interval)} hours`;
  }
  interval = seconds / 60;
  if (interval > 1) {
    return `in ${Math.floor(interval)} minutes`;
  }
  return `in ${Math.floor(seconds)} seconds`;
}

function PaymentSuccessBanner() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPolling, setIsPolling] = useState(false);
  const [pollingComplete, setPollingComplete] = useState(false);

  const isPaymentSuccess =
    searchParams.get("payment_success") === "true" ||
    searchParams.get("success") === "true";

  useEffect(() => {
    if (!isPaymentSuccess || !user || pollingComplete) return;

    // Check if already pro (webhook was very fast)
    const metadata = user.publicMetadata as {
      isPro?: boolean;
      subscriptionTier?: string;
      subscriptionStatus?: string;
    };
    const isAlreadyPro =
      metadata?.isPro === true ||
      (metadata?.subscriptionTier === "premium" &&
        metadata?.subscriptionStatus === "active");

    if (isAlreadyPro) {
      // Already pro! Clean URL immediately
      setPollingComplete(true);
      const cleanUrl = window.location.pathname;
      router.replace(cleanUrl);
      toast.success("Welcome to GenMail Pro! Your subscription is active.");
      return;
    }

    setIsPolling(true);

    const pollSubscriptionStatus = async () => {
      try {
        // Force reload user data to get latest subscription status
        await user.reload();

        const metadata = user.publicMetadata as {
          isPro?: boolean;
          subscriptionTier?: string;
          subscriptionStatus?: string;
        };
        const isPro =
          metadata?.isPro === true ||
          (metadata?.subscriptionTier === "premium" &&
            metadata?.subscriptionStatus === "active");

        if (isPro) {
          // Subscription is now active! Clean up URL and stop polling
          setPollingComplete(true);
          setIsPolling(false);

          // Clean the URL by removing success parameters
          const cleanUrl = window.location.pathname;
          router.replace(cleanUrl);

          toast.success(
            "Welcome to GenMail Pro! Your subscription is now active."
          );
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error polling subscription status:", error);
        return false;
      }
    };

    // Poll immediately, then every 2 seconds for up to 30 seconds
    let pollCount = 0;
    const maxPolls = 15; // 30 seconds max

    const pollInterval = setInterval(async () => {
      const success = await pollSubscriptionStatus();
      pollCount++;

      if (success || pollCount >= maxPolls) {
        clearInterval(pollInterval);
        if (!success) {
          // Polling timed out
          setIsPolling(false);
          toast.error(
            "Subscription activation is taking longer than expected. Please refresh the page or contact support."
          );
        }
      }
    }, 2000);

    // Initial poll
    pollSubscriptionStatus();

    return () => clearInterval(pollInterval);
  }, [isPaymentSuccess, user, router, pollingComplete]);

  if (!isPaymentSuccess || pollingComplete) return null;

  return (
    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
      <div className="flex items-center gap-3">
        {isPolling && (
          <RefreshCw className="h-5 w-5 text-green-600 animate-spin" />
        )}
        <div>
          <h3 className="font-semibold text-green-800 dark:text-green-200">
            Payment Successful!
          </h3>
          <p className="text-sm text-green-700 dark:text-green-300">
            {isPolling
              ? "Activating your Pro subscription... This may take a few moments."
              : "Your subscription is being processed."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();
  const { inboxes, fetchInboxes, deleteInbox } = useInboxStore();
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [inboxToDelete, setInboxToDelete] = useState<{
    id: string;
    email: string;
    hasPassword: boolean;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchInboxes().finally(() => setLoading(false));
    }
  }, [user, fetchInboxes]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Email address copied to clipboard!");
  };

  const handleDeleteInbox = async () => {
    if (!inboxToDelete || isDeleting) return;

    setIsDeleting(true);
    try {
      if (inboxToDelete.hasPassword) {
        if (!deletePassword.trim()) {
          toast.error("Password is required to delete this inbox.");
          setIsDeleting(false);
          return;
        }

        const verifyResponse = await fetch("/api/verifyInboxPassword", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            inboxId: inboxToDelete.id,
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

      const response = await fetch("/api/deleteInbox", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inboxId: inboxToDelete.id }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Inbox deleted successfully!");
        deleteInbox(inboxToDelete.id);
        setDeleteDialogOpen(false);
        setInboxToDelete(null);
        setDeletePassword("");
      } else {
        toast.error(result.error || "Failed to delete inbox.");
      }
    } catch {
      toast.error("An error occurred while deleting the inbox.");
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteDialog = (inbox: {
    id: string;
    email_address: string;
    password_hash?: string | null;
  }) => {
    setInboxToDelete({
      id: inbox.id,
      email: inbox.email_address,
      hasPassword: !!inbox.password_hash,
    });
    setDeletePassword("");
    setDeleteDialogOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 font-sans">
      <Suspense fallback={null}>
        <PaymentSuccessBanner />
      </Suspense>
      <NewMailboxSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="font-sans">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-sans">
              Delete Inbox
            </AlertDialogTitle>
            <AlertDialogDescription className="font-sans">
              Are you sure you want to delete the inbox{" "}
              <strong>{inboxToDelete?.email}</strong>? This action will
              permanently delete the inbox and all its emails. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {inboxToDelete?.hasPassword && (
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
                (inboxToDelete?.hasPassword && !deletePassword.trim())
              }
              className="bg-red-600 hover:bg-red-700 font-sans"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tighter">Inboxes</h1>
          <p className="text-muted-foreground">
            Create and manage your temporary email inboxes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (user) {
                setLoading(true);
                fetchInboxes().finally(() => setLoading(false));
              }
            }}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button
            onClick={() => setIsSheetOpen(true)}
            style={{
              background:
                "linear-gradient(135deg, rgba(55, 47, 132, 0.95) 0%, rgba(74, 59, 148, 0.95) 100%)",
            }}
            className="shine-button backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30 text-white"
          >
            <PlusCircle className="mr-2 h-4 w-4 text-white" />
            New Inbox
          </Button>
        </div>
      </div>

      {/* Analytics Card */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-background border rounded-lg p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-3xl font-bold font-sans text-foreground mb-1">
                {inboxes.length}
              </p>
              <p className="text-sm text-muted-foreground">Total Inboxes</p>
            </div>
            <Inbox className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        <div className="bg-background border rounded-lg p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-3xl font-bold font-sans text-foreground mb-1">
                {
                  inboxes.filter(
                    (inbox) => new Date(inbox.expires_at) > new Date()
                  ).length
                }
              </p>
              <p className="text-sm text-muted-foreground">Active Inboxes</p>
            </div>
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-background border rounded-lg p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-3xl font-bold font-sans text-foreground mb-1">
                {inboxes.filter((inbox) => inbox.password_hash).length}
              </p>
              <p className="text-sm text-muted-foreground">Protected Inboxes</p>
            </div>
            <Lock className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        <div className="bg-background border rounded-lg p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-3xl font-bold font-sans text-foreground mb-1">
                {inboxes.filter((inbox) => inbox.custom_name).length}
              </p>
              <p className="text-sm text-muted-foreground">With Labels</p>
            </div>
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email Address</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading inboxes...
                </TableCell>
              </TableRow>
            ) : inboxes.length > 0 ? (
              inboxes.map((inbox) => (
                <TableRow
                  key={inbox.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => router.push(`/dashboard/inbox/${inbox.id}`)}
                >
                  <TableCell className="font-mono text-sm">
                    <div className="flex items-center gap-2">
                      <span>{inbox.email_address}</span>
                      {inbox.password_hash && (
                        <Lock className="h-3 w-3 text-muted-foreground" />
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(inbox.email_address);
                        }}
                      >
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {inbox.custom_name ? (
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-500/20 text-purple-700 dark:bg-purple-500/30 dark:text-purple-300 rounded-md">
                        {inbox.custom_name}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">
                        No label
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {timeAgo(inbox.created_at)}
                  </TableCell>
                  <TableCell className="text-sm">
                    <span className="text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      {timeUntil(inbox.expires_at)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full border ${
                        new Date(inbox.expires_at) > new Date()
                          ? "border-green-500 text-green-600 dark:border-green-400 dark:text-green-400"
                          : "border-red-500 text-red-600 dark:border-red-400 dark:text-red-400"
                      }`}
                    >
                      {new Date(inbox.expires_at) > new Date()
                        ? "Active"
                        : "Expired"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteDialog(inbox);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <Inbox className="h-12 w-12 text-muted-foreground" />
                    <h3 className="text-xl font-semibold">No inboxes yet</h3>
                    <p className="text-muted-foreground">
                      Click &quot;New Inbox&quot; to get your first temporary
                      email address.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
