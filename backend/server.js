import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:8082', 'http://localhost:3000', 'http://127.0.0.1:8081', 'http://127.0.0.1:8082', 'https://www.trydooza.com', 'https://trydooza.com'],
  credentials: true
}));
app.use(express.json());

// Initialize SQLite database
const dbPath = path.join(__dirname, 'emails.db');
const db = new sqlite3.Database(dbPath);

// Create emails table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS emails (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      ip_address TEXT,
      user_agent TEXT
    )
  `);
});

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    message: 'dooza Backend API is running!'
  });
});

// Submit email
app.post('/api/emails', (req, res) => {
  const { email } = req.body;
  
  // Validate email
  if (!email || !email.includes('@')) {
    return res.status(400).json({ 
      error: 'Valid email address is required',
      success: false 
    });
  }

  const emailData = {
    id: uuidv4(),
    email: email.toLowerCase().trim(),
    timestamp: new Date().toISOString(),
    ip_address: req.ip || req.connection.remoteAddress || 'unknown',
    user_agent: req.get('User-Agent') || 'unknown'
  };

  db.run(
    `INSERT INTO emails (id, email, timestamp, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)`,
    [emailData.id, emailData.email, emailData.timestamp, emailData.ip_address, emailData.user_agent],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          error: 'Failed to save email',
          success: false 
        });
      }
      
      console.log(`New email saved: ${emailData.email} at ${emailData.timestamp}`);
      res.status(201).json({ 
        success: true, 
        message: 'Email saved successfully',
        id: emailData.id
      });
    }
  );
});

// Get all emails (for admin)
app.get('/api/emails', (req, res) => {
  db.all(
    `SELECT * FROM emails ORDER BY timestamp DESC`,
    [],
    (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          error: 'Failed to retrieve emails',
          success: false 
        });
      }
      
      res.json({ 
        success: true, 
        emails: rows,
        total: rows.length
      });
    }
  );
});

// Get email statistics
app.get('/api/stats', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weekAgoISO = oneWeekAgo.toISOString();

  db.serialize(() => {
    let stats = {};
    
    // Total count
    db.get(`SELECT COUNT(*) as total FROM emails`, (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', success: false });
      }
      stats.total = row.total;
      
      // Today's count
      db.get(`SELECT COUNT(*) as today FROM emails WHERE date(timestamp) = date('now')`, (err, row) => {
        if (err) {
          return res.status(500).json({ error: 'Database error', success: false });
        }
        stats.today = row.today;
        
        // This week's count
        db.get(`SELECT COUNT(*) as week FROM emails WHERE timestamp > ?`, [weekAgoISO], (err, row) => {
          if (err) {
            return res.status(500).json({ error: 'Database error', success: false });
          }
          stats.week = row.week;
          
          res.json({ success: true, stats });
        });
      });
    });
  });
});

// Delete all emails (for admin)
app.delete('/api/emails', (req, res) => {
  db.run(`DELETE FROM emails`, function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        error: 'Failed to delete emails',
        success: false 
      });
    }
    
    console.log(`Deleted ${this.changes} email records`);
    res.json({ 
      success: true, 
      message: `Deleted ${this.changes} email records`,
      deletedCount: this.changes
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 dooza Backend API Server Running!
📡 Port: ${PORT}
🌐 Health Check: http://localhost:${PORT}/api/health
📊 Admin Endpoints:
   • POST /api/emails - Submit email
   • GET /api/emails - Get all emails  
   • GET /api/stats - Get statistics
   • DELETE /api/emails - Clear all emails

💾 Database: SQLite (${dbPath})
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('✅ Database connection closed.');
    }
    process.exit(0);
  });
});
