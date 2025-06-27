-- Migration: Add user_id to inboxes table for Clerk integration
-- PRD Section 3: User Flow

ALTER TABLE public.inboxes
ADD COLUMN user_id TEXT;

-- Index for performance on user-specific queries
CREATE INDEX idx_inboxes_user_id ON public.inboxes(user_id);

COMMENT ON COLUMN public.inboxes.user_id IS 'Foreign key to the Clerk user ID, for linking inboxes to authenticated users.'; 