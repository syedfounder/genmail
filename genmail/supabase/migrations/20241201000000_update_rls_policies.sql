-- Migration: Update RLS policies for authenticated users
-- Supports both anonymous temporary emails and authenticated user access

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access to active inboxes" ON public.inboxes;
DROP POLICY IF EXISTS "Allow public insert of new inboxes" ON public.inboxes;
DROP POLICY IF EXISTS "Allow public read access to emails" ON public.emails;
DROP POLICY IF EXISTS "Allow public insert of new emails" ON public.emails;
DROP POLICY IF EXISTS "Allow public read access to attachments" ON public.attachments;
DROP POLICY IF EXISTS "Allow public insert of new attachments" ON public.attachments;

-- ====================================
-- INBOX POLICIES
-- ====================================

-- Allow users to see their own inboxes OR anonymous active inboxes with inbox_id access
CREATE POLICY "Users can read own inboxes or anonymous inboxes" ON public.inboxes
    FOR SELECT USING (
        -- Authenticated users can see their own inboxes
        (auth.uid()::text = user_id) OR
        -- Anonymous users can access active inboxes (temporary emails)
        (user_id IS NULL AND is_active = true AND expires_at > NOW())
    );

-- Allow users to create inboxes (authenticated get user_id, anonymous get NULL)
CREATE POLICY "Users can create inboxes" ON public.inboxes
    FOR INSERT WITH CHECK (
        -- Authenticated users must set their user_id
        (auth.uid() IS NOT NULL AND auth.uid()::text = user_id) OR
        -- Anonymous users create temporary inboxes (user_id = NULL)
        (auth.uid() IS NULL AND user_id IS NULL)
    );

-- Allow users to update their own inboxes
CREATE POLICY "Users can update own inboxes" ON public.inboxes
    FOR UPDATE USING (
        auth.uid()::text = user_id
    );

-- Allow users to delete their own inboxes
CREATE POLICY "Users can delete own inboxes" ON public.inboxes
    FOR DELETE USING (
        auth.uid()::text = user_id
    );

-- ====================================
-- EMAIL POLICIES  
-- ====================================

-- Allow users to read emails from inboxes they have access to
CREATE POLICY "Users can read accessible emails" ON public.emails
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.inboxes i
            WHERE i.id = emails.inbox_id 
            AND (
                -- User owns the inbox
                (auth.uid()::text = i.user_id) OR
                -- Anonymous access to active temporary inboxes
                (i.user_id IS NULL AND i.is_active = true AND i.expires_at > NOW())
            )
        )
    );

-- Allow system to insert emails (webhook/API)
CREATE POLICY "System can insert emails" ON public.emails
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.inboxes i
            WHERE i.id = inbox_id 
            AND i.is_active = true 
            AND i.expires_at > NOW()
        )
    );

-- Allow users to update read status of their emails
CREATE POLICY "Users can update accessible emails" ON public.emails
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.inboxes i
            WHERE i.id = emails.inbox_id 
            AND (
                (auth.uid()::text = i.user_id) OR
                (i.user_id IS NULL AND i.is_active = true AND i.expires_at > NOW())
            )
        )
    );

-- ====================================
-- ATTACHMENT POLICIES
-- ====================================

-- Allow users to read attachments from accessible emails
CREATE POLICY "Users can read accessible attachments" ON public.attachments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.emails e
            JOIN public.inboxes i ON e.inbox_id = i.id
            WHERE e.id = attachments.email_id 
            AND (
                (auth.uid()::text = i.user_id) OR
                (i.user_id IS NULL AND i.is_active = true AND i.expires_at > NOW())
            )
        )
    );

-- Allow system to insert attachments
CREATE POLICY "System can insert attachments" ON public.attachments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.emails e
            JOIN public.inboxes i ON e.inbox_id = i.id
            WHERE e.id = email_id 
            AND i.is_active = true 
            AND i.expires_at > NOW()
        )
    );

-- ====================================
-- INBOX STATS POLICIES
-- ====================================

-- Users can only see stats for inboxes they own
CREATE POLICY "Users can read own inbox stats" ON public.inbox_stats
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.inboxes i
            WHERE i.id = inbox_stats.inbox_id 
            AND auth.uid()::text = i.user_id
        )
    );

-- System can insert stats
CREATE POLICY "System can insert inbox stats" ON public.inbox_stats
    FOR INSERT WITH CHECK (true);

-- ====================================
-- SPONSORS TABLE RLS (if exists)
-- ====================================

-- Enable RLS on sponsors table if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'sponsors') THEN
        -- Enable RLS
        ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Allow public read access to active sponsors" ON public.sponsors;
        DROP POLICY IF EXISTS "Only service role can manage sponsors" ON public.sponsors;
        
        -- Allow public read access to active sponsors
        CREATE POLICY "Allow public read access to active sponsors" ON public.sponsors
            FOR SELECT USING (
                is_active = true AND
                (start_date IS NULL OR start_date <= CURRENT_DATE) AND
                (end_date IS NULL OR end_date >= CURRENT_DATE)
            );
        
        -- Only service role can manage sponsors
        CREATE POLICY "Only service role can manage sponsors" ON public.sponsors
            FOR ALL USING (auth.role() = 'service_role');
    END IF;
END $$;

-- ====================================
-- ADDITIONAL SECURITY FUNCTION
-- ====================================

-- Function to check if user has access to an inbox
CREATE OR REPLACE FUNCTION user_has_inbox_access(inbox_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.inboxes
        WHERE id = inbox_uuid
        AND (
            -- User owns the inbox
            (auth.uid()::text = user_id) OR
            -- Anonymous access to active temporary inbox
            (user_id IS NULL AND is_active = true AND expires_at > NOW())
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 