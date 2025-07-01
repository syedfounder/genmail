-- Migration: Create sponsors table with proper RLS
-- Manages sponsor banner advertisements displayed on the homepage

-- ====================================
-- SPONSORS TABLE
-- ====================================

-- Create sponsors table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.sponsors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    banner_url TEXT NOT NULL,
    target_url TEXT,
    is_active BOOLEAN DEFAULT false NOT NULL,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Constraints
    CONSTRAINT valid_banner_url CHECK (banner_url ~* '^https?://.*'),
    CONSTRAINT valid_target_url CHECK (target_url IS NULL OR target_url ~* '^https?://.*'),
    CONSTRAINT valid_date_range CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sponsors_is_active ON public.sponsors(is_active);
CREATE INDEX IF NOT EXISTS idx_sponsors_dates ON public.sponsors(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_sponsors_created_at ON public.sponsors(created_at DESC);

-- ====================================
-- TRIGGERS FOR UPDATED_AT
-- ====================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_sponsors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS trigger_sponsors_updated_at ON public.sponsors;
CREATE TRIGGER trigger_sponsors_updated_at
    BEFORE UPDATE ON public.sponsors
    FOR EACH ROW EXECUTE FUNCTION update_sponsors_updated_at();

-- ====================================
-- ROW LEVEL SECURITY (RLS)
-- ====================================

-- Enable RLS on sponsors table
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to active sponsors
-- This allows the homepage to display sponsor banners
CREATE POLICY "Allow public read access to active sponsors" ON public.sponsors
    FOR SELECT USING (
        is_active = true AND
        (start_date IS NULL OR start_date <= CURRENT_DATE) AND
        (end_date IS NULL OR end_date >= CURRENT_DATE)
    );

-- Policy: Only service role can insert/update/delete sponsors
-- This ensures only admins can manage sponsor content
CREATE POLICY "Only service role can manage sponsors" ON public.sponsors
    FOR ALL USING (auth.role() = 'service_role');

-- ====================================
-- HELPER FUNCTIONS
-- ====================================

-- Function to get active sponsors for a specific date
CREATE OR REPLACE FUNCTION get_active_sponsors(check_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
    id UUID,
    name VARCHAR(255),
    banner_url TEXT,
    target_url TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.name,
        s.banner_url,
        s.target_url
    FROM public.sponsors s
    WHERE s.is_active = true
    AND (s.start_date IS NULL OR s.start_date <= check_date)
    AND (s.end_date IS NULL OR s.end_date >= check_date)
    ORDER BY s.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================
-- COMMENTS AND DOCUMENTATION
-- ====================================

COMMENT ON TABLE public.sponsors IS 'Manages sponsor banner advertisements displayed on the website';
COMMENT ON COLUMN public.sponsors.name IS 'Display name of the sponsor company';
COMMENT ON COLUMN public.sponsors.banner_url IS 'URL to the sponsor banner image';
COMMENT ON COLUMN public.sponsors.target_url IS 'URL to redirect when banner is clicked (optional)';
COMMENT ON COLUMN public.sponsors.is_active IS 'Whether this sponsor banner should be displayed';
COMMENT ON COLUMN public.sponsors.start_date IS 'Date when sponsor campaign starts (optional)';
COMMENT ON COLUMN public.sponsors.end_date IS 'Date when sponsor campaign ends (optional)';
COMMENT ON FUNCTION get_active_sponsors(DATE) IS 'Returns active sponsors for a given date';

-- ====================================
-- SAMPLE DATA (for testing)
-- ====================================

-- Uncomment below for testing purposes
/*
INSERT INTO public.sponsors (name, banner_url, target_url, is_active, start_date, end_date) VALUES 
('Example Sponsor', 'https://example.com/banner.jpg', 'https://example.com', true, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days');
*/ 