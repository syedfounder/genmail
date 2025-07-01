-- Migration: Fix Rate Limiting and Enable RLS with IP-based Rate Limiting
-- This migration fixes the rate limiting issues and enables RLS properly

-- =================================================================
-- STEP 1: Clean up and fix the rate limiting infrastructure
-- =================================================================

-- Drop any existing triggers and functions
DROP TRIGGER IF EXISTS trigger_record_inbox_rate_limit ON public.inboxes;
DROP TRIGGER IF EXISTS on_inbox_created_record_ip ON public.inboxes;
DROP FUNCTION IF EXISTS public.trigger_record_rate_limit() CASCADE;
DROP FUNCTION IF EXISTS public.record_inbox_creation() CASCADE;

-- Create a helper function to set the client IP context
CREATE OR REPLACE FUNCTION public.set_client_ip(ip_address TEXT)
RETURNS VOID AS $$
BEGIN
    PERFORM set_config('app.current_ip', ip_address, true);
END;
$$ LANGUAGE plpgsql;

-- Create a new, simpler trigger function that gets IP from a custom setting
-- The API will set this setting before inserting
CREATE OR REPLACE FUNCTION public.record_inbox_creation()
RETURNS TRIGGER AS $$
DECLARE
    client_ip_text TEXT;
    client_ip INET;
