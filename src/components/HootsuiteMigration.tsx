import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import { Download, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HootsuiteMigration = () => {
  const { ref, isVisible } = useScrollAnimation(0.3);
  const navigate = useNavigate();

  return (
    <section ref={ref} className="py-16 bg-orange-50 border-t-4 border-orange-500">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Urgency badge */}
            <div className="inline-block bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-6">
              🚀 Switch in Under 5 Minutes
            </div>
            
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
              Migrate from Hootsuite Instantly
            </h2>
            
            <p className="text-lg text-gray-700 font-semibold mb-8 max-w-2xl mx-auto">
              Import all your social accounts, scheduled posts, and analytics with one click. No setup required.
            </p>
            
            <Button 
              variant="default" 
              size="lg" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-black shadow-lg border-0"
              onClick={() => navigate('/signup')}
            >
              IMPORT FROM HOOTSUITE →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HootsuiteMigration;
