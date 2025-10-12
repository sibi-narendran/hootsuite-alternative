import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface FeatureBlockProps {
  title: string;
  description: string;
  imageUrl: string;
  reverse?: boolean;
}

const FeatureBlock = ({ title, description, imageUrl, reverse = false }: FeatureBlockProps) => {
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <section ref={ref} className="py-16 md:py-24 bg-feature/30">
      <div className="container mx-auto px-6">
        <div className={`grid md:grid-cols-2 gap-12 items-center ${reverse ? 'md:flex-row-reverse' : ''}`}>
          <div 
            className={`${reverse ? 'md:order-2' : ''} transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
              {title}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {description}
            </p>
            <div className="flex items-center text-highlight hover:text-highlight/80 transition-colors cursor-pointer group">
              <span className="font-semibold">Learn more</span>
              <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </div>
          </div>
          <div 
            className={`${reverse ? 'md:order-1' : ''} transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="bg-gradient-accent rounded-2xl aspect-[4/3] overflow-hidden group shadow-soft hover:shadow-glow transition-all duration-500 border border-accent/20">
              <img 
                src={imageUrl} 
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureBlock;
