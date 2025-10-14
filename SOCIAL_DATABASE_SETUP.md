# Social Media Database Setup

This guide shows how to set up a separate Supabase database for dooza social signups.

## 1. Create New Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New project"
3. Name it: `dooza-social-signups`
4. Choose your organization
5. Create the project

## 2. Create the Social Signups Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create social_signups table
CREATE TABLE public.social_signups (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email varchar(255) NOT NULL,
    timestamp timestamptz DEFAULT now(),
    ip_address varchar(45),
    user_agent text,
    signup_source varchar(100) DEFAULT 'website',
    status varchar(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'active')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_social_signups_email ON public.social_signups(email);
CREATE INDEX idx_social_signups_created_at ON public.social_signups(created_at);
CREATE INDEX idx_social_signups_status ON public.social_signups(status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.social_signups ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed)
CREATE POLICY "Allow public insert" ON public.social_signups
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select" ON public.social_signups
    FOR SELECT USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_social_signups_updated_at
    BEFORE UPDATE ON public.social_signups
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
```

## 3. Environment Variables

Add these to your environment variables:

```bash
# New Supabase for Social Media Signups
NEXT_PUBLIC_SUPABASE_SOCIAL_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_SOCIAL_ANON_KEY=your_anon_key_here
```

You can find these values in your Supabase project settings:
- Go to Settings → API
- Copy the "Project URL" and "anon/public" key

## 4. Local Development

For local development, create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_SUPABASE_SOCIAL_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_SOCIAL_ANON_KEY=your_anon_key_here
```

## 5. Production Deployment

For Vercel deployment:

1. Go to your Vercel project dashboard
2. Go to Settings → Environment Variables
3. Add the two variables:
   - `NEXT_PUBLIC_SUPABASE_SOCIAL_URL`
   - `NEXT_PUBLIC_SUPABASE_SOCIAL_ANON_KEY`

## 6. Features

The new database includes:

- ✅ **Separate from forms database** - Complete isolation
- ✅ **Enhanced tracking** - IP address, user agent, signup source
- ✅ **Status management** - pending/verified/active states
- ✅ **Timestamps** - Created and updated tracking
- ✅ **Performance optimized** - Proper indexes
- ✅ **Security** - Row Level Security enabled

## 7. Testing

After setting up:

1. Add your new Supabase credentials to the environment
2. Test the signup form at `/signup`
3. Check your Supabase dashboard to see new signups
4. Verify data is being stored in the `social_signups` table

## 8. Admin Dashboard

You can create an admin dashboard to view signups by importing the functions:

```typescript
import { getSocialSignups, calculateSocialStats } from '@/lib/supabase-social';

// Get all signups
const signups = await getSocialSignups();

// Calculate statistics
const stats = calculateSocialStats(signups);
```

## Table Schema

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| email | varchar(255) | User email |
| timestamp | timestamptz | When they signed up |
| ip_address | varchar(45) | User's IP address |
| user_agent | text | Browser/device info |
| signup_source | varchar(100) | Where they signed up from |
| status | varchar(20) | pending/verified/active |
| created_at | timestamptz | Record creation time |
| updated_at | timestamptz | Last update time |
