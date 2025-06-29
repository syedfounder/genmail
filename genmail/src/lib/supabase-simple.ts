"use client";

import { createClient } from "@supabase/supabase-js";

// Helper function to validate and clean URL
function validateSupabaseUrl(url: string | undefined): string {
  if (!url) {
    throw new Error("Supabase URL is required");
  }
  const cleanUrl = url.replace(/^value:\s*/i, "").trim();
  try {
    new URL(cleanUrl);
    return cleanUrl;
  } catch {
    throw new Error(`Invalid Supabase URL: ${cleanUrl}`);
  }
}

// Simple client configuration without complex proxy setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Throw an error during build if env vars are missing
  throw new Error("Supabase environment variables are missing");
}

// Create the client directly
export const supabase = createClient(
  validateSupabaseUrl(supabaseUrl),
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      detectSessionInUrl: true,
      flowType: "pkce",
    },
  }
);

export default supabase;
