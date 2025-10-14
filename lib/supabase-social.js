import { createClient } from '@supabase/supabase-js';

// Use the same Supabase configuration from the existing setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rndiktnoopmxcwdulspf.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuZGlrdG5vb3BteGN3ZHVsc3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MTc5NjMsImV4cCI6MjA3NTM5Mzk2M30.khywq7SrgW3YFlnEvk-nI4jeXAEJDm6u79-9fNLPNxQ';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database operations for social media signups
export async function addSocialSignup(signupData) {
  try {
    const { data, error } = await supabase
      .from('social_signups')
      .insert([
        {
          email: signupData.email,
          signup_source: signupData.signup_source || 'dooza_social_website',
          user_agent: signupData.user_agent || null,
          ip_address: signupData.ip_address || null,
          utm_source: signupData.utm_source || null,
          utm_medium: signupData.utm_medium || null,
          utm_campaign: signupData.utm_campaign || null,
          referrer: signupData.referrer || null,
          timestamp: signupData.timestamp || new Date().toISOString()
        }
      ])
      .select('*')
      .single();

    if (error) {
      console.error('Supabase social signup insert error:', error);
      throw error;
    }

    console.log('Social signup saved to Supabase:', data.email);
    return data;
  } catch (error) {
    console.error('Error saving social signup to Supabase:', error);
    throw error;
  }
}

export async function getSocialSignups() {
  try {
    const { data, error } = await supabase
      .from('social_signups')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Supabase social signups select error:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching social signups from Supabase:', error);
    throw error;
  }
}

export async function getSocialSignupStats() {
  try {
    // Get all signups
    const { data: signups, error } = await supabase
      .from('social_signups')
      .select('timestamp')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching social signup stats:', error);
      throw error;
    }

    // Calculate stats
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const stats = {
      total: signups.length,
      today: signups.filter(signup => 
        signup.timestamp.split('T')[0] === today
      ).length,
      week: signups.filter(signup => 
        new Date(signup.timestamp) > oneWeekAgo
      ).length
    };

    return stats;
  } catch (error) {
    console.error('Error calculating social signup stats:', error);
    throw error;
  }
}

export async function clearAllSocialSignups() {
  try {
    // Get count before deleting
    const { count, error: countError } = await supabase
      .from('social_signups')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error counting social signups:', countError);
      throw countError;
    }

    // Delete all records
    const { error } = await supabase
      .from('social_signups')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (error) {
      console.error('Supabase social signups delete error:', error);
      throw error;
    }

    console.log(`Deleted ${count || 0} social signup records from Supabase`);
    return count || 0;
  } catch (error) {
    console.error('Error clearing social signups from Supabase:', error);
    throw error;
  }
}
