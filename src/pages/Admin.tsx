import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Mail, Calendar, Download, Trash2 } from "lucide-react";
import { apiCall } from "@/config/api";

interface EmailEntry {
  id: string;
  email: string;
  timestamp: string;
  ip_address?: string;
  user_agent?: string;
}

interface Stats {
  total: number;
  today: number;
  week: number;
}

const Admin = () => {
  const [emails, setEmails] = useState<EmailEntry[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, today: 0, week: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load emails and stats from API
    const loadData = async () => {
      try {
        setError(null);
        
        // Fetch emails
        const emailsResponse = await apiCall('emails');
        const emailsData = await emailsResponse.json();
        
        // Fetch stats  
        const statsResponse = await apiCall('stats');
        const statsData = await statsResponse.json();
        
        if (emailsData.success) {
          setEmails(emailsData.emails);
        }
        
        if (statsData.success) {
          setStats(statsData.stats);
        }
        
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to connect to backend API. Make sure the server is running.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Refresh data every 10 seconds
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleExportEmails = () => {
    if (emails.length === 0) return;

    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Timestamp,ID,IP Address,User Agent\n"
      + emails.map(entry => 
          `"${entry.email}","${new Date(entry.timestamp).toLocaleString()}","${entry.id}","${entry.ip_address || 'N/A'}","${entry.user_agent || 'N/A'}"`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dooza_social_signups_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearEmails = async () => {
    if (window.confirm('Are you sure you want to delete all email entries? This cannot be undone.')) {
      try {
        const response = await apiCall('emails', {
          method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
          setEmails([]);
          setStats({ total: 0, today: 0, week: 0 });
          alert(`Successfully deleted ${result.deletedCount} email records.`);
        } else {
          alert('Failed to delete emails. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting emails:', error);
        alert('Network error. Please try again.');
      }
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-700/30 border-t-green-700 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading admin data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Backend Connection Error</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="flex gap-3">
              <Button onClick={() => window.location.reload()} variant="outline" className="flex-1">
                Retry
              </Button>
              <Button onClick={() => navigate('/')} className="flex-1">
                Back Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="container mx-auto px-6 pt-32 pb-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-accent/10 rounded-full transition-all hover:scale-110"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div>
              <h1 className="text-3xl font-bold text-green-700">dooza social Admin</h1>
              <p className="text-muted-foreground">Social Media User Signups</p>
            </div>
          </div>

          <div className="flex gap-3">
            {emails.length > 0 && (
              <>
                <Button 
                  onClick={handleExportEmails}
                  variant="outline" 
                  className="flex items-center gap-2 hover:bg-accent hover:text-accent-foreground"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
                
                <Button 
                  onClick={handleClearEmails}
                  variant="destructive" 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Signups</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Signups</p>
                  <p className="text-2xl font-bold text-foreground">{stats.today}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold text-foreground">{stats.week}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Email List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Submissions
            </CardTitle>
            <CardDescription>
              {emails.length === 0 
                ? "No email submissions yet. Share your signup link to start collecting emails!"
                : `${emails.length} total email${emails.length !== 1 ? 's' : ''} collected`
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {emails.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">No submissions yet</h3>
                <p className="text-muted-foreground mb-4">When users sign up, their emails will appear here.</p>
                <Button onClick={() => navigate('/signup')} variant="outline">
                  Test Signup Form
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {emails.map((entry, index) => (
                  <div 
                    key={entry.id} 
                    className="flex items-center justify-between p-4 bg-accent/5 rounded-lg border border-border hover:bg-accent/10 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-700 font-bold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      
                      <div>
                        <p className="font-semibold text-foreground">{entry.email}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(entry.timestamp)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {getTimeAgo(entry.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/')} 
              variant="outline"
              className="rounded-full hover:bg-accent hover:text-accent-foreground"
            >
              Back to Website
            </Button>
            <Button 
              onClick={() => navigate('/signup')} 
              className="rounded-full shadow-glow hover:shadow-xl hover:scale-105 transition-all"
            >
              Test Signup Form
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
