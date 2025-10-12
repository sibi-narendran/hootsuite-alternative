# dooza Backend API

Backend API server for collecting and managing email submissions from the dooza landing page.

## Features

- **Email Collection**: Store email submissions with metadata
- **Admin Analytics**: Real-time statistics and email management  
- **SQLite Database**: Persistent storage with no external dependencies
- **CORS Support**: Works with frontend deployed anywhere
- **RESTful API**: Standard HTTP endpoints

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and timestamp.

### Submit Email
```
POST /api/emails
Content-Type: application/json

{
  "email": "user@example.com"
}
```
Saves email to database with timestamp and metadata.

### Get All Emails (Admin)
```
GET /api/emails
```
Returns all email submissions with full details.

### Get Statistics (Admin)
```
GET /api/stats
```
Returns signup statistics (total, today, this week).

### Clear All Emails (Admin)
```
DELETE /api/emails
```
Deletes all email records from database.

## Setup & Installation

1. **Install Dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Start Production Server:**
   ```bash
   npm start
   ```

The server runs on port 3001 by default.

## Database

Uses SQLite database (`emails.db`) with the following schema:

```sql
CREATE TABLE emails (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT
)
```

## Deployment

### Vercel/Netlify Functions
Convert to serverless functions for easy deployment.

### Railway/Render
Deploy as a Node.js application with persistent storage.

### VPS/Cloud
Deploy with PM2 or Docker for production use.

## Environment Variables

- `PORT`: Server port (default: 3001)
- Add database credentials for production use

## Security Notes

- Add authentication for admin endpoints in production
- Implement rate limiting for email submissions
- Use HTTPS in production
- Consider adding email validation and spam protection
