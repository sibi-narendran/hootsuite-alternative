import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      description: "Everything you need to get started",
      features: [
        "Connect up to 3 social media accounts",
        "Schedule up to 30 posts per month",
        "Basic analytics and engagement tracking",
        "Content calendar with weekly view",
        "AI-powered caption suggestions",
        "Image and video uploads up to 100MB",
        "Basic hashtag recommendations",
        "Email support",
        "Mobile app access"
      ],
      buttonText: "Start Free",
      highlighted: false
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "For professional use and teams",
      features: [
        "Everything in Free",
        "Unlimited social media accounts",
        "Unlimited scheduled posts",
        "Advanced analytics and competitor tracking",
        "Team collaboration with approval workflows",
        "Custom branding and white-label options",
        "Bulk content upload and scheduling",
        "Advanced AI content generation",
        "Priority customer support",
        "Integration with CRM and marketing tools"
      ],
      buttonText: "Choose Pro",
      highlighted: true,
      annualPrice: "$20/month billed annually"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-6 pt-40 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Start Managing Social Media for Free
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Everything you need to dominate social media with AI
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white border rounded-2xl p-8 transition-all duration-500 ${
                  plan.highlighted 
                    ? 'border-orange-500 shadow-2xl ring-2 ring-orange-500/20 scale-105' 
                    : 'border-gray-200 hover:shadow-2xl hover:border-orange-300'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-500 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-bold text-orange-600">{plan.price}</span>
                    <span className="text-gray-500 ml-1">{plan.period}</span>
                  </div>
                  {plan.annualPrice && (
                    <p className="text-sm text-green-600 font-semibold mb-2">
                      or {plan.annualPrice}
                    </p>
                  )}
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-orange-600" />
                      </div>
                      <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={plan.highlighted ? "default" : "outline"}
                  size="lg"
                  className={`w-full rounded-full py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 ${
                    plan.highlighted 
                      ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-xl hover:shadow-2xl' 
                      : 'border-2 border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 shadow-lg hover:shadow-xl'
                  }`}
                  onClick={() => navigate('/signup')}
                >
                  {plan.buttonText}
                </Button>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
};

export default Pricing;
