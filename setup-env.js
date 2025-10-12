// Environment setup helper for Supabase
console.log(`
🔧 SUPABASE ENVIRONMENT SETUP

To connect your production database:

1. CREATE .env.local file in project root with:
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

2. OR update lib/supabase.js directly (lines 4-5)

3. Create emails table in Supabase SQL Editor:
   
   CREATE TABLE public.emails (
     id BIGSERIAL PRIMARY KEY,
     email VARCHAR(255) NOT NULL,
     timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     ip_address VARCHAR(45),
     user_agent TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

4. Enable RLS and create access policy:
   
   ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Allow API access" ON public.emails FOR ALL USING (true);

📚 See SUPABASE_SETUP.md for complete instructions.
`);

process.exit(0);