BEGIN
    -- Only record for free tier inboxes
    IF NEW.subscription_tier = 'free' THEN
        -- Get IP from custom setting (will be set by API)
        client_ip_text := current_setting('app.current_ip', true);
        
        -- If no IP is set, try to extract from headers, otherwise default
        IF client_ip_text IS NULL OR client_ip_text = '' THEN
            client_ip_text := COALESCE(
                split_part(current_setting('request.headers', true)::json->>'x-forwarded-for', ',', 1),
                current_setting('request.headers', true)::json->>'x-real-ip',
                '127.0.0.1'
            );
        END IF;
        
        -- Convert to INET type
        BEGIN
            client_ip := client_ip_text::inet;
        EXCEPTION WHEN OTHERS THEN
            client_ip := '127.0.0.1'::inet;
        END;
        
        -- Record the creation
        INSERT INTO public.inbox_rate_limits (ip_address, inbox_id)
        VALUES (client_ip, NEW.id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger with the correct function
CREATE TRIGGER on_inbox_created_record_ip
    AFTER INSERT ON public.inboxes
    FOR EACH ROW EXECUTE FUNCTION public.record_inbox_creation();

-- =================================================================
-- STEP 2: Enable RLS and create proper policies
-- =================================================================

-- Enable RLS on the inboxes table
ALTER TABLE public.inboxes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow rate-limited inbox creation" ON public.inboxes;
DROP POLICY IF EXISTS "Allow public read access to active inboxes" ON public.inboxes;
DROP POLICY IF EXISTS "Allow users to read their own inboxes" ON public.inboxes;
DROP POLICY IF EXISTS "Allow public read of active, anonymous inboxes" ON public.inboxes;

-- Policy 1: Allow authenticated users to manage their own inboxes
CREATE POLICY "Allow users to manage their own inboxes" ON public.inboxes
FOR ALL
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

-- Policy 2: Allow reading of active, anonymous inboxes
CREATE POLICY "Allow public read of active anonymous inboxes" ON public.inboxes
FOR SELECT
USING (user_id IS NULL AND is_active = true AND expires_at > NOW());

-- Policy 3: Rate-limited INSERT for free tier inboxes
-- This policy enforces rate limiting at the database level
CREATE POLICY "Rate limited inbox creation" ON public.inboxes
FOR INSERT
WITH CHECK (
    -- Allow premium tier without rate limiting
    subscription_tier = 'premium' 
    OR 
    -- For free tier, check rate limit
    (
        subscription_tier = 'free' 
        AND 
        public.check_inbox_rate_limit(
            COALESCE(
                current_setting('app.current_ip', true)::inet,
                split_part(
                    COALESCE(
                        current_setting('request.headers', true)::json->>'x-forwarded-for',
                        current_setting('request.headers', true)::json->>'x-real-ip',
                        '127.0.0.1'
                    ), 
                    ',', 1
                )::inet
            )
        )
    )
);

-- Policy 4: Allow service_role to bypass rate limiting (for admin operations)
CREATE POLICY "Allow service role full access" ON public.inboxes
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- =================================================================
-- STEP 3: Grant necessary permissions
-- =================================================================

-- Grant usage on the rate limiting table and functions
GRANT USAGE ON TABLE public.inbox_rate_limits TO anon, authenticated;
GRANT SELECT ON TABLE public.inbox_rate_limits TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_inbox_rate_limit(inet) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_client_ip(text) TO anon, authenticated;

-- Allow RLS on rate limits table for service role only
ALTER TABLE public.inbox_rate_limits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow service role access" ON public.inbox_rate_limits;
CREATE POLICY "Allow service role access" ON public.inbox_rate_limits
FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- =================================================================
-- SECURITY CRITICAL: Revoke dangerous grants on rate limiting table
-- =================================================================

-- SECURITY FIX: Remove broad grants that could expose IP addresses
-- The previous grants allowed anon/authenticated users to SELECT from inbox_rate_limits
-- This is a privacy violation as it exposes IP addresses
REVOKE ALL ON TABLE public.inbox_rate_limits FROM anon, authenticated, public;

-- Only allow service_role to access the rate limiting table directly
GRANT ALL ON TABLE public.inbox_rate_limits TO service_role;

-- Keep function access for rate limiting checks (these are safe)
GRANT EXECUTE ON FUNCTION public.check_inbox_rate_limit(inet) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_client_ip(text) TO anon, authenticated;

-- =================================================================
-- STEP 4: Create monitoring views for debugging
-- =================================================================

-- Refresh the monitoring views
DROP VIEW IF EXISTS public.rate_limit_stats;
DROP VIEW IF EXISTS public.rate_limit_violations;

CREATE VIEW public.rate_limit_stats AS
SELECT 
    ip_address, 
    COUNT(*) as created_last_hour, 
    MAX(created_at) as last_creation,
    CASE WHEN COUNT(*) >= 5 THEN 'BLOCKED' ELSE 'ALLOWED' END as status
FROM public.inbox_rate_limits
WHERE created_at > (NOW() - INTERVAL '1 hour')
GROUP BY ip_address 
ORDER BY created_last_hour DESC;

CREATE VIEW public.rate_limit_violations AS
SELECT 
    ip_address, 
    COUNT(*) as violation_count, 
    MAX(created_at) as latest_attempt,
    MIN(created_at) as first_attempt_in_hour
FROM public.inbox_rate_limits
WHERE created_at > (NOW() - INTERVAL '1 hour')
GROUP BY ip_address 
HAVING COUNT(*) > 5 
ORDER BY violation_count DESC;

-- =================================================================
-- STEP 4.5: Enable RLS on monitoring views (SECURITY CRITICAL)
-- =================================================================

-- Enable RLS on monitoring views to prevent IP address exposure
-- These views contain sensitive IP address data that must be protected

-- Enable RLS on rate_limit_stats view
ALTER VIEW public.rate_limit_stats SET (security_barrier = true);
-- Note: Views don't support ALTER TABLE ... ENABLE ROW LEVEL SECURITY
-- But we can use security_barrier and restrict access via grants

-- Enable RLS on rate_limit_violations view  
ALTER VIEW public.rate_limit_violations SET (security_barrier = true);

-- Revoke all public access to rate limiting views
REVOKE ALL ON public.rate_limit_stats FROM anon, authenticated, public;
REVOKE ALL ON public.rate_limit_violations FROM anon, authenticated, public;

-- Grant access only to service_role for monitoring views
GRANT SELECT ON public.rate_limit_stats TO service_role;
GRANT SELECT ON public.rate_limit_violations TO service_role;

-- =================================================================
-- STEP 5: Performance optimization
-- =================================================================

-- Create index for fast rate limit lookups
CREATE INDEX IF NOT EXISTS idx_inbox_rate_limits_ip_time 
ON public.inbox_rate_limits (ip_address, created_at DESC);

-- Create index for cleanup operations  
CREATE INDEX IF NOT EXISTS idx_inbox_rate_limits_cleanup
ON public.inbox_rate_limits (created_at);

-- Add comments for documentation
COMMENT ON POLICY "Rate limited inbox creation" ON public.inboxes IS 'Enforces 5 inbox creations per hour per IP for free tier users';
COMMENT ON FUNCTION public.record_inbox_creation() IS 'Records inbox creation for rate limiting, gets IP from app.current_ip setting';
COMMENT ON VIEW public.rate_limit_stats IS 'Shows current rate limiting status by IP address - SERVICE_ROLE ACCESS ONLY';
COMMENT ON VIEW public.rate_limit_violations IS 'Shows IPs that have exceeded the rate limit in the last hour - SERVICE_ROLE ACCESS ONLY';
COMMENT ON TABLE public.inbox_rate_limits IS 'Rate limiting tracking table - contains sensitive IP data, SERVICE_ROLE ACCESS ONLY';
COMMENT ON FUNCTION public.cleanup_old_rate_limits() IS 'Cleans up rate limiting records older than 24 hours - SERVICE_ROLE ACCESS ONLY';
COMMENT ON FUNCTION public.detect_suspicious_activity() IS 'Detects suspicious rate limiting patterns - SERVICE_ROLE ACCESS ONLY';

-- =================================================================
-- STEP 6: Automatic cleanup of old rate limit records
-- =================================================================

-- Function to clean up old rate limit records (older than 24 hours)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.inbox_rate_limits 
    WHERE created_at < NOW() - INTERVAL '24 hours';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to service role
GRANT EXECUTE ON FUNCTION public.cleanup_old_rate_limits() TO service_role;

-- =================================================================
-- STEP 7: Security monitoring function
-- =================================================================

-- Function to detect suspicious rate limiting patterns
CREATE OR REPLACE FUNCTION public.detect_suspicious_activity()
RETURNS TABLE (
    ip_address INET,
    request_count BIGINT,
    first_request TIMESTAMPTZ,
    last_request TIMESTAMPTZ,
    threat_level TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        rl.ip_address,
        COUNT(*) as request_count,
        MIN(rl.created_at) as first_request,
        MAX(rl.created_at) as last_request,
        CASE 
            WHEN COUNT(*) >= 20 THEN 'HIGH'
            WHEN COUNT(*) >= 10 THEN 'MEDIUM'
            WHEN COUNT(*) >= 5 THEN 'LOW'
            ELSE 'NORMAL'
        END as threat_level
    FROM public.inbox_rate_limits rl
    WHERE rl.created_at > NOW() - INTERVAL '1 hour'
    GROUP BY rl.ip_address
    HAVING COUNT(*) >= 5
    ORDER BY request_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to service role
GRANT EXECUTE ON FUNCTION public.detect_suspicious_activity() TO service_role;

-- Add comments for documentation 