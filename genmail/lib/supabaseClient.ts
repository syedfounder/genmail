import { createClient } from "@supabase/supabase-js";

// Helper function to validate and clean URL
function validateSupabaseUrl(url: string): string {
  if (!url) {
    throw new Error("Supabase URL is required");
  }

  // Remove any potential "value: " or "Value: " prefix that might be causing issues
  // Also remove any quotes, extra whitespace, and other potential formatting issues
  const cleanUrl = url
    .replace(/^value:\s*/i, "")
    .replace(/^["']|["']$/g, "") // Remove quotes
    .replace(/\s+/g, "") // Remove all whitespace
    .trim();

  if (!cleanUrl) {
    throw new Error("Supabase URL is empty after cleaning");
  }

  // Ensure it starts with https://
  if (!cleanUrl.startsWith("https://")) {
    throw new Error(
      `Invalid Supabase URL format - must start with https://: ${cleanUrl}`
    );
  }

  // Validate it's a proper URL with better error handling
  try {
    const urlObj = new URL(cleanUrl);
    // Additional validation for Supabase URLs
    if (!urlObj.hostname.includes("supabase")) {
      console.warn(
        `Warning: URL doesn't appear to be a Supabase URL: ${cleanUrl}`
      );
    }
    return cleanUrl;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(
      `Invalid Supabase URL - failed to parse: ${cleanUrl}. Error: ${errorMessage}`
    );
  }
}

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Validate environment variables
if (!supabaseUrl) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}

if (!supabaseAnonKey) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

// Validate and clean the URL
const cleanSupabaseUrl = validateSupabaseUrl(supabaseUrl);

// Create and export the Supabase client
export const supabase = createClient(cleanSupabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});

// Export the client as default for convenience
export default supabase;
