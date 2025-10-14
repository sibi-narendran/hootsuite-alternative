import { createClient } from '@supabase/supabase-js';

// New Supabase configuration specifically for dooza social
// You'll need to create a new Supabase project for this
const supabaseSocialUrl = process.env.NEXT_PUBLIC_SUPABASE_SOCIAL_URL || 'YOUR_NEW_SUPABASE_URL';
const supabaseSocialAnonKey = process.env.NEXT_PUBLIC_SUPABASE_SOCIAL_ANON_KEY || 'YOUR_NEW_SUPABASE_ANON_KEY';

// Create Supabase client for social media app
export const supabaseSocial = createClient(supabaseSocialUrl, supabaseSocialAnonKey);

// Interface for social media signup data
export interface SocialSignup {
  id?: string;
  email: string;
  timestamp?: string;
  ip_address?: string;
  user_agent?: string;
  signup_source?: string; // Track where they signed up from
  status?: 'pending' | 'verified' | 'active';
  created_at?: string;
  updated_at?: string;
}

// Database operations for social media signups
export async function addSocialSignup(signupData: Omit<SocialSignup, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabaseSocial
      .from('social_signups')
      .insert([
        {
          email: signupData.email,
          timestamp: signupData.timestamp || new Date().toISOString(),
          ip_address: signupData.ip_address,
          user_agent: signupData.user_agent,
          signup_source: signupData.signup_source || 'website',
          status: signupData.status || 'pending'
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
    const { data, error } = await supabaseSocial
      .from('social_signups')
      .select('*')
      .order('created_at', { ascending: false });

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

export async function updateSignupStatus(id: string, status: 'pending' | 'verified' | 'active') {
  try {
    const { data, error } = await supabaseSocial
      .from('social_signups')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Supabase social signup update error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating social signup status:', error);
    throw error;
  }
}

export async function clearAllSocialSignups() {
  try {
    // Get count before deleting
    const { count, error: countError } = await supabaseSocial
      .from('social_signups')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error counting social signups:', countError);
      throw countError;
    }

    // Delete all records
    const { error } = await supabaseSocial
      .from('social_signups')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

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

export function calculateSocialStats(signups: SocialSignup[]) {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  return {
    total: signups.length,
    today: signups.filter(signup => 
      signup.created_at?.split('T')[0] === today
    ).length,
    week: signups.filter(signup => 
      new Date(signup.created_at || signup.timestamp || '') > oneWeekAgo
    ).length,
    pending: signups.filter(signup => signup.status === 'pending').length,
    verified: signups.filter(signup => signup.status === 'verified').length,
    active: signups.filter(signup => signup.status === 'active').length
  };
}

// Helper function to get client IP (for tracking purposes)
export async function getClientInfo() {
  try {
    // Get client IP from a service
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    
    return {
      ip_address: data.ip,
      user_agent: navigator?.userAgent || 'Unknown'
    };
  } catch (error) {
    console.warn('Could not fetch client info:', error);
    return {
      ip_address: 'Unknown',
      user_agent: navigator?.userAgent || 'Unknown'
    };
  }
}
