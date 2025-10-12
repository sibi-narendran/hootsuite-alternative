// Stats API for Vercel deployment with Supabase PostgreSQL
import { getEmails as supabaseGetEmails, calculateStats } from '../lib/supabase.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get emails from Supabase PostgreSQL and calculate real stats
    const emails = await supabaseGetEmails();
    const stats = calculateStats(emails);

    res.json({ 
      success: true, 
      stats,
      message: emails.length > 0 
        ? `Live stats from ${emails.length} real database submissions!` 
        : 'Database ready - no submissions yet.'
    });
  } catch (error) {
    console.error('Stats API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      success: false 
    });
  }
}
