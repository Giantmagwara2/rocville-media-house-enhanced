import * as React from "react";
import { cn } from "../../lib/utils";
import { H1, Lead } from "./typography";
import { Button } from "./button";

interface HeroProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  backgroundImage?: string;
  overlayColor?: string;
  align?: "left" | "center" | "right";
  size?: "sm" | "md" | "lg";
}

const Hero = React.forwardRef<HTMLDivElement, HeroProps>(
  ({ 
    className, 
    title, 
    subtitle, 
    ctaText, 
    ctaLink = "/contact", 
    secondaryCtaText,
    secondaryCtaLink = "/services",
    backgroundImage,
    overlayColor = "bg-primary/80",
    align = "center",
    size = "lg",
    ...props 
  }, ref) => {
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
    
    React.useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      };
      
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const alignmentClasses = {
      left: "text-left items-start",
      center: "text-center items-center",
      right: "text-right items-end",
    };

    const sizeClasses = {
      sm: "py-16 md:py-20",
      md: "py-20 md:py-28",
      lg: "py-24 md:py-36",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "quantum-hero relative w-full overflow-hidden min-h-screen flex items-center",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {/* Particle System */}
        <div className="particle-system">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="particle" style={{ animationDelay: `${i * 1.5}s` }} />
          ))}
        </div>
        
        {/* Interactive Orb following mouse */}
        <div 
          className="absolute w-96 h-96 rounded-full opacity-20 pointer-events-none transition-all duration-300 ease-out"
          style={{
            background: `radial-gradient(circle, var(--quantum-primary) 0%, transparent 70%)`,
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
        
        {/* Floating Geometric Elements */}
        <div className="absolute top-20 left-20 w-20 h-20 border border-cyan-400/30 quantum-float" 
             style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-32 w-16 h-16 border border-purple-400/30 quantum-float" 
             style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-32 left-40 w-12 h-12 border border-green-400/30 quantum-float" 
             style={{ animationDelay: '4s' }} />
        <div className="absolute top-1/2 right-20 w-8 h-8 border border-blue-400/30 quantum-float" 
             style={{ animationDelay: '6s' }} />

        {/* Background Image with Overlay */}
        {backgroundImage && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0" 
              style={{ backgroundImage: `url(${backgroundImage})` }}
            />
            <div className={`absolute inset-0 ${overlayColor} z-0`} />
          </>
        )}

        {/* Neural Network Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="neural-grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="2" fill="currentColor" className="text-cyan-400">
                  <animate attributeName="r" values="1;3;1" dur="4s" repeatCount="indefinite" />
                </circle>
                <line x1="50" y1="50" x2="100" y2="0" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400/30" />
                <line x1="50" y1="50" x2="100" y2="100" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400/30" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#neural-grid)" />
          </svg>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className={cn(
            "flex flex-col max-w-6xl mx-auto gap-8",
            alignmentClasses[align],
            align === "center" ? "mx-auto" : "",
            align === "right" ? "ml-auto" : "",
          )}>
            <H1 
              className={cn(
                "holographic-text quantum-heading text-6xl md:text-8xl lg:text-9xl font-bold leading-none",
                backgroundImage ? "text-white" : ""
              )}
            >
              {title}
            </H1>
            
            {subtitle && (
              <Lead 
                className={cn(
                  "neural-body max-w-3xl text-xl md:text-2xl leading-relaxed fade-in-up",
                  backgroundImage ? "text-white/90" : "text-white/80"
                )}
              >
                {subtitle}
              </Lead>
            )}
            
            <div className={cn(
              "flex flex-col sm:flex-row gap-6 mt-8 fade-in-up",
              align === "center" ? "justify-center" : "",
              align === "right" ? "justify-end" : "",
            )}>
              {ctaText && (
                <Button 
                  variant="cta" 
                  size="lg" 
                  className="quantum-btn px-8 py-4 rounded-full text-white font-semibold text-lg"
                  asChild
                >
                  <a href={ctaLink}>{ctaText}</a>
                </Button>
              )}
              
              {secondaryCtaText && (
                <Button 
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 rounded-full border-2 border-cyan-400/50 text-cyan-400 font-semibold text-lg transition-all duration-300 hover:bg-cyan-400/10 hover:border-cyan-400"
                  asChild
                >
                  <a href={secondaryCtaLink}>{secondaryCtaText}</a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Hero.displayName = "Hero";

export { Hero };

