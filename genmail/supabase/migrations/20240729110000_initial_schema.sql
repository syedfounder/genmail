-- Genmail Database Schema
-- PRD Section 4: Core Features Implementation
-- Created for Supabase PostgreSQL

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================
-- TABLES
-- ====================================

-- Inboxes table - stores temporary email addresses
CREATE TABLE public.inboxes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email_address VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
    max_emails INTEGER DEFAULT 50 NOT NULL,
    current_email_count INTEGER DEFAULT 0 NOT NULL,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes for performance
    CONSTRAINT valid_email_format CHECK (email_address ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_expiration CHECK (expires_at > created_at),
    CONSTRAINT valid_email_count CHECK (current_email_count >= 0 AND current_email_count <= max_emails)
);

-- Emails table - stores received emails
CREATE TABLE public.emails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inbox_id UUID NOT NULL REFERENCES public.inboxes(id) ON DELETE CASCADE,
    from_address VARCHAR(255) NOT NULL,
    to_address VARCHAR(255) NOT NULL,
    subject TEXT DEFAULT '',
    body TEXT DEFAULT '',
    html_body TEXT DEFAULT '',
    headers JSONB DEFAULT '{}',
    received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    is_read BOOLEAN DEFAULT false NOT NULL,
    message_id VARCHAR(255),
    reply_to VARCHAR(255),
    cc_addresses TEXT[] DEFAULT '{}',
    bcc_addresses TEXT[] DEFAULT '{}',
    priority INTEGER DEFAULT 3 CHECK (priority >= 1 AND priority <= 5),
    spam_score DECIMAL(3,2) DEFAULT 0.0,
    is_spam BOOLEAN DEFAULT false NOT NULL,
    attachment_count INTEGER DEFAULT 0 NOT NULL,
    total_size_bytes INTEGER DEFAULT 0 NOT NULL,
    
    -- Performance indexes
    CONSTRAINT valid_email_addresses CHECK (
        from_address ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND
        to_address ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    ),
    CONSTRAINT valid_spam_score CHECK (spam_score >= 0.0 AND spam_score <= 10.0),
    CONSTRAINT valid_attachment_count CHECK (attachment_count >= 0),
    CONSTRAINT valid_total_size CHECK (total_size_bytes >= 0)
);

-- Attachments table - stores email attachment metadata
CREATE TABLE public.attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email_id UUID NOT NULL REFERENCES public.emails(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    file_size INTEGER NOT NULL,
    file_hash VARCHAR(64) NOT NULL, -- SHA-256 hash for deduplication
    storage_path TEXT NOT NULL,
    download_url TEXT,
    is_allowed BOOLEAN DEFAULT true NOT NULL,
    blocked_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    downloaded_at TIMESTAMP WITH TIME ZONE,
    download_count INTEGER DEFAULT 0 NOT NULL,
    
    -- File restrictions (PRD Section 4)
    CONSTRAINT valid_file_size CHECK (file_size > 0 AND file_size <= 10485760), -- 10MB limit
    CONSTRAINT valid_filename CHECK (LENGTH(filename) > 0 AND LENGTH(filename) <= 255),
    CONSTRAINT valid_content_type CHECK (
        content_type IN (
            -- Documents
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'text/plain',
            'text/csv',
            -- Images
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml',
            -- Archives
            'application/zip',
            'application/x-rar-compressed',
            'application/x-7z-compressed'
        )
    ),
    CONSTRAINT valid_download_count CHECK (download_count >= 0)
);

-- Email statistics for analytics (optional)
CREATE TABLE public.inbox_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inbox_id UUID NOT NULL REFERENCES public.inboxes(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    emails_received INTEGER DEFAULT 0 NOT NULL,
    total_size_bytes INTEGER DEFAULT 0 NOT NULL,
    spam_emails INTEGER DEFAULT 0 NOT NULL,
    attachments_received INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    UNIQUE(inbox_id, date),
    CONSTRAINT valid_stats CHECK (
        emails_received >= 0 AND 
        total_size_bytes >= 0 AND 
        spam_emails >= 0 AND 
        spam_emails <= emails_received AND
        attachments_received >= 0
    )
);

-- ====================================
-- INDEXES
-- ====================================

-- Inboxes indexes
CREATE INDEX idx_inboxes_email_address ON public.inboxes(email_address);
CREATE INDEX idx_inboxes_expires_at ON public.inboxes(expires_at);
CREATE INDEX idx_inboxes_is_active ON public.inboxes(is_active);
CREATE INDEX idx_inboxes_created_at ON public.inboxes(created_at);

