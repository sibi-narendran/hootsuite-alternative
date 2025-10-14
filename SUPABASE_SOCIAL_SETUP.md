# Supabase Social Signups Setup

This document explains how to set up the new `social_signups` table in your existing Supabase database for the dooza social media management signups.

## 🎯 Overview

- **Purpose**: Store social media management signups separately from your existing form signups
- **Database**: Uses your existing Supabase database (same credentials)
- **Table**: Creates a new `social_signups` table with enhanced tracking fields

## 🚀 Setup Instructions

### Step 1: Create the Table in Supabase

1. **Go to your Supabase Dashboard**:
   - Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your existing project: `rndiktnoopmxcwdulspf`

2. **Open the SQL Editor**:
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the SQL Script**:
   - Copy the contents from `sql/create_social_signups_table.sql`
   - Paste it into the SQL editor
   - Click "Run" to execute

### Step 2: Verify the Setup

After running the SQL script, verify that:

1. **Table Created**: Check the "Table Editor" to see the new `social_signups` table
2. **Columns Present**: Ensure all columns are created:
   - `id` (UUID, Primary Key)
   - `email` (TEXT, Required)
   - `signup_source` (TEXT, Default: 'dooza_social_website')
   - `user_agent` (TEXT)
   - `ip_address` (TEXT)
   - `utm_source`, `utm_medium`, `utm_campaign` (TEXT)
   - `referrer` (TEXT)
   - `timestamp`, `created_at`, `updated_at` (TIMESTAMPTZ)

3. **RLS Policies**: Check that Row Level Security policies are in place

## 📊 What Data is Collected

The new signup system collects:

- ✅ **Email Address** (required)
- ✅ **Signup Source** ('dooza_social_website')
- ✅ **UTM Parameters** (source, medium, campaign)
- ✅ **Referrer URL** (where they came from)
- ✅ **User Agent** (browser/device info)
- ✅ **Timestamp** (when they signed up)

## 🔄 How It Works

1. **User visits signup page**: `/signup`
2. **UTM tracking**: Automatically captures UTM parameters from URL
3. **Form submission**: Stores directly in Supabase `social_signups` table
4. **Analytics**: Tracks conversion events in Google Analytics
5. **Success**: Shows social media-focused success message

## 📈 Viewing Data

You can view the social signups in several ways:

1. **Supabase Dashboard**:
   - Go to Table Editor → `social_signups`

2. **Admin Dashboard** (if you want to add this):
   - The functions are available in `lib/supabase-social.js`
   - Use `getSocialSignups()` and `getSocialSignupStats()`

## 🔧 Available Functions

The `lib/supabase-social.js` provides these functions:

- `addSocialSignup(signupData)` - Add a new signup
- `getSocialSignups()` - Get all signups (newest first)
- `getSocialSignupStats()` - Get stats (total, today, this week)
- `clearAllSocialSignups()` - Clear all signups (admin function)

## 🚨 Important Notes

- **Separate from Forms**: This is completely separate from your existing `emails` table
- **Same Database**: Uses your existing Supabase project, just a new table
- **Enhanced Tracking**: Captures more marketing data than the basic email collection
- **Production Ready**: Includes proper security policies and indexing

## 🔍 Testing

After setup, test the signup flow:

1. Visit your website signup page
2. Add UTM parameters: `?utm_source=test&utm_medium=email&utm_campaign=launch`
3. Submit an email
4. Check the `social_signups` table in Supabase Dashboard

## 📞 Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify the Supabase table was created correctly
3. Ensure your Supabase credentials are correct in the environment
