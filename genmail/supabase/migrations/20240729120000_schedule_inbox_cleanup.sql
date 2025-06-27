-- Migration: Schedule inbox cleanup cron job
-- PRD Section 2: Storage Optimization & Cleanup

-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Grant cron usage to the postgres user if not already granted
-- This is necessary for cron jobs to be scheduled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_roles WHERE rolname = 'postgres' AND rolsuper = true
  ) THEN
    GRANT USAGE ON SCHEMA cron TO postgres;
  END IF;
END;
$$;

-- Schedule the cleanup function to run every 5 minutes
-- The job will call the cleanup_expired_inboxes function
SELECT cron.schedule(
    'cleanup-expired-inboxes',
    '*/5 * * * *', -- every 5 minutes
    $$
    SELECT cleanup_expired_inboxes();
    $$
);

-- ====================================
-- COMMENTS AND DOCUMENTATION
-- ====================================

COMMENT ON EXTENSION pg_cron IS 'Used to schedule periodic cleanup of expired inboxes.'; 