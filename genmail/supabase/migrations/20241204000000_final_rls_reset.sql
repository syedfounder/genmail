-- Migration: Final Reset of All RLS Policies and Rate Limiting Infrastructure
-- This migration completely removes ALL related policies, functions, triggers, and tables,
-- then rebuilds them from scratch to match the working production security model.

-- =================================================================
-- STEP 1: COMPLETE AND IRREVERSIBLE CLEANUP
-- This section drops everything, using CASCADE to handle dependencies.
-- =================================================================

-- Drop policies from all tables
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
DROP POLICY IF EXISTS "Allow public read access to active inboxes" ON public.inboxes;

DROP POLICY IF EXISTS "Users can read accessible emails" ON public.emails;
DROP POLICY IF EXISTS "System can insert emails" ON public.emails;
DROP POLICY IF EXISTS "Users can update accessible emails" ON public.emails;
DROP POLICY IF EXISTS "Allow public read access to emails" ON public.emails;
DROP POLICY IF EXISTS "Allow public insert of new emails" ON public.emails;

DROP POLICY IF EXISTS "Users can read accessible attachments" ON public.attachments;
DROP POLICY IF EXISTS "System can insert attachments" ON public.attachments;
DROP POLICY IF EXISTS "Allow public read access to attachments" ON public.attachments;
DROP POLICY IF EXISTS "Allow public insert of new attachments" ON public.attachments;

-- Drop functions, triggers, views, and tables
DROP FUNCTION IF EXISTS public.check_inbox_rate_limit(inet) CASCADE;
DROP FUNCTION IF EXISTS public.record_inbox_creation() CASCADE;
DROP TABLE IF EXISTS public.inbox_rate_limits CASCADE;

-- =================================================================
-- STEP 2: REBUILD INFRASTRUCTURE FROM SCRATCH
-- =================================================================

-- Create the rate-limiting table
CREATE TABLE public.inbox_rate_limits (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    ip_address INET NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    inbox_id UUID REFERENCES public.inboxes(id) ON DELETE CASCADE
);
CREATE INDEX idx_rate_limits_ip_created ON public.inbox_rate_limits(ip_address, created_at DESC);
COMMENT ON TABLE public.inbox_rate_limits IS 'Tracks inbox creation for IP-based rate limiting.';

-- Create the rate-limiting check function, called by the API
CREATE OR REPLACE FUNCTION public.check_inbox_rate_limit(client_ip INET)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM public.inbox_rate_limits WHERE ip_address = client_ip AND created_at > NOW() - interval '1 hour') < 5;
END;
$$ LANGUAGE plpgsql;
COMMENT ON FUNCTION public.check_inbox_rate_limit(INET) IS 'Returns true if an IP has created fewer than 5 inboxes in the last hour.';

-- Create the trigger to automatically record new inboxes
CREATE OR REPLACE FUNCTION public.record_inbox_creation()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.subscription_tier = 'free' THEN
        INSERT INTO public.inbox_rate_limits (ip_address, inbox_id)
        SELECT split_part(current_setting('request.headers', true)::json->>'x-forwarded-for', ',', 1)::inet, NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_inbox_created_record_ip
    AFTER INSERT ON public.inboxes
    FOR EACH ROW EXECUTE FUNCTION public.record_inbox_creation();

-- Create the monitoring views you mentioned
CREATE VIEW public.rate_limit_stats AS
SELECT ip_address, COUNT(*) as created_last_hour, MAX(created_at) as last_creation
FROM public.inbox_rate_limits
WHERE created_at > (NOW() - INTERVAL '1 hour')
GROUP BY ip_address ORDER BY created_last_hour DESC;

CREATE VIEW public.rate_limit_violations AS
SELECT ip_address, COUNT(*) as violation_count, MAX(created_at) as latest_attempt
FROM public.inbox_rate_limits
WHERE created_at > (NOW() - INTERVAL '1 hour')
GROUP BY ip_address HAVING COUNT(*) > 5 ORDER BY violation_count DESC;

-- =================================================================
-- STEP 3: REBUILD RLS POLICIES FROM SCRATCH
-- =================================================================

ALTER TABLE public.inboxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;

-- The API uses a service_role key, so insert/update/delete bypasses RLS.
-- These SELECT policies are for client-side access and security.

-- INBOXES:
CREATE POLICY "Allow users to read their own inboxes" ON public.inboxes
FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Allow public read of active, anonymous inboxes" ON public.inboxes
FOR SELECT USING (user_id IS NULL AND is_active = true AND expires_at > NOW());

-- EMAILS:
CREATE POLICY "Allow users to read emails in their own inboxes" ON public.emails
FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.inboxes i WHERE i.id = emails.inbox_id AND i.user_id = auth.uid()::text
));

CREATE POLICY "Allow public read of emails in anonymous inboxes" ON public.emails
FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.inboxes i WHERE i.id = emails.inbox_id AND i.user_id IS NULL AND i.is_active = true AND i.expires_at > NOW()
)); 