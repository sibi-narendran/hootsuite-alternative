// Social signup stats API endpoint for doozasocial
import { getSocialSignupStats } from '../lib/supabase-social.js';

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
    // Get doozasocial signup statistics
    const stats = await getSocialSignupStats();

    res.json({ 
      success: true, 
      stats,
      message: stats.total > 0 
        ? `Live doozasocial stats: ${stats.total} total signups (${stats.today} today, ${stats.week} this week)` 
        : 'doozasocial database ready - no signups yet.'
    });
  } catch (error) {
    console.error('Social Stats API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      success: false 
    });
  }
}
