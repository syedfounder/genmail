"use client";

import { createClient } from "@supabase/supabase-js";

// Simple client configuration without complex proxy setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase environment variables are missing");
}

// Create the client directly
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});

export default supabase;
