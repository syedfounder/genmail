import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AttachmentCleanupPayload {
  storage_path: string;
  attachment_id: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role
    const supabaseServiceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Handle POST requests for manual cleanup
    if (req.method === "POST") {
      const payload: AttachmentCleanupPayload = await req.json();

      console.log(
        `Cleaning up attachment: ${payload.attachment_id}, path: ${payload.storage_path}`
      );

      // Delete the file from storage
      const { error } = await supabaseServiceClient.storage
        .from("email-attachments")
        .remove([payload.storage_path]);

      if (error) {
        console.error(
          `Failed to delete storage file ${payload.storage_path}:`,
          error
        );
        return new Response(
          JSON.stringify({
            success: false,
            error: error.message,
            attachment_id: payload.attachment_id,
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      console.log(`Successfully deleted storage file: ${payload.storage_path}`);

      return new Response(
        JSON.stringify({
          success: true,
          attachment_id: payload.attachment_id,
          storage_path: payload.storage_path,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Handle GET requests for batch cleanup (called by scheduler)
    if (req.method === "GET") {
      console.log("Starting scheduled attachment cleanup...");

      // Call the database function to get cleanup results
      const { data: cleanupResult, error: cleanupError } =
        await supabaseServiceClient.rpc("scheduled_attachment_cleanup");

      if (cleanupError) {
        console.error("Cleanup function error:", cleanupError);
        return new Response(
          JSON.stringify({ success: false, error: cleanupError.message }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      console.log("Cleanup completed:", cleanupResult);

      return new Response(
        JSON.stringify({
          success: true,
          result: cleanupResult,
          timestamp: new Date().toISOString(),
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Handle unsupported methods
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Internal server error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

/* 
Usage:

1. Manual cleanup (POST request):
   POST /functions/v1/attachment-cleanup
   Body: { "storage_path": "user123/inbox456/email789/file.pdf", "attachment_id": "uuid" }

2. Scheduled cleanup (GET request):
   GET /functions/v1/attachment-cleanup
   
3. Set up a cron job or scheduler to call this function periodically:
   - Every hour: GET https://your-project.supabase.co/functions/v1/attachment-cleanup
   - Or use GitHub Actions, Vercel Cron, etc.

4. For PostgreSQL NOTIFY/LISTEN integration, you can set up a separate service
   that listens for 'attachment_cleanup' notifications and calls this function.
*/
