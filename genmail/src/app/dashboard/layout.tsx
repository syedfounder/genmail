"use client";

import { useUser } from "@clerk/nextjs";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useInboxStore } from "@/lib/inbox-store";
import { Mail } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "next-themes";
import { UserNav } from "@/components/UserNav";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const { inboxes } = useInboxStore();
  const { resolvedTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const activeInboxCount = inboxes.filter(
    (inbox) => new Date(inbox.expires_at) > new Date()
  ).length;

  return (
    <div className="flex min-h-screen bg-secondary/30">
      <DashboardSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isCollapsed ? "ml-20" : "ml-72"
        }`}
      >
        <header className="flex items-center justify-between px-6 py-4 bg-background/50 backdrop-blur-sm">
          {/* Left side - Title */}
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <h1 className="text-3xl font-semibold text-foreground font-sans tracking-tighter">
                Your Dashboard
              </h1>
              <div className="flex items-center gap-1.5 mt-1">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground font-sans">
                  {activeInboxCount} active inbox
                  {activeInboxCount !== 1 ? "es" : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Right side - Theme Toggle and User */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserNav />
          </div>
        </header>

        <main className="flex-1 bg-background">{children}</main>
      </div>
    </div>
  );
}
