import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Link, Rocket, Zap } from "lucide-react";

const HowItWorks = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);

  const steps = [
    {
      number: "1",
      icon: <Link className="w-6 h-6" />,
      title: "Create with AI",
      description: "Easily create forms by prompting our AI builder"
    },
    {
      number: "2",
      icon: <Rocket className="w-6 h-6" />,
      title: "Publish",
      description: "Get higher conversions with fast-loading forms"
    },
    {
      number: "3",
      icon: <Zap className="w-6 h-6" />,
      title: "Automate",
      description: "Push results to automations with our integrations"
    }
  ];

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div 
          className={`text-center mb-20 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Get Started in 3 Simple Steps
          </h2>
          <p className="text-lg text-gray-700 font-semibold">
            From zero to converting forms in under 5 minutes
          </p>
        </div>
        
        {/* Desktop: horizontal layout with connecting lines */}
        <div className="hidden md:block max-w-5xl mx-auto">
          <div className="flex items-center justify-between relative">
            {/* Background connecting line */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-orange-200 z-0"></div>
            
            {steps.map((step, index) => (
              <div
                key={index}
                className={`text-center transition-all duration-700 bg-white px-4 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${(index + 1) * 150}ms` }}
              >
                <div className="flex justify-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 text-white rounded-full font-black text-xl shadow-lg relative z-10">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile: vertical layout without lines */}
        <div className="md:hidden grid grid-cols-1 gap-8 max-w-sm mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`text-center transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${(index + 1) * 150}ms` }}
            >
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 text-white rounded-full font-black text-xl shadow-lg">
                  {step.number}
                </div>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
