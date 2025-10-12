import { createClient } from '@supabase/supabase-js';

// Supabase configuration - production database credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rndiktnoopmxcwdulspf.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuZGlrdG5vb3BteGN3ZHVsc3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MTc5NjMsImV4cCI6MjA3NTM5Mzk2M30.khywq7SrgW3YFlnEvk-nI4jeXAEJDm6u79-9fNLPNxQ';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database operations for email collection
export async function addEmail(emailData) {
  try {
    const { data, error } = await supabase
      .from('emails')
      .insert([
        {
          email: emailData.email,
          timestamp: emailData.timestamp,
          ip_address: emailData.ip_address,
          user_agent: emailData.user_agent
        }
      ])
      .select('id, email, timestamp, ip_address, user_agent')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    console.log('Email saved to Supabase PostgreSQL:', data.email);
    return data;
  } catch (error) {
    console.error('Error saving email to Supabase:', error);
    throw error;
  }
}

export async function getEmails() {
  try {
    const { data, error } = await supabase
      .from('emails')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Supabase select error:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching emails from Supabase:', error);
    throw error;
  }
}

export async function clearAllEmails() {
  try {
    // Get count before deleting
    const { count, error: countError } = await supabase
      .from('emails')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error counting emails:', countError);
      throw countError;
    }

    // Delete all records (UUID field, so we use not equals to a non-existent UUID)
    const { error } = await supabase
      .from('emails')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

    if (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }

    console.log(`Deleted ${count || 0} email records from Supabase PostgreSQL`);
    return count || 0;
  } catch (error) {
    console.error('Error clearing emails from Supabase:', error);
    throw error;
  }
}

export function calculateStats(emails) {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  return {
    total: emails.length,
    today: emails.filter(email => 
      email.timestamp.split('T')[0] === today
    ).length,
    week: emails.filter(email => 
      new Date(email.timestamp) > oneWeekAgo
    ).length
  };
}
