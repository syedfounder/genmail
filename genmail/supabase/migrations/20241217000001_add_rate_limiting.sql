-- Migration: Add Rate Limiting for Inbox Creation
-- PRD Section 6: Privacy & Abuse Prevention
-- Limit free inbox creations to 5/hour per IP

-- ====================================
-- RATE LIMITING INFRASTRUCTURE
-- ====================================

-- Create rate limiting table for tracking IP-based inbox creation
CREATE TABLE public.inbox_rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_address INET NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    user_agent TEXT,
    inbox_id UUID REFERENCES public.inboxes(id) ON DELETE CASCADE,
    
    CONSTRAINT valid_ip CHECK (ip_address IS NOT NULL)
);

-- Create indexes for efficient rate limit queries
CREATE INDEX idx_rate_limits_ip_created 
ON public.inbox_rate_limits(ip_address, created_at DESC);

CREATE INDEX idx_rate_limits_created_at 
ON public.inbox_rate_limits(created_at);

CREATE INDEX idx_rate_limits_inbox_id
ON public.inbox_rate_limits(inbox_id);

-- ====================================
-- RATE LIMITING FUNCTIONS
-- ====================================

-- Function to check if IP can create inbox (5 per hour limit)
CREATE OR REPLACE FUNCTION check_inbox_rate_limit(client_ip INET)
RETURNS BOOLEAN AS $$
DECLARE
    recent_count INTEGER;
    rate_limit_window INTERVAL := '1 hour';
    max_inboxes_per_hour INTEGER := 5;
BEGIN
    -- Count inboxes created by this IP in the last hour
    SELECT COUNT(*) INTO recent_count
    FROM public.inbox_rate_limits
    WHERE ip_address = client_ip
    AND created_at > (NOW() - rate_limit_window);
    
    -- Return true if under the limit
    RETURN recent_count < max_inboxes_per_hour;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record inbox creation for rate limiting
CREATE OR REPLACE FUNCTION record_inbox_creation(client_ip INET, client_user_agent TEXT, created_inbox_id UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.inbox_rate_limits (ip_address, user_agent, inbox_id)
    VALUES (client_ip, client_user_agent, created_inbox_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup old rate limit records (older than 24 hours)
CREATE OR REPLACE FUNCTION cleanup_rate_limit_records()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.inbox_rate_limits 
    WHERE created_at < (NOW() - INTERVAL '24 hours');
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================
-- ROW LEVEL SECURITY POLICIES
-- ====================================

-- Enable RLS on rate limits table
ALTER TABLE public.inbox_rate_limits ENABLE ROW LEVEL SECURITY;

-- Policy: Allow reading rate limit data for IP checking
CREATE POLICY "Allow rate limit checks" ON public.inbox_rate_limits
    FOR SELECT USING (true);

-- Policy: Allow inserting rate limit records
CREATE POLICY "Allow rate limit recording" ON public.inbox_rate_limits
    FOR INSERT WITH CHECK (true);

-- ====================================
-- UPDATED INBOX POLICIES
-- ====================================

-- Drop existing inbox insert policy and replace with rate-limited version
DROP POLICY IF EXISTS "Allow public insert of new inboxes" ON public.inboxes;

-- New policy: Allow inbox creation only if rate limit is not exceeded
-- Note: This requires the application to pass IP address context
CREATE POLICY "Allow rate-limited inbox creation" ON public.inboxes
    FOR INSERT WITH CHECK (
        -- Allow premium tier inboxes without rate limiting
        subscription_tier = 'premium'
        OR
        -- For free tier, check rate limit using a custom function
        -- The IP will need to be passed via application context
        check_inbox_rate_limit(
            COALESCE(
                current_setting('request.headers', true)::json->>'x-forwarded-for',
                current_setting('request.headers', true)::json->>'x-real-ip',
                '127.0.0.1'
            )::inet
        )
    );

-- ====================================
-- TRIGGER FOR AUTOMATIC RATE LIMIT RECORDING
-- ====================================

-- Function to automatically record rate limit when inbox is created
CREATE OR REPLACE FUNCTION trigger_record_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
    client_ip INET;
    client_user_agent TEXT;
BEGIN
    -- Only record for free tier inboxes
    IF NEW.subscription_tier = 'free' THEN
        -- Extract IP from request headers
        client_ip := COALESCE(
            current_setting('request.headers', true)::json->>'x-forwarded-for',
            current_setting('request.headers', true)::json->>'x-real-ip',
            '127.0.0.1'
        )::inet;
        
        -- Extract user agent
        client_user_agent := current_setting('request.headers', true)::json->>'user-agent';
        
        -- Record the creation
        PERFORM record_inbox_creation(client_ip, client_user_agent, NEW.id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically record rate limits
CREATE TRIGGER trigger_record_inbox_rate_limit
    AFTER INSERT ON public.inboxes
    FOR EACH ROW EXECUTE FUNCTION trigger_record_rate_limit();

-- ====================================
-- HELPER VIEWS FOR MONITORING
-- ====================================

-- View to monitor current rate limiting status
CREATE OR REPLACE VIEW public.rate_limit_stats AS
SELECT 
    ip_address,
    COUNT(*) as inboxes_created_last_hour,
    MAX(created_at) as last_creation,
    5 - COUNT(*) as remaining_quota
FROM public.inbox_rate_limits 
WHERE created_at > (NOW() - INTERVAL '1 hour')
GROUP BY ip_address
ORDER BY inboxes_created_last_hour DESC;

-- View to show rate limit violations (for monitoring)
CREATE OR REPLACE VIEW public.rate_limit_violations AS
SELECT 
    ip_address,
    COUNT(*) as violation_count,
    user_agent,
    MAX(created_at) as latest_attempt
FROM public.inbox_rate_limits 
WHERE created_at > (NOW() - INTERVAL '1 hour')
GROUP BY ip_address, user_agent
HAVING COUNT(*) > 5
ORDER BY violation_count DESC;

-- ====================================
-- COMMENTS AND DOCUMENTATION
-- ====================================

COMMENT ON TABLE public.inbox_rate_limits IS 'Tracks inbox creation for IP-based rate limiting (5 per hour for free tier)';
COMMENT ON FUNCTION check_inbox_rate_limit(INET) IS 'Returns true if IP can create another inbox within rate limit';
COMMENT ON FUNCTION record_inbox_creation(INET, TEXT, UUID) IS 'Records inbox creation for rate limiting purposes';
COMMENT ON FUNCTION cleanup_rate_limit_records() IS 'Removes rate limit records older than 24 hours';
COMMENT ON VIEW public.rate_limit_stats IS 'Shows current rate limiting status per IP';
COMMENT ON VIEW public.rate_limit_violations IS 'Shows IPs that have exceeded rate limits'; 