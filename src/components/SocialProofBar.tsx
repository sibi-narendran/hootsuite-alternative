import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const SocialProofBar = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);

  const testimonials = [
    {
      quote: "Cut our social media management costs by 70%",
      source: "Interio Square"
    },
    {
      quote: "Boosted engagement 3x across all platforms",
      source: "Suresh Timbers"
    },
    {
      quote: "Migrated from Hootsuite in minutes, saved thousands",
      source: "Adam Labs"
    }
  ];

  return (
    <section ref={ref} className="py-16 bg-white border-t-2 border-b-2 border-orange-200">
      <div className="container mx-auto px-6">
        {/* Social proof header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
            Join Businesses Dominating Social Media
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`bg-orange-50 border-l-4 border-orange-500 p-6 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="flex items-start gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-orange-500 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
                <span className="text-xs text-gray-600 ml-2">Verified Review</span>
              </div>
              <blockquote className="text-gray-900 font-semibold mb-3 text-sm leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              <cite className="text-xs font-bold text-orange-600">— {testimonial.source}</cite>
            </div>
          ))}
        </div>
        
        {/* Trusted by section */}
        <div 
          className={`text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '450ms' }}
        >
          <p className="text-sm text-muted-foreground mb-4">Trusted by</p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground font-medium">
            <span>Marketing Agencies</span>
            <span>•</span>
            <span>E-commerce Brands</span>
            <span>•</span>
            <span>SaaS Companies</span>
            <span>•</span>
            <span>Influencers</span>
            <span>•</span>
            <span>Small Businesses</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofBar;
