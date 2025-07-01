-- Migration: Setup Email Attachment Storage with Automatic Cleanup
-- Creates storage bucket, policies, and cleanup functions for email attachments

-- ====================================
-- STORAGE BUCKET SETUP
-- ====================================

-- Create bucket for email attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
    'email-attachments', 
    'email-attachments', 
    false, -- Private bucket for security
    10485760, -- 10MB limit per file
    ARRAY[
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
    ]
);

-- ====================================
-- STORAGE POLICIES
-- ====================================

-- Policy to allow authenticated users to upload attachments to their own inboxes
CREATE POLICY "Users can upload attachments to their inboxes" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'email-attachments' AND
    auth.role() = 'authenticated' AND
    -- Check that the path starts with the user's ID
    (storage.foldername(name))[1] = auth.jwt() ->> 'sub'
);

-- Policy to allow users to read attachments from their own inboxes
CREATE POLICY "Users can read their own attachments" ON storage.objects
FOR SELECT USING (
    bucket_id = 'email-attachments' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.jwt() ->> 'sub'
);

-- Policy to allow service role to manage all attachments (for cleanup)
CREATE POLICY "Service role can manage all attachments" ON storage.objects
FOR ALL USING (
    bucket_id = 'email-attachments' AND
    auth.role() = 'service_role'
);

-- ====================================
-- ATTACHMENT CLEANUP FUNCTIONS
-- ====================================

-- Function to clean up storage files for a specific attachment
CREATE OR REPLACE FUNCTION cleanup_attachment_storage()
RETURNS TRIGGER AS $$
BEGIN
    -- When an attachment record is deleted, remove the file from storage
    IF TG_OP = 'DELETE' THEN
        -- Use a background job to delete the storage file
        -- This prevents the transaction from failing if storage deletion fails
        PERFORM pg_notify(
            'attachment_cleanup',
            json_build_object(
                'storage_path', OLD.storage_path,
                'attachment_id', OLD.id
            )::text
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for attachment cleanup
CREATE TRIGGER trigger_cleanup_attachment_storage
    AFTER DELETE ON public.attachments
    FOR EACH ROW EXECUTE FUNCTION cleanup_attachment_storage();

-- Function to clean up expired inbox attachments
CREATE OR REPLACE FUNCTION cleanup_expired_attachments()
RETURNS INTEGER AS $$
DECLARE
    cleanup_count INTEGER := 0;
    attachment_record RECORD;
BEGIN
    -- Find all attachments belonging to expired inboxes
    FOR attachment_record IN
        SELECT a.id, a.storage_path
        FROM public.attachments a
        JOIN public.emails e ON a.email_id = e.id
        JOIN public.inboxes i ON e.inbox_id = i.id
        WHERE i.expires_at < NOW() OR i.is_active = false
    LOOP
        -- Delete the attachment record (this will trigger storage cleanup via trigger)
        DELETE FROM public.attachments WHERE id = attachment_record.id;
        cleanup_count := cleanup_count + 1;
    END LOOP;
    
    RETURN cleanup_count;
END;
$$ LANGUAGE plpgsql;

-- Enhanced inbox cleanup function that also handles attachments
CREATE OR REPLACE FUNCTION cleanup_expired_inboxes_with_attachments()
RETURNS JSON AS $$
DECLARE
    inbox_count INTEGER := 0;
    attachment_count INTEGER := 0;
    email_count INTEGER := 0;
    expired_inbox_ids UUID[];
BEGIN
    -- Get list of expired inbox IDs
    SELECT ARRAY_AGG(id) INTO expired_inbox_ids
    FROM public.inboxes 
    WHERE expires_at < NOW() AND is_active = true;
    
    IF expired_inbox_ids IS NOT NULL THEN
        -- Count emails that will be deleted
        SELECT COUNT(*) INTO email_count
        FROM public.emails 
        WHERE inbox_id = ANY(expired_inbox_ids);
        
        -- Count attachments that will be deleted
        SELECT COUNT(*) INTO attachment_count
        FROM public.attachments a
        JOIN public.emails e ON a.email_id = e.id
        WHERE e.inbox_id = ANY(expired_inbox_ids);
        
        -- Delete attachments (this will trigger storage cleanup)
        DELETE FROM public.attachments a
        USING public.emails e
        WHERE a.email_id = e.id AND e.inbox_id = ANY(expired_inbox_ids);
        
        -- Delete emails
        DELETE FROM public.emails WHERE inbox_id = ANY(expired_inbox_ids);
        
        -- Mark inboxes as inactive
        UPDATE public.inboxes 
        SET is_active = false
        WHERE id = ANY(expired_inbox_ids);
        
        inbox_count := array_length(expired_inbox_ids, 1);
    END IF;
    
    RETURN json_build_object(
        'inboxes_deactivated', inbox_count,
        'emails_deleted', email_count,
        'attachments_deleted', attachment_count,
        'timestamp', NOW()
    );
END;
$$ LANGUAGE plpgsql;

-- ====================================
-- STORAGE HELPER FUNCTIONS
-- ====================================

-- Function to generate storage path for attachments
CREATE OR REPLACE FUNCTION generate_attachment_storage_path(
    user_id TEXT,
    inbox_id UUID,
    email_id UUID,
    filename TEXT
)
RETURNS TEXT AS $$
BEGIN
    -- Path structure: {user_id}/{inbox_id}/{email_id}/{unique_filename}
    RETURN user_id || '/' || inbox_id || '/' || email_id || '/' || 
           extract(epoch from now())::bigint || '_' || filename;
END;
$$ LANGUAGE plpgsql;

-- Function to get signed URL for attachment download
CREATE OR REPLACE FUNCTION get_attachment_download_url(
    attachment_id UUID,
    expires_in INTEGER DEFAULT 3600 -- 1 hour default
)
RETURNS TEXT AS $$
DECLARE
    attachment_path TEXT;
    signed_url TEXT;
BEGIN
    -- Get the storage path for the attachment
    SELECT storage_path INTO attachment_path
    FROM public.attachments
    WHERE id = attachment_id;
    
    IF attachment_path IS NULL THEN
        RETURN NULL;
    END IF;
    
    -- Generate signed URL (this would need to be implemented via Edge Function)
    -- For now, return the path - the actual URL generation should be done in the API
    RETURN attachment_path;
END;
$$ LANGUAGE plpgsql;

-- ====================================
-- UPDATED RLS POLICIES FOR ATTACHMENTS
-- ====================================

-- Drop old attachment policies
DROP POLICY IF EXISTS "Allow public read access to attachments" ON public.attachments;
DROP POLICY IF EXISTS "Allow public insert of new attachments" ON public.attachments;

-- New policies for authenticated users
CREATE POLICY "Users can read attachments from their inboxes" ON public.attachments
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.emails e
        JOIN public.inboxes i ON e.inbox_id = i.id
        WHERE e.id = attachments.email_id 
        AND i.user_id = auth.jwt() ->> 'sub'
        AND i.is_active = true 
        AND i.expires_at > NOW()
    )
);

