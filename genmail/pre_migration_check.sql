-- Pre-migration safety check for sponsors table
-- Run this BEFORE applying the migrations

-- Check if sponsors table exists and show current data
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'sponsors') THEN
        RAISE NOTICE 'Sponsors table exists. Checking data...';
        
        -- Show current sponsors
        RAISE NOTICE 'Current sponsors data:';
        PERFORM * FROM public.sponsors;
        
        -- Check for sponsors without date ranges
        IF EXISTS (SELECT 1 FROM public.sponsors WHERE is_active = true AND (start_date IS NULL AND end_date IS NULL)) THEN
            RAISE NOTICE 'WARNING: Found active sponsors without date ranges. They will remain visible after migration.';
        END IF;
        
        -- Check for sponsors with problematic date ranges
        IF EXISTS (SELECT 1 FROM public.sponsors WHERE is_active = true AND start_date > CURRENT_DATE) THEN
            RAISE NOTICE 'WARNING: Found active sponsors with future start dates. They will become invisible until start_date.';
        END IF;
        
        IF EXISTS (SELECT 1 FROM public.sponsors WHERE is_active = true AND end_date < CURRENT_DATE) THEN
            RAISE NOTICE 'WARNING: Found active sponsors with past end dates. They will become invisible immediately.';
        END IF;
        
    ELSE
        RAISE NOTICE 'Sponsors table does not exist. Migration will create it safely.';
    END IF;
END $$;

-- Check current RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    hasrls
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('inboxes', 'emails', 'attachments', 'sponsors', 'rate_limit_events')
ORDER BY tablename; 