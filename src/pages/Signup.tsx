import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { addSocialSignup, getClientInfo } from "@/lib/supabase-social";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    try {
      // Get client info for tracking
      const clientInfo = await getClientInfo();
      
      // Submit email directly to new Supabase database
      const signupData = {
        email,
        timestamp: new Date().toISOString(),
        ip_address: clientInfo.ip_address,
        user_agent: clientInfo.user_agent,
        signup_source: 'dooza_social_website',
        status: 'pending' as const
      };

      const result = await addSocialSignup(signupData);
      
      if (result) {
        console.log('Social signup saved successfully:', email);
        
        // Track conversion event in Google Analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', 'form_submit', {
            event_category: 'engagement',
            event_label: 'social_media_signup',
            value: 1
          });

          // Track Google Ads conversion for social media tool
          gtag('event', 'conversion', {
            'send_to': 'AW-10872232955/oI5hCKLM7KgbEPu3pMAo',
            'value': 1.0,
            'currency': 'USD',
            'event_category': 'Social Media Lead',
            'event_label': 'Submit social media signup form'
          });
        }
        
        setIsSubmitted(true);
      } else {
        throw new Error('Failed to save signup');
      }
    } catch (error) {
      console.error('Database error:', error);
      alert('Failed to submit signup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 pt-20">
        <div className="w-full max-w-lg">
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-2xl">
            <h1 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">
              <span className="text-orange-500">dooza social</span>
            </h1>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to Social Media Management!
            </h2>
            
            <p className="text-lg text-gray-600 mb-10">
              Check your email to connect your social accounts
            </p>
            
            <Button 
              onClick={() => navigate('/')} 
              variant="outline" 
              className="w-full py-3 rounded-full border-2 border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-all duration-300"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-lg">
        <div className="bg-white border border-gray-200 rounded-2xl p-12 shadow-2xl">
          
          {/* Back button */}
          <div className="flex items-center gap-2 mb-10">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleGoBack}
              className="p-3 hover:bg-gray-100 rounded-full transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
          
          {/* Main content */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">
              <span className="text-orange-500">dooza social</span>
            </h1>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Start Managing Your Socials
            </h2>
            
            <p className="text-lg text-gray-600">
              No credit card required
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="email"
                placeholder="Enter your email to get started"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 text-lg rounded-lg border-2 border-gray-300 focus:border-orange-500 focus:ring-0 transition-all duration-300"
                disabled={isLoading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Setting up...
                </div>
              ) : (
                "Start Free Trial"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
