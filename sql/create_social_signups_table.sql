-- Create social_signups table for dooza social media management signups
-- This table is separate from the existing 'emails' table used for forms

CREATE TABLE IF NOT EXISTS public.social_signups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    signup_source TEXT DEFAULT 'dooza_social_website',
    user_agent TEXT,
    ip_address TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    referrer TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_social_signups_email ON public.social_signups(email);
CREATE INDEX IF NOT EXISTS idx_social_signups_timestamp ON public.social_signups(timestamp);
CREATE INDEX IF NOT EXISTS idx_social_signups_signup_source ON public.social_signups(signup_source);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.social_signups ENABLE ROW LEVEL SECURITY;

-- Allow public to insert (for signups)
CREATE POLICY "Allow public to insert social signups" ON public.social_signups
    FOR INSERT WITH CHECK (true);

-- Allow public to read (for admin/stats, you can modify this as needed)
CREATE POLICY "Allow public to read social signups" ON public.social_signups
    FOR SELECT USING (true);

-- Allow public to delete (for admin clear function)
CREATE POLICY "Allow public to delete social signups" ON public.social_signups
    FOR DELETE USING (true);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_social_signups_updated_at ON public.social_signups;
CREATE TRIGGER update_social_signups_updated_at
    BEFORE UPDATE ON public.social_signups
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE public.social_signups IS 'Stores email signups specifically for dooza social media management platform';
COMMENT ON COLUMN public.social_signups.email IS 'User email address';
COMMENT ON COLUMN public.social_signups.signup_source IS 'Source of the signup (e.g., website, landing page, etc.)';
COMMENT ON COLUMN public.social_signups.utm_source IS 'UTM source parameter for tracking';
COMMENT ON COLUMN public.social_signups.utm_medium IS 'UTM medium parameter for tracking';
COMMENT ON COLUMN public.social_signups.utm_campaign IS 'UTM campaign parameter for tracking';
COMMENT ON COLUMN public.social_signups.referrer IS 'HTTP referrer URL';
