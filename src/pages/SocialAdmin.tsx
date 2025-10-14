import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Mail, Calendar, Download, Trash2, UserCheck, Clock } from "lucide-react";
import { getSocialSignups, clearAllSocialSignups, calculateSocialStats, updateSignupStatus, SocialSignup } from "@/lib/supabase-social";

interface SocialStats {
  total: number;
  today: number;
  week: number;
  pending: number;
  verified: number;
  active: number;
}

const SocialAdmin = () => {
  const [signups, setSignups] = useState<SocialSignup[]>([]);
  const [stats, setStats] = useState<SocialStats>({ total: 0, today: 0, week: 0, pending: 0, verified: 0, active: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      const signupsData = await getSocialSignups();
      setSignups(signupsData);
      setStats(calculateSocialStats(signupsData));
    } catch (error) {
      console.error('Error loading social signups:', error);
      setError('Failed to connect to social signups database. Make sure Supabase is configured.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportSignups = () => {
    if (signups.length === 0) return;

    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Status,Signup Source,Timestamp,IP Address,User Agent,ID\n"
      + signups.map(signup => 
          `"${signup.email}","${signup.status}","${signup.signup_source}","${new Date(signup.created_at || signup.timestamp || '').toLocaleString()}","${signup.ip_address || 'N/A'}","${signup.user_agent || 'N/A'}","${signup.id}"`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dooza_social_signups_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearSignups = async () => {
    if (window.confirm('Are you sure you want to delete all social signup records? This cannot be undone.')) {
      try {
        const deletedCount = await clearAllSocialSignups();
        setSignups([]);
        setStats({ total: 0, today: 0, week: 0, pending: 0, verified: 0, active: 0 });
        alert(`Successfully deleted ${deletedCount} social signup records.`);
      } catch (error) {
        console.error('Error deleting signups:', error);
        alert('Failed to delete signups. Please try again.');
      }
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: 'pending' | 'verified' | 'active') => {
    try {
      await updateSignupStatus(id, newStatus);
      // Reload data to reflect changes
      await loadData();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case 'verified':
        return <Badge variant="secondary" className="bg-blue-500 text-white">Verified</Badge>;
      case 'pending':
      default:
        return <Badge variant="outline" className="bg-yellow-500 text-white">Pending</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-600/30 border-t-orange-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading social signups...</p>
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
            <h2 className="text-xl font-bold text-foreground mb-2">Database Connection Error</h2>
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
              <h1 className="text-3xl font-bold text-orange-600">dooza social Admin</h1>
              <p className="text-muted-foreground">Social Media User Signups</p>
            </div>
          </div>

          <div className="flex gap-3">
            {signups.length > 0 && (
              <>
                <Button 
                  onClick={handleExportSignups}
                  variant="outline" 
                  className="flex items-center gap-2 hover:bg-accent hover:text-accent-foreground"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
                
                <Button 
                  onClick={handleClearSignups}
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Today</p>
                  <p className="text-xl font-bold">{stats.today}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Mail className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">This Week</p>
                  <p className="text-xl font-bold">{stats.week}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pending</p>
                  <p className="text-xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Verified</p>
                  <p className="text-xl font-bold">{stats.verified}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Active</p>
                  <p className="text-xl font-bold">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Signups List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Social Media Signups
            </CardTitle>
            <CardDescription>
              {signups.length === 0 
                ? "No social media signups yet. Share your signup link to start collecting signups!"
                : `${signups.length} total signup${signups.length !== 1 ? 's' : ''} collected`
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {signups.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">No signups yet</h3>
                <p className="text-muted-foreground mb-4">When users sign up for dooza social, they'll appear here.</p>
                <Button onClick={() => navigate('/signup')} variant="outline">
                  Test Signup Form
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {signups.map((signup, index) => (
                  <div 
                    key={signup.id} 
                    className="flex items-center justify-between p-4 bg-accent/5 rounded-lg border border-border hover:bg-accent/10 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-bold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      
                      <div>
                        <p className="font-semibold text-foreground">{signup.email}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(signup.created_at || signup.timestamp || '')} • {signup.signup_source}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusBadge(signup.status || 'pending')}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {getTimeAgo(signup.created_at || signup.timestamp || '')}
                        </p>
                      </div>
                      
                      <div className="flex gap-1">
                        {signup.status !== 'verified' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleStatusUpdate(signup.id!, 'verified')}
                            className="text-xs"
                          >
                            Verify
                          </Button>
                        )}
                        {signup.status !== 'active' && (
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={() => handleStatusUpdate(signup.id!, 'active')}
                            className="text-xs"
                          >
                            Activate
                          </Button>
                        )}
                      </div>
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

export default SocialAdmin;
