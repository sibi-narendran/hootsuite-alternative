// Social signups API endpoint for doozasocial
import { addSocialSignup, getSocialSignups, getSocialSignupStats, clearAllSocialSignups } from '../lib/supabase-social.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'POST') {
      // Submit new social signup
      const { email, utm_source, utm_medium, utm_campaign, referrer } = req.body;
      
      // Validate email
      if (!email || !email.includes('@')) {
        return res.status(400).json({ 
          error: 'Valid email address is required',
          success: false 
        });
      }

      const signupData = {
        email: email.toLowerCase().trim(),
        signup_source: 'doozasocial_api',
        user_agent: req.headers['user-agent'] || 'unknown',
        ip_address: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown',
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
        referrer: referrer || req.headers['referer'] || null,
        timestamp: new Date().toISOString()
      };

      // Save to Supabase social_signups table
      const savedSignup = await addSocialSignup(signupData);
      
      console.log(`New doozasocial signup saved: ${signupData.email} at ${signupData.timestamp}`);
      
      return res.status(201).json({ 
        success: true, 
        message: 'Social signup saved successfully',
        id: savedSignup.id,
        email: savedSignup.email,
        timestamp: savedSignup.timestamp
      });
    }

    if (req.method === 'GET') {
      // Get all social signups
      const signups = await getSocialSignups();
      
      return res.json({ 
        success: true, 
        signups: signups,
        total: signups.length,
        message: signups.length > 0 
          ? `${signups.length} doozasocial signups retrieved`
          : 'No doozasocial signups yet. Ready to collect signups!'
      });
    }

    if (req.method === 'DELETE') {
      // Clear all social signups
      const deletedCount = await clearAllSocialSignups();
      
      return res.json({ 
        success: true, 
        message: `Successfully deleted ${deletedCount} doozasocial signup records`,
        deletedCount
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      success: false 
    });
  }
}
