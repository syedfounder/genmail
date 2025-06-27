-- Fix missing columns in inboxes table
-- This migration adds custom_name and password_hash columns if they don't exist

DO $$
BEGIN
    -- Add custom_name column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'inboxes' AND column_name = 'custom_name'
    ) THEN
        ALTER TABLE public.inboxes ADD COLUMN custom_name VARCHAR(255);
        COMMENT ON COLUMN public.inboxes.custom_name IS 'A user-defined label for the inbox.';
    END IF;

    -- Add password_hash column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'inboxes' AND column_name = 'password_hash'
    ) THEN
        ALTER TABLE public.inboxes ADD COLUMN password_hash TEXT;
        COMMENT ON COLUMN public.inboxes.password_hash IS 'A hashed password for protected inboxes.';
    END IF;
END
$$; 