-- Emails indexes
CREATE INDEX idx_emails_inbox_id ON public.emails(inbox_id);
CREATE INDEX idx_emails_received_at ON public.emails(received_at DESC);
CREATE INDEX idx_emails_from_address ON public.emails(from_address);
CREATE INDEX idx_emails_subject ON public.emails USING gin(to_tsvector('english', subject));
CREATE INDEX idx_emails_is_read ON public.emails(is_read);
CREATE INDEX idx_emails_is_spam ON public.emails(is_spam);
CREATE INDEX idx_emails_inbox_received ON public.emails(inbox_id, received_at DESC);

-- Attachments indexes
CREATE INDEX idx_attachments_email_id ON public.attachments(email_id);
CREATE INDEX idx_attachments_file_hash ON public.attachments(file_hash);
CREATE INDEX idx_attachments_content_type ON public.attachments(content_type);
CREATE INDEX idx_attachments_is_allowed ON public.attachments(is_allowed);

-- Stats indexes
CREATE INDEX idx_inbox_stats_inbox_date ON public.inbox_stats(inbox_id, date DESC);

-- ====================================
-- FUNCTIONS & TRIGGERS
-- ====================================

-- Function to automatically clean up expired inboxes
CREATE OR REPLACE FUNCTION cleanup_expired_inboxes()
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE public.inboxes 
    SET is_active = false
    WHERE expires_at < NOW() AND is_active = true;
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Function to update email count when emails are added/removed
CREATE OR REPLACE FUNCTION update_inbox_email_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.inboxes 
        SET current_email_count = current_email_count + 1,
            last_accessed_at = NOW()
        WHERE id = NEW.inbox_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.inboxes 
        SET current_email_count = GREATEST(current_email_count - 1, 0)
        WHERE id = OLD.inbox_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to update attachment count when attachments are added/removed
CREATE OR REPLACE FUNCTION update_email_attachment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.emails 
        SET attachment_count = attachment_count + 1,
            total_size_bytes = total_size_bytes + NEW.file_size
        WHERE id = NEW.email_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.emails 
        SET attachment_count = GREATEST(attachment_count - 1, 0),
            total_size_bytes = GREATEST(total_size_bytes - OLD.file_size, 0)
        WHERE id = OLD.email_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER trigger_update_inbox_email_count
    AFTER INSERT OR DELETE ON public.emails
    FOR EACH ROW EXECUTE FUNCTION update_inbox_email_count();

CREATE TRIGGER trigger_update_email_attachment_count
    AFTER INSERT OR DELETE ON public.attachments
    FOR EACH ROW EXECUTE FUNCTION update_email_attachment_count();

-- ====================================
-- ROW LEVEL SECURITY (RLS)
-- ====================================

-- Enable RLS on all tables
ALTER TABLE public.inboxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inbox_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for anonymous access (since this is a disposable email service)
-- Note: In production, you might want to implement more sophisticated access control

-- Inboxes: Allow read access to active, non-expired inboxes
CREATE POLICY "Allow public read access to active inboxes" ON public.inboxes
    FOR SELECT USING (is_active = true AND expires_at > NOW());

-- Inboxes: Allow insert of new inboxes
CREATE POLICY "Allow public insert of new inboxes" ON public.inboxes
    FOR INSERT WITH CHECK (true);

-- Emails: Allow read access to emails of active inboxes
CREATE POLICY "Allow public read access to emails" ON public.emails
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.inboxes 
            WHERE id = emails.inbox_id 
            AND is_active = true 
            AND expires_at > NOW()
        )
    );

-- Emails: Allow insert of new emails
CREATE POLICY "Allow public insert of new emails" ON public.emails
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.inboxes 
            WHERE id = inbox_id 
            AND is_active = true 
            AND expires_at > NOW()
        )
    );

-- Attachments: Allow read access to attachments of accessible emails
CREATE POLICY "Allow public read access to attachments" ON public.attachments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.emails e
            JOIN public.inboxes i ON e.inbox_id = i.id
            WHERE e.id = attachments.email_id 
            AND i.is_active = true 
            AND i.expires_at > NOW()
        )
    );

-- Attachments: Allow insert of new attachments
CREATE POLICY "Allow public insert of new attachments" ON public.attachments
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
-- INITIAL DATA & CONFIGURATION
-- ====================================

-- Create a cleanup schedule (to be run by a cron job or scheduled function)
COMMENT ON FUNCTION cleanup_expired_inboxes() IS 'Run this function periodically to clean up expired inboxes and their associated data';

-- Set up realtime for the tables we need
-- Note: This needs to be done via Supabase dashboard or API
-- ALTER publication supabase_realtime ADD TABLE public.emails;
-- ALTER publication supabase_realtime ADD TABLE public.attachments;

-- ====================================
-- SAMPLE DATA (for testing)
-- ====================================

-- Uncomment below for testing purposes
/*
INSERT INTO public.inboxes (email_address, expires_at, subscription_tier) VALUES 
('test123@genmail.app', NOW() + INTERVAL '10 minutes', 'free'),
('premium456@genmail.app', NOW() + INTERVAL '1 hour', 'premium');
*/ 