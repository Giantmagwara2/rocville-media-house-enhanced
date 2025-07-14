import * as React from "react";
import { useState, useEffect } from "react";

interface FloatingAIAssistantProps {
  onToggle?: () => void;
  isOpen?: boolean;
}

const FloatingAIAssistant: React.FC<FloatingAIAssistantProps> = ({ onToggle, isOpen = false }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Magical floating animation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for magical effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Magical particle effects */}
      <div className="fixed inset-0 pointer-events-none z-40">
        <div 
          className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-30 animate-pulse floating-particle"
          style={{
            left: mousePosition.x - 100,
            top: mousePosition.y - 100,
          }}
        />
        <div 
          className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-40 animate-pulse floating-particle"
          style={{
            left: mousePosition.x + 80,
            top: mousePosition.y - 80,
          }}
        />
      </div>

      {/* Main floating assistant */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Magical aura */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/30 to-purple-500/30 blur-xl transition-all duration-1000 ${isAnimating ? 'scale-150 opacity-70' : 'scale-100 opacity-40'}`} />
        
        {/* Orbital rings */}
        <div className="absolute inset-0 rounded-full border border-cyan-400/20" style={{ animation: 'orbit 8s linear infinite' }} />
        <div className="absolute inset-0 rounded-full border border-purple-400/20" style={{ animation: 'orbit 12s linear infinite reverse' }} />
        
        {/* Main button */}
        <button
          onClick={onToggle}
          className={`relative w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 shadow-2xl hover:shadow-cyan-400/50 transition-all duration-500 group overflow-hidden ${
            isAnimating ? 'scale-110 rotate-12' : 'scale-100 rotate-0'
          } ${isOpen ? 'rotate-180' : ''}`}
          style={{
            boxShadow: '0 0 30px rgba(0, 212, 255, 0.4), 0 0 60px rgba(139, 92, 246, 0.3)',
          }}
        >
          {/* Inner glow */}
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
          
          {/* AI Brain Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className={`w-8 h-8 text-white transition-all duration-500 ${isOpen ? 'rotate-180 scale-90' : 'rotate-0 scale-100'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                  <circle cx="12" cy="12" r="1" fill="currentColor" className="animate-pulse" />
                  <circle cx="8" cy="10" r="0.5" fill="currentColor" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <circle cx="16" cy="10" r="0.5" fill="currentColor" className="animate-pulse" style={{ animationDelay: '1s' }} />
                </>
              )}
            </svg>
          </div>

          {/* Ripple effect on hover */}
          <div className="absolute inset-0 rounded-full bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-500" />
        </button>

        {/* Floating notification badge */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-bounce">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        </div>

        {/* Magical sparkles */}
        <div className="absolute -top-4 -left-4 w-3 h-3 bg-cyan-400 rounded-full opacity-60 animate-ping" style={{ animationDelay: '0s' }} />
        <div className="absolute -bottom-2 -left-6 w-2 h-2 bg-purple-400 rounded-full opacity-50 animate-ping" style={{ animationDelay: '1s' }} />
        <div className="absolute -top-6 -right-2 w-1 h-1 bg-yellow-400 rounded-full opacity-70 animate-ping" style={{ animationDelay: '2s' }} />

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-4 px-4 py-2 bg-slate-800/95 backdrop-blur-xl text-white text-sm rounded-xl border border-cyan-400/20 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-xl">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>AI Assistant Ready</span>
          </div>
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800/95" />
        </div>
      </div>
    </>
  );
};

export default FloatingAIAssistant;

