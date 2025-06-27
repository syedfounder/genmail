-- Alter the inboxes table to add subscriber-specific features
ALTER TABLE public.inboxes
ADD COLUMN IF NOT EXISTS custom_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS password_hash TEXT;

COMMENT ON COLUMN public.inboxes.custom_name IS 'A user-defined label for the inbox.';
COMMENT ON COLUMN public.inboxes.password_hash IS 'A hashed password for protected inboxes.'; 