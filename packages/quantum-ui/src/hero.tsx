import React from "react";
import { Button } from "./button";
import { images } from "../../assets/images";

interface HeroProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  children?: React.ReactNode;
}

export function Hero({ 
  title = "Welcome to RocVille Media House", 
  subtitle = "Transforming Ideas into Digital Excellence",
  backgroundImage,
  children 
}: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={backgroundImage || images.hero.main}
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cosmic-deep/80 to-neural-purple/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
          {title}
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-200">
          {subtitle}
        </p>
        {children}
      </div>
    </section>
  );
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

export function Hero() {
  const [particles, setParticles] = React.useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const heroRef = React.useRef<HTMLElement>(null);
  const animationRef = React.useRef<number>();

  React.useEffect(() => {
    // Initialize particles
    const newParticles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.1
      });
    }
    setParticles(newParticles);

    const animate = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        x: particle.x > window.innerWidth ? 0 : particle.x < 0 ? window.innerWidth : particle.x,
        y: particle.y > window.innerHeight ? 0 : particle.y < 0 ? window.innerHeight : particle.y
      })));
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  return (
    <section 
      ref={heroRef}
      className="quantum-hero relative min-h-screen flex items-center justify-center overflow-hidden bg-cosmic-deep"
      onMouseMove={handleMouseMove}
      style={{
        background: `
          linear-gradient(rgba(15, 15, 35, 0.8), rgba(15, 15, 35, 0.9)),
          url(${images.hero.background})
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Neural Network Background */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" className="animate-pulse">
          <defs>
            <pattern id="neural-grid" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="var(--quantum-primary)" opacity="0.3"/>
              <line x1="0" y1="50" x2="100" y2="50" stroke="var(--neural-purple)" strokeWidth="0.5" opacity="0.2"/>
              <line x1="50" y1="0" x2="50" y2="100" stroke="var(--neural-purple)" strokeWidth="0.5" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#neural-grid)"/>
        </svg>
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-quantum-accent animate-pulse"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
              transform: `translate(-50%, -50%)`,
              boxShadow: `0 0 ${particle.size * 2}px var(--quantum-accent)`
            }}
          />
        ))}
      </div>

      {/* Mouse Following Orb */}
      <div
        className="absolute pointer-events-none transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-quantum-primary/20 to-neural-purple/20 blur-2xl animate-pulse" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        <div className="space-y-8">
          {/* Holographic Title */}
          <h1 className="holographic-text text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
            <span className="block">Welcome to</span>
            <span className="block bg-gradient-to-r from-quantum-primary via-neural-purple to-quantum-accent bg-clip-text text-transparent animate-gradient">
              RocVille Media House
            </span>
          </h1>

          {/* Quantum Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed neural-glow">
            Where <span className="text-quantum-accent font-semibold">Fluidic Futurism</span> meets 
            <span className="text-neural-purple font-semibold"> Quantum Innovation</span>. 
            We craft digital experiences that transcend traditional boundaries.
          </p>

          {/* Floating Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {['AI-Powered Solutions', 'Quantum UI/UX', 'Neural Networks', 'Biomorphic Design'].map((feature, index) => (
              <div
                key={feature}
                className="morphic-pill px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-quantum-accent font-medium"
                style={{
                  animationDelay: `${index * 0.2}s`
                }}
              >
                {feature}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              size="lg" 
              className="quantum-button px-8 py-4 text-lg font-semibold bg-gradient-to-r from-quantum-primary to-neural-purple hover:from-neural-purple hover:to-quantum-accent transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              Explore Our Universe
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="neural-button px-8 py-4 text-lg font-semibold border-2 border-quantum-accent text-quantum-accent hover:bg-quantum-accent hover:text-cosmic-deep transition-all duration-300 transform hover:scale-105"
            >
              View Portfolio
            </Button>
          </div>

          {/* Floating Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {[
              { number: '150+', label: 'Projects Completed' },
              { number: '98%', label: 'Client Satisfaction' },
              { number: '24/7', label: 'AI Support' },
              { number: '5★', label: 'Average Rating' }
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="floating-card text-center p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="text-3xl font-bold text-quantum-primary mb-2">{stat.number}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quantum Wave Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cosmic-deep to-transparent">
        <svg className="absolute bottom-0 w-full h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path 
            d="M0,60 C150,120 350,0 500,60 C650,120 850,0 1000,60 C1050,80 1100,100 1200,60 L1200,120 L0,120 Z" 
            fill="rgba(0, 212, 255, 0.1)"
            className="animate-pulse"
          />
        </svg>
      </div>
    </section>
  );
}