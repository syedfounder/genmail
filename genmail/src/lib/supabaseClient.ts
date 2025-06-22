import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Helper function to validate and clean URL
function validateSupabaseUrl(url: string): string {
  if (!url) {
    throw new Error("Supabase URL is required");
  }

  // Remove any potential "value: " or "Value: " prefix that might be causing issues
  const cleanUrl = url.replace(/^value:\s*/i, "").trim();

  // Ensure it starts with https://
  if (!cleanUrl.startsWith("https://")) {
    throw new Error(`Invalid Supabase URL format: ${cleanUrl}`);
  }

  // Validate it's a proper URL
  try {
    new URL(cleanUrl);
    return cleanUrl;
  } catch {
    throw new Error(`Invalid Supabase URL: ${cleanUrl}`);
  }
}

let _supabase: SupabaseClient | null = null;

// Lazy initialization function
function getSupabaseClient(): SupabaseClient {
  if (_supabase) {
    return _supabase;
  }

  // Supabase configuration
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Validate environment variables
  if (!supabaseUrl) {
    throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!supabaseAnonKey) {
    throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  // Validate and clean the URL
  const cleanSupabaseUrl = validateSupabaseUrl(supabaseUrl);

  // Create the Supabase client
  _supabase = createClient(cleanSupabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      detectSessionInUrl: true,
      flowType: "pkce",
    },
  });

  return _supabase;
}

// Export the lazy client getter
export const supabase = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    const client = getSupabaseClient();
    return client[prop as keyof SupabaseClient];
  },
});

// Export the client as default for convenience
export default supabase;
