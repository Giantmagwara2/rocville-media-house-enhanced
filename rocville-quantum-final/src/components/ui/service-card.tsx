import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { images } from "../../assets/images";

interface ServiceCardProps {
  title: string;
  description: string;
  features: string[];
  price?: string;
  image: string;
  category: string;
  gradient: string;
}

export function ServiceCard({ 
  title, 
  description, 
  features, 
  price, 
  image, 
  category, 
  gradient 
}: ServiceCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Card 
      className="morphic-card group relative overflow-hidden border-0 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md hover:from-white/10 hover:to-white/15 transition-all duration-500 transform hover:scale-105 hover:rotate-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Gradient Effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: gradient
        }}
      />

      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cosmic-deep/80 to-transparent" />

        {/* Category Badge */}
        <Badge 
          className="absolute top-4 left-4 bg-quantum-primary/90 text-cosmic-deep font-semibold"
        >
          {category}
        </Badge>

        {/* Floating Particles Effect */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-quantum-accent rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      <CardHeader className="relative z-10">
        <CardTitle className="text-xl font-bold text-quantum-primary group-hover:text-quantum-accent transition-colors duration-300">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-300 leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="relative z-10 space-y-4">
        {/* Features List */}
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li 
              key={index} 
              className="flex items-center text-sm text-gray-300"
            >
              <div className="w-2 h-2 bg-quantum-accent rounded-full mr-3 animate-pulse" />
              {feature}
            </li>
          ))}
        </ul>

        {/* Price Display */}
        {price && (
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="text-sm text-gray-400">Starting at</span>
            <span className="text-2xl font-bold text-quantum-accent">{price}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="relative z-10">
        <Button 
          className="w-full bg-gradient-to-r from-quantum-primary to-neural-purple hover:from-neural-purple hover:to-quantum-accent transition-all duration-300 transform hover:scale-105"
          onClick={() => window.location.href = '/contact'}
        >
          Learn More
        </Button>
      </CardFooter>

      {/* Neural Network Connection Lines */}
      <svg 
        className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-500"
        width="100%" 
        height="100%"
      >
        <defs>
          <linearGradient id={`neural-${title}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--quantum-primary)" />
            <stop offset="100%" stopColor="var(--neural-purple)" />
          </linearGradient>
        </defs>
        <path 
          d="M0,0 Q50,25 100,0 T200,0" 
          stroke={`url(#neural-${title})`} 
          strokeWidth="1" 
          fill="none"
          className="animate-pulse"
        />
        <path 
          d="M0,100 Q50,75 100,100 T200,100" 
          stroke={`url(#neural-${title})`} 
          strokeWidth="1" 
          fill="none"
          className="animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </svg>
    </Card>
  );
}