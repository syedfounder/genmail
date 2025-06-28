"use client";

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

import DashboardSidebar from "@/components/DashboardSidebar";
import { useInboxStore } from "@/lib/inbox-store";
import { Mail, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserNav } from "@/components/UserNav";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { inboxes } = useInboxStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeInboxCount = inboxes.filter(
    (inbox) => new Date(inbox.expires_at) > new Date()
  ).length;

  return (
    <>
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-72 bg-background border-r-0">
          <DashboardSidebar
            isCollapsed={false}
            setIsCollapsed={() => {}}
            isMobile={true}
          />
        </SheetContent>
      </Sheet>
      <div className="flex min-h-screen bg-secondary/30">
        <div className="hidden md:block">
          <DashboardSidebar
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
        </div>
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isCollapsed ? "md:ml-20" : "md:ml-72"
          }`}
        >
          <header className="flex items-center justify-between px-4 md:px-6 py-4 bg-background/50 backdrop-blur-sm sticky top-0 z-10 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-10 w-10"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
              <div className="flex flex-col">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground font-sans tracking-tighter">
                  <span className="hidden sm:inline">Your </span>Dashboard
                </h1>
                <div className="hidden md:flex items-center gap-1.5 mt-1">
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
    </>
  );
}
