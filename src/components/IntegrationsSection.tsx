import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SiShopify, SiSlack, SiStripe, SiMailchimp, SiWoocommerce, SiBigcommerce, SiMagento, SiPaypal, SiMeta, SiAmazon, SiDiscord } from "react-icons/si";
import { FaHeadset, FaCreditCard, FaEnvelope, FaInbox, FaUsers } from "react-icons/fa";

const IntegrationsSection = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);

  const integrations = [
    { name: "Google Sheets", icon: <FaEnvelope className="w-5 h-5" />, color: "text-green-600" },
    { name: "Notion", icon: <FaInbox className="w-5 h-5" />, color: "text-gray-700" },
    { name: "Airtable", icon: <FaInbox className="w-5 h-5" />, color: "text-orange-600" },
    { name: "Slack", icon: <SiSlack className="w-5 h-5" />, color: "text-purple-600" },
    { name: "Gmail", icon: <FaEnvelope className="w-5 h-5" />, color: "text-red-600" },
    { name: "HubSpot", icon: <FaEnvelope className="w-5 h-5" />, color: "text-orange-600" },
    { name: "Trello", icon: <FaUsers className="w-5 h-5" />, color: "text-blue-600" },
    { name: "Asana", icon: <FaUsers className="w-5 h-5" />, color: "text-red-600" },
    { name: "Google Drive", icon: <FaInbox className="w-5 h-5" />, color: "text-blue-600" },
    { name: "Pipedrive", icon: <FaHeadset className="w-5 h-5" />, color: "text-green-600" },
    { name: "Mailchimp", icon: <SiMailchimp className="w-5 h-5" />, color: "text-yellow-600" },
    { name: "API + Webhooks", icon: <FaHeadset className="w-5 h-5" />, color: "text-indigo-600" },
  ];

  // Duplicate the array for seamless loop
  const allIntegrations = [...integrations, ...integrations];

  return (
    <section ref={ref} className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <h2 
          className={`text-3xl md:text-4xl font-bold text-center text-foreground mb-4 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Integrations
        </h2>
        
        <div 
          className={`relative transition-all duration-700 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
          
          {/* Sliding container */}
          <div className="overflow-hidden">
            <div className="flex animate-scroll hover:pause-animation">
              {allIntegrations.map((app, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 mx-8 px-6 py-4 bg-card border border-border rounded-xl hover:border-highlight hover:shadow-glow transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-white flex items-center justify-center ${app.color} group-hover:scale-110 transition-transform shadow-sm`}>
                      {app.icon}
                    </div>
                    <span className="text-foreground font-semibold whitespace-nowrap">
                      {app.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
