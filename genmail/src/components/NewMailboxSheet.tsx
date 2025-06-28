"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

import { useState } from "react";
import { useInboxStore } from "@/lib/inbox-store";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

interface NewMailboxSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewMailboxSheet({ open, onOpenChange }: NewMailboxSheetProps) {
  const { user } = useUser();
  const { addInbox } = useInboxStore();
  const [isCreating, setIsCreating] = useState(false);
  const [customName, setCustomName] = useState("");
  const [password, setPassword] = useState("");
  const [ttl, setTtl] = useState("10m");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isCreating) return;

    setIsCreating(true);
    try {
      const response = await fetch("/api/createInbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          custom_name: customName,
          password: password,
          ttl: ttl,
          subscription_tier: "premium", // Assuming this is for subscribers
        }),
      });

      const newInboxData = await response.json();

      if (response.ok) {
        toast.success("New mailbox created successfully!");
        addInbox(newInboxData);
        onOpenChange(false); // Close the sheet
        // Reset form
        setCustomName("");
        setPassword("");
        setTtl("10m");
      } else {
        toast.error(newInboxData.error || "Failed to create mailbox.");
      }
    } catch {
      toast.error("An error occurred.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] font-sans">
        <form onSubmit={handleSubmit}>
          <SheetHeader>
            <SheetTitle className="font-sans">Create New Inbox</SheetTitle>
            <SheetDescription className="font-sans">
              Create a private, password-protected inbox with a custom lifetime.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="name" className="text-right font-sans">
                Label
              </Label>
              <Input
                id="name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. 'Newsletter Signups'"
                className="col-span-3 font-sans"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="password" className="text-right font-sans">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="(Optional)"
                className="col-span-3 font-sans"
              />
              {password && (
                <div className="col-start-2 col-span-3 flex items-start gap-2 text-xs text-amber-600 dark:text-amber-500 mt-1">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span>
                    <strong>Warning:</strong> Passwords are not recoverable. If
                    you forget your password, you will lose access to this
                    inbox. Please save it in a secure place.
                  </span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right font-sans">Lifetime</Label>
              <div className="col-span-3 flex flex-col gap-2">
                <Button
                  type="button"
                  variant={ttl === "10m" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTtl("10m")}
                  className="font-sans justify-start"
                >
                  10 min
                </Button>
                <Button
                  type="button"
                  variant={ttl === "1h" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTtl("1h")}
                  className="font-sans justify-start"
                >
                  1 hour
                </Button>
                <Button
                  type="button"
                  variant={ttl === "24h" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTtl("24h")}
                  className="font-sans justify-start"
                >
                  24 hours
                </Button>
                <Button
                  type="button"
                  variant={ttl === "1w" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTtl("1w")}
                  className="font-sans justify-start"
                >
                  1 week
                </Button>
              </div>
            </div>
          </div>
          <SheetFooter>
            <Button type="submit" disabled={isCreating} className="font-sans">
              {isCreating ? "Creating..." : "Create Mailbox"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
