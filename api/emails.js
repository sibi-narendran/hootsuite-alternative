// Email collection API for Vercel with Supabase PostgreSQL
import { addEmail as supabaseAddEmail, getEmails as supabaseGetEmails, clearAllEmails } from '../lib/supabase.js';

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
      // Submit new email
      const { email } = req.body;
      
      // Validate email
      if (!email || !email.includes('@')) {
        return res.status(400).json({ 
          error: 'Valid email address is required',
          success: false 
        });
      }

      const emailData = {
        email: email.toLowerCase().trim(),
        timestamp: new Date().toISOString(),
        ip_address: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown',
        user_agent: req.headers['user-agent'] || 'unknown'
      };

      // Save email to Supabase PostgreSQL
      const savedEmail = await supabaseAddEmail(emailData);
      
      console.log(`New email saved to Supabase: ${emailData.email} at ${emailData.timestamp}`);
      
      return res.status(201).json({ 
        success: true, 
        message: 'Email saved to database successfully',
        id: savedEmail.id,
        email: savedEmail.email,
        timestamp: savedEmail.timestamp
      });
    }

    if (req.method === 'GET') {
      // Get all emails from Supabase PostgreSQL
      const emails = await supabaseGetEmails();
      
      return res.json({ 
        success: true, 
        emails: emails,
        total: emails.length,
        message: emails.length > 0 
          ? `${emails.length} email submissions retrieved from database`
          : 'No email submissions yet. Database is ready to collect emails!'
      });
    }

    if (req.method === 'DELETE') {
      // Clear all emails from Supabase PostgreSQL
      const deletedCount = await clearAllEmails();
      
      return res.json({ 
        success: true, 
        message: `Successfully deleted ${deletedCount} email records from database`,
        deletedCount
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      success: false,
      details: error.message
    });
  }
}
