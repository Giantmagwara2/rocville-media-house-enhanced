import * as React from "react";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { Button } from "./button";

interface ServiceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon?: React.ReactNode;
  features?: string[];
  ctaText?: string;
  ctaLink?: string;
  variant?: "default" | "featured";
}

const ServiceCard = React.forwardRef<HTMLDivElement, ServiceCardProps>(
  ({ 
    className, 
    title, 
    description, 
    icon, 
    features, 
    ctaText = "Learn More", 
    ctaLink = "#",
    variant = "default",
    ...props 
  }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);
    
    return (
      <Card
        ref={ref}
        className={cn(
          "morphic-card h-full transition-all duration-600 group relative overflow-hidden",
          "hover:scale-105 hover:-translate-y-2",
          variant === "featured" && "border-cyan-400/40",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {/* Holographic overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-purple-400/5 to-green-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Floating particles on hover */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${30 + i * 20}%`,
                  animationDelay: `${i * 0.5}s`
                }}
              />
            ))}
          </div>
        )}

        <CardHeader className="relative z-10">
          {icon && (
            <div className={cn(
              "w-16 h-16 flex items-center justify-center rounded-2xl mb-6 transition-all duration-500 neural-pulse",
              "bg-gradient-to-br from-cyan-400/20 to-purple-400/20 backdrop-blur-sm",
              "group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-cyan-400/25",
              variant === "featured" && "bg-gradient-to-br from-cyan-400/30 to-purple-400/30"
            )}>
              <div className="text-cyan-400 group-hover:text-white transition-colors duration-300">
                {icon}
              </div>
            </div>
          )}
          <CardTitle className={cn(
            "quantum-heading text-xl font-bold transition-all duration-300 text-white",
            "group-hover:text-cyan-400"
          )}>
            {title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <p className="neural-body text-white/80 mb-6 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
            {description}
          </p>
          
          {features && features.length > 0 && (
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li 
                  key={index} 
                  className="flex items-center fade-in-up" 
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  <div className="w-5 h-5 mr-3 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center justify-center neural-pulse">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="neural-body text-white/70 text-sm group-hover:text-white/90 transition-colors duration-300">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
        
        <CardFooter className="relative z-10">
          <Button 
            variant={variant === "featured" ? "primary" : "tertiary"} 
            className={cn(
              "quantum-btn w-full font-semibold transition-all duration-300",
              "hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/25"
            )}
            asChild
          >
            <a href={ctaLink}>{ctaText}</a>
          </Button>
        </CardFooter>
        
        {/* Neural connection lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="neural-line" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(6, 182, 212)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(168, 85, 247)" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="url(#neural-line)" strokeWidth="1" className="group-hover:opacity-100 transition-opacity duration-500" />
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="url(#neural-line)" strokeWidth="1" className="group-hover:opacity-100 transition-opacity duration-500" />
        </svg>
      </Card>
    );
  }
);

ServiceCard.displayName = "ServiceCard";

export { ServiceCard };

