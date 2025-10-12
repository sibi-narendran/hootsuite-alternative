import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useNavigate } from "react-router-dom";

const FinalCTA = () => {
  const { ref, isVisible } = useScrollAnimation(0.3);
  const navigate = useNavigate();

  return (
    <section ref={ref} className="py-20 bg-orange-500 relative overflow-hidden">
      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Urgency indicator */}
        <div className="inline-block bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-6 animate-bounce">
          ⏰ LIMITED TIME: 70% OFF
        </div>
        
        <h2 
          className={`text-3xl md:text-5xl font-black text-white mb-6 transition-all duration-700 leading-tight ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '100ms' }}
        >
          Don't Let Your Competitors Win
        </h2>
        
        <p 
          className={`text-xl text-orange-100 mb-8 font-semibold max-w-2xl mx-auto transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '150ms' }}
        >
          Join businesses getting 3x better conversions with dooza
        </p>
        
        <div 
          className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <Button 
            variant="default" 
            size="lg" 
            className="bg-white text-orange-600 hover:bg-gray-50 px-10 py-4 text-xl font-black transition-all duration-300 hover:scale-105 shadow-2xl border-0 mb-4"
            onClick={() => navigate('/signup')}
          >
            START FREE TRIAL NOW →
          </Button>
          
          <p className="text-orange-100 text-sm">
            ✅ Setup in 2 minutes • ✅ No credit card required • ✅ 30-day guarantee
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
