-- Migration: Reimplement Rate Limiting and RLS from Scratch
-- Timestamp: 2024-07-31 12:00:00Z
-- This migration completely removes all previous rate-limiting artifacts and creates a new, clean system.

-- =================================================================
-- STEP 1: COMPLETE CLEANUP of all old, broken components (CORRECT ORDER)
-- =================================================================

-- 1a. Drop views that might depend on the tables/functions below
DROP VIEW IF EXISTS public.rate_limit_stats;
DROP VIEW IF EXISTS public.rate_limit_violations;

-- 1b. Drop triggers from tables
DROP TRIGGER IF EXISTS trigger_record_inbox_rate_limit ON public.inboxes;
DROP TRIGGER IF EXISTS on_inbox_created_record_ip ON public.inboxes;

-- 1c. Drop all RLS policies that might depend on the functions below
DROP POLICY IF EXISTS "Allow anonymous inbox creation with rate limit" ON public.inboxes;
DROP POLICY IF EXISTS "Allow authenticated users to manage their inboxes" ON public.inboxes;
DROP POLICY IF EXISTS "Allow reading of active anonymous inboxes" ON public.inboxes;
DROP POLICY IF EXISTS "Users can read own inboxes or anonymous inboxes" ON public.inboxes;
DROP POLICY IF EXISTS "Users can create inboxes" ON public.inboxes;
DROP POLICY IF EXISTS "Users can update own inboxes" ON public.inboxes;
DROP POLICY IF EXISTS "Users can delete own inboxes" ON public.inboxes;
DROP POLICY IF EXISTS "Allow rate-limited inbox creation" ON public.inboxes;
DROP POLICY IF EXISTS "Allow public insert of new inboxes" ON public.inboxes;
DROP POLICY IF EXISTS "Allow anonymous, rate-limited creation" ON public.inboxes;
DROP POLICY IF EXISTS "Allow anonymous insert with rate limit" ON public.inboxes;

-- 1d. Now that policies are gone, drop the functions they depended on
DROP FUNCTION IF EXISTS public.trigger_record_rate_limit();
DROP FUNCTION IF EXISTS public.check_inbox_rate_limit(inet);
DROP FUNCTION IF EXISTS public.record_inbox_creation(inet, text, uuid);
DROP FUNCTION IF EXISTS public.record_inbox_creation();
DROP FUNCTION IF EXISTS public.cleanup_rate_limit_records();
DROP FUNCTION IF EXISTS public.is_rate_limited(TEXT, TEXT, INT, INTERVAL);
DROP FUNCTION IF EXISTS public.is_rate_limited(TEXT);
DROP FUNCTION IF EXISTS public.user_has_inbox_access(uuid);

-- 1e. Finally, drop the tables
DROP TABLE IF EXISTS public.inbox_rate_limits;
DROP TABLE IF EXISTS public.rate_limit_events;

-- =================================================================
-- STEP 2: REBUILD the rate limiting system cleanly to match production logic
-- =================================================================

-- Create the table to track inbox creation events by IP
CREATE TABLE public.inbox_rate_limits (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    ip_address INET NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    inbox_id UUID REFERENCES public.inboxes(id) ON DELETE CASCADE
);
CREATE INDEX idx_rate_limits_ip_created ON public.inbox_rate_limits(ip_address, created_at DESC);
COMMENT ON TABLE public.inbox_rate_limits IS 'Tracks inbox creation for IP-based rate limiting (5 per hour for anonymous users).';


-- Create the function to check the rate limit for a given IP, matching the old, working function signature.
CREATE OR REPLACE FUNCTION public.check_inbox_rate_limit(client_ip INET)
RETURNS BOOLEAN AS $$
DECLARE
    recent_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO recent_count
    FROM public.inbox_rate_limits
    WHERE ip_address = client_ip
    AND created_at > (NOW() - interval '1 hour');
    RETURN recent_count < 5;
END;
$$ LANGUAGE plpgsql;
COMMENT ON FUNCTION public.check_inbox_rate_limit(INET) IS 'Returns true if an IP has created fewer than 5 inboxes in the last hour. Called via RPC.';


-- Create the trigger function to record a new inbox creation
CREATE OR REPLACE FUNCTION public.record_inbox_creation()
RETURNS TRIGGER AS $$
DECLARE
    client_ip_text TEXT;
BEGIN
    -- This trigger should only apply to free-tier insertions, anonymous or authenticated.
    IF NEW.subscription_tier = 'free' THEN
        client_ip_text := COALESCE(
            current_setting('request.headers', true)::json->>'x-forwarded-for',
            current_setting('request.headers', true)::json->>'x-real-ip',
            '127.0.0.1'
        );
        
        INSERT INTO public.inbox_rate_limits (ip_address, inbox_id)
        VALUES (split_part(client_ip_text, ',', 1)::inet, NEW.id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Attach the trigger to the inboxes table
CREATE TRIGGER on_inbox_created_record_ip
    AFTER INSERT ON public.inboxes
    FOR EACH ROW EXECUTE FUNCTION public.record_inbox_creation();

-- =================================================================
-- STEP 3: REBUILD RLS Policies cleanly
-- =================================================================

-- Enable RLS on all relevant tables if not already enabled
ALTER TABLE public.inboxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inbox_rate_limits ENABLE ROW LEVEL SECURITY;

-- Policy on rate_limits table: only backend service can access
CREATE POLICY "Allow service role access" ON public.inbox_rate_limits
FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');


-- Policies for INBOXES table
-- The production code uses a service_role key, but for defense-in-depth, 
-- we can still have a rate-limiting policy for anonymous inserts.
CREATE POLICY "Allow anonymous insert with rate limit" ON public.inboxes
FOR INSERT TO anon -- Applies only to requests made with the anon key
WITH CHECK (
    public.check_inbox_rate_limit(
        split_part(COALESCE(
            current_setting('request.headers', true)::json->>'x-forwarded-for',
            current_setting('request.headers', true)::json->>'x-real-ip',
            '127.0.0.1'
        ), ',', 1)::inet
    )
);

-- 1. Authenticated users can do anything with their own inboxes.
CREATE POLICY "Allow authenticated users to manage their inboxes" ON public.inboxes
FOR ALL
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

-- 2. Anyone can SELECT active, anonymous inboxes.
CREATE POLICY "Allow reading of active anonymous inboxes" ON public.inboxes
FOR SELECT
USING (user_id IS NULL AND is_active = true AND expires_at > NOW());


-- Policies for EMAILS and ATTACHMENTS (simple permissive policies)
DROP POLICY IF EXISTS "Allow public read access" ON public.emails;
DROP POLICY IF EXISTS "Allow public insert" ON public.emails;
CREATE POLICY "Allow public read access" ON public.emails FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.emails FOR INSERT WITH CHECK (true);


DROP POLICY IF EXISTS "Allow public read access" ON public.attachments;
DROP POLICY IF EXISTS "Allow public insert" ON public.attachments;
CREATE POLICY "Allow public read access" ON public.attachments FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.attachments FOR INSERT WITH CHECK (true); 