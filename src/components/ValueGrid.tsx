import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Bot, Infinity, Users, Calendar, BarChart3, Zap } from "lucide-react";

const ValueGrid = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);

  const features = [
    {
      icon: <Bot className="w-6 h-6" />,
      title: "AI Content Creation",
      description: "Generate engaging posts and captions with AI assistance"
    },
    {
      icon: <Infinity className="w-6 h-6" />,
      title: "Unlimited Posts",
      description: "No limits on scheduled posts or social accounts"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Multi-Platform Publishing",
      description: "Facebook, Instagram, Twitter, LinkedIn, TikTok, YouTube, Pinterest"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Smart Scheduling",
      description: "Optimal posting times with advanced calendar management"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Advanced Analytics",
      description: "Deep insights into engagement, reach, and ROI tracking"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Approval workflows, team roles, and content planning"
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Why Businesses Choose dooza social
          </h2>
          <p className="text-xl text-gray-700 font-semibold">
            Everything you need to dominate your social media presence
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-orange-500 transition-all duration-300 hover:shadow-lg ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueGrid;
