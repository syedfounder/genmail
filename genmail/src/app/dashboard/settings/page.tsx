"use client";

import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Bell,
  Trash2,
  Download,
  Clock,
  Key,
  AlertTriangle,
  CheckCircle,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    downloadFormat: "eml",
    maxInboxes: 10,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const [supabase] = useState(() =>
    createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSaveSettings = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Settings saved successfully!");
  };

  const handleExportData = async () => {
    const toastId = toast.loading("Preparing data export...");
    try {
      const response = await fetch("/api/exportData");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to export data.");
      }

      // Create a blob from the JSON data
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });

      // Create a URL for the blob and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `genmail_export_${user?.id}.json`);
      document.body.appendChild(link);
      link.click();

      // Clean up the URL object
      window.URL.revokeObjectURL(url);
      link.remove();

      toast.success("Data export successful!", { id: toastId });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      toast.error(`Export failed: ${errorMessage}`, { id: toastId });
    }
  };

  const handleDeleteAllData = async () => {
    if (
      confirm(
        "Are you sure you want to delete all your data? This action cannot be undone."
      )
    ) {
      toast.error("Data deletion initiated. You will be logged out shortly.");
    }
  };

  if (!mounted) return null;

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6 font-sans">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-6 w-6 text-[#372F84]" />
        <h1 className="text-2xl font-semibold">Settings</h1>
      </div>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            <CardTitle>Privacy & Security</CardTitle>
          </div>
          <CardDescription>
            Manage your privacy settings and data protection preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm text-green-700 dark:text-green-400">
              Industry-standard encryption protects your data in transit and at
              rest. Inbox passwords are cryptographically hashed and are never
              stored as plain text.
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-[#372F84]" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>
            Control how and when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Email notifications</Label>
              <p className="text-xs text-muted-foreground">
                Receive notifications when new emails arrive
              </p>
            </div>
            <Button
              variant={settings.emailNotifications ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setSettings((prev) => ({
                  ...prev,
                  emailNotifications: !prev.emailNotifications,
                }))
              }
            >
              {settings.emailNotifications ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Limits */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#372F84]" />
            <CardTitle>Account Limits</CardTitle>
          </div>
          <CardDescription>
            Your current subscription limits and usage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Subscription</span>
                <Badge variant="outline">Free Plan</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Maximum inboxes</span>
                <span className="text-sm text-muted-foreground">
                  {settings.maxInboxes}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Inbox lifetime</span>
                <span className="text-sm text-muted-foreground">
                  Up to 1 week
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Custom domains</span>
                <Badge variant="outline">Coming Soon</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Password protection</span>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API access</span>
                <Badge variant="outline">Coming Soon</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-[#372F84]" />
            <CardTitle>Data Management</CardTitle>
          </div>
          <CardDescription>Export or delete your account data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Export all your data</Label>
            <p className="text-xs text-muted-foreground">
              Download a JSON file containing all your inboxes and emails.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleExportData}
            className="w-full sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </CardContent>
      </Card>

      {/* API Keys (Premium Feature Preview) */}
      <Card className="opacity-60">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-gray-500" />
            <CardTitle className="flex items-center gap-2">
              API Keys
              <Badge variant="secondary">Premium</Badge>
            </CardTitle>
          </div>
          <CardDescription>
            Generate API keys for programmatic access to your inboxes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Upgrade to premium to access API functionality and integrate genmail
            with your applications.
          </p>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button onClick={handleSaveSettings} className="px-8">
          Save Settings
        </Button>
      </div>
    </div>
  );
}