CREATE POLICY "Users can insert attachments to their inboxes" ON public.attachments
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.emails e
        JOIN public.inboxes i ON e.inbox_id = i.id
        WHERE e.id = email_id 
        AND i.user_id = auth.jwt() ->> 'sub'
        AND i.is_active = true 
        AND i.expires_at > NOW()
    )
);

CREATE POLICY "Service role can manage all attachments" ON public.attachments
FOR ALL USING (auth.role() = 'service_role');

-- ====================================
-- SCHEDULED CLEANUP CONFIGURATION
-- ====================================

-- Create a function to be called by pg_cron or external scheduler
CREATE OR REPLACE FUNCTION scheduled_attachment_cleanup()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    -- Perform cleanup and return results
    SELECT cleanup_expired_inboxes_with_attachments() INTO result;
    
    -- Log the cleanup operation
    INSERT INTO public.cleanup_logs (
        operation_type,
        result_data,
        performed_at
    ) VALUES (
        'attachment_cleanup',
        result,
        NOW()
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create cleanup logs table for monitoring
CREATE TABLE IF NOT EXISTS public.cleanup_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    operation_type VARCHAR(50) NOT NULL,
    result_data JSON,
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for querying recent logs
CREATE INDEX idx_cleanup_logs_performed_at ON public.cleanup_logs(performed_at DESC);

-- Enable RLS on cleanup logs
ALTER TABLE public.cleanup_logs ENABLE ROW LEVEL SECURITY;

-- Only service role can access cleanup logs
CREATE POLICY "Service role can manage cleanup logs" ON public.cleanup_logs
FOR ALL USING (auth.role() = 'service_role');

-- ====================================
-- COMMENTS AND DOCUMENTATION
-- ====================================

COMMENT ON FUNCTION cleanup_expired_attachments() IS 'Cleans up attachment records for expired inboxes';
COMMENT ON FUNCTION cleanup_expired_inboxes_with_attachments() IS 'Comprehensive cleanup function for expired inboxes, emails, and attachments';
COMMENT ON FUNCTION generate_attachment_storage_path(TEXT, UUID, UUID, TEXT) IS 'Generates consistent storage paths for attachments';
COMMENT ON FUNCTION get_attachment_download_url(UUID, INTEGER) IS 'Gets download URL for attachment (requires Edge Function implementation)';
COMMENT ON FUNCTION scheduled_attachment_cleanup() IS 'Main function to be called by external scheduler for cleanup operations';

COMMENT ON TABLE public.cleanup_logs IS 'Logs cleanup operations for monitoring and debugging';

-- ====================================
-- MIGRATION COMPLETION
-- ====================================

-- Update the attachments table to ensure storage_path is properly indexed
CREATE INDEX IF NOT EXISTS idx_attachments_storage_path ON public.attachments(storage_path);

-- Add check constraint to ensure storage path follows our convention
ALTER TABLE public.attachments 
ADD CONSTRAINT check_storage_path_format 
CHECK (storage_path ~ '^[a-zA-Z0-9_-]+/[a-f0-9-]{36}/[a-f0-9-]{36}/[0-9]+_.*'); 