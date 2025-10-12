import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handlePricingClick = () => {
    navigate('/pricing');
  };

  return (
    <header 
      className={`fixed top-12 left-0 right-0 z-50 bg-background border-b border-border transition-all duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container mx-auto px-6 py-4 animate-slide-down">
        <nav className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            <a 
              href="/" 
              className="text-2xl font-bold text-foreground hover:opacity-80 transition-opacity"
            >
              dooza social
            </a>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <button 
              onClick={() => scrollToSection("features")}
              className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105"
            >
              Features
            </button>
            <button 
              onClick={handlePricingClick}
              className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105"
            >
              Pricing
            </button>
          </div>

          <div className="flex items-center gap-3 flex-1 justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg"
              onClick={() => window.open('https://cal.com/sibinarendran/demo', '_blank')}
            >
              Book a Call
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg"
              onClick={() => navigate('/signup')}
            >
              Start Free Trial
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
