"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Inbox,
  FilePlus,
  Settings,
  LifeBuoy,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useInboxStore } from "@/lib/inbox-store";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

interface DashboardSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  isMobile?: boolean;
}

const DashboardSidebar = ({
  isCollapsed,
  setIsCollapsed,
  isMobile = false,
}: DashboardSidebarProps) => {
  const { user } = useUser();
  const { inboxes, fetchInboxes, addInbox } = useInboxStore();
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user && inboxes.length === 0) {
      fetchInboxes(user.id, supabase);
    }
  }, [user, inboxes.length, fetchInboxes]);

  const createNewInbox = async () => {
    if (!user || isCreating) return;

    setIsCreating(true);
    try {
      const response = await fetch("/api/createInbox", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription_tier: "free",
        }),
      });

      const newInboxData = await response.json();

      if (response.ok) {
        toast.success("New inbox created successfully!");
        addInbox(newInboxData.inbox);
      } else {
        toast.error(newInboxData.error || "Failed to create inbox.");
      }
    } catch (error) {
      console.error("Error creating inbox:", error);
      toast.error("An error occurred while creating the inbox.");
    } finally {
      setIsCreating(false);
    }
  };

  const activeInboxes = inboxes.filter(
    (inbox) => new Date(inbox.expires_at) > new Date()
  );

  // Calculate total inbox count (including expired ones for the limit)
  const totalInboxCount = inboxes.length;
  const maxInboxes = 10; // Premium subscription limit
  const resolvedCollapsed = isMobile ? false : isCollapsed;

  return (
    <aside
      className={
        isMobile
          ? "flex h-full flex-col justify-between p-4 font-sans"
          : `fixed top-0 left-0 h-full bg-background border-r border-border/60 p-4 flex flex-col justify-between font-sans transition-all duration-300 ${
              resolvedCollapsed ? "w-20" : "w-72"
            }`
      }
    >
      <div>
        <div
          className={`flex items-center mb-4 ${
            resolvedCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!resolvedCollapsed && (
            <Link href="/" className="p-2">
              {mounted && (
                <Image
                  src={theme === "dark" ? "/logo-dark.png" : "/logo.png"}
                  alt="Genmail Logo"
                  width={80}
                  height={28}
                  className="h-7 w-auto"
                />
              )}
            </Link>
          )}
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="sr-only">
                {isCollapsed ? "Expand" : "Collapse"}
              </span>
            </Button>
          )}
        </div>

        {/* Search Bar */}
        {resolvedCollapsed ? (
          <div className="px-2 mb-6 flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => !isMobile && setIsCollapsed(false)}
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
        ) : (
          <div className="px-2 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search inboxes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/60 border-border/60 focus:bg-background font-sans text-sm"
                autoFocus
              />
            </div>
          </div>
        )}

        {!resolvedCollapsed && (
          <div className="flex items-center justify-between px-2 mb-2">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Inboxes
            </h2>
            <span className="text-xs font-mono text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">
              {totalInboxCount}/{maxInboxes}
            </span>
          </div>
        )}

        <nav className="flex flex-col gap-1">
          {!user ? (
            <p className="text-sm text-orange-500 p-2">
              Please log in to view your inboxes.
            </p>
          ) : activeInboxes.length > 0 ? (
            activeInboxes.map((inbox) => {
              const isActive = pathname === `/dashboard/inbox/${inbox.id}`;
              return (
                <Link
                  key={inbox.id}
                  href={`/dashboard/inbox/${inbox.id}`}
                  className={`text-sm p-2 rounded-md hover:bg-secondary transition-colors flex items-center gap-3 ${
                    resolvedCollapsed ? "justify-center" : ""
                  } ${
                    isActive
                      ? "bg-gradient-to-r from-[#372F84]/20 to-background text-foreground"
                      : ""
                  }`}
                >
                  <Inbox
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive ? "text-[#372F84]" : "text-muted-foreground"
                    }`}
                  />
                  {!resolvedCollapsed && (
                    <span className="truncate">{inbox.email_address}</span>
                  )}
                </Link>
              );
            })
          ) : (
            !resolvedCollapsed && (
              <p className="text-sm text-muted-foreground p-2">
                No active inboxes found.
              </p>
            )
          )}
        </nav>
      </div>

      <div className="flex flex-col gap-1">
        <Link
          href="/dashboard/settings"
          className={`text-sm p-2 rounded-md hover:bg-secondary transition-colors flex items-center gap-3 ${
            resolvedCollapsed ? "justify-center" : ""
          }`}
        >
          <Settings className="w-4 h-4 text-muted-foreground" />
          {!resolvedCollapsed && "Settings"}
        </Link>
        <Link
          href="/help"
          className={`text-sm p-2 rounded-md hover:bg-secondary transition-colors flex items-center gap-3 ${
            resolvedCollapsed ? "justify-center" : ""
          }`}
        >
          <LifeBuoy className="w-4 h-4 text-muted-foreground" />
          {!resolvedCollapsed && "Help & Support"}
        </Link>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
