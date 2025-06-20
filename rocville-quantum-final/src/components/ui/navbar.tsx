import * as React from "react";
import { cn } from "../../lib/utils";
import { COMPANY } from "../../lib/constants";
import { Button } from "./button";

interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  transparent?: boolean;
}

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ className, transparent = false, ...props }, ref) => {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    React.useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
      };
      
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
      <header
        ref={ref}
        className={cn(
          "neural-nav fixed top-4 left-4 right-4 z-50 transition-all duration-500 rounded-2xl",
          isScrolled || !transparent 
            ? "backdrop-blur-xl shadow-2xl py-3 border border-cyan-400/20" 
            : "bg-transparent py-5",
          className
        )}
        {...props}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <a href="/" className="holographic-text quantum-heading text-2xl font-bold hover:scale-105 transition-transform duration-300">
                {COMPANY.name}
              </a>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <a href="/" className="nav-link text-white/90 hover:text-cyan-400 font-medium transition-all duration-400 relative">
                Home
              </a>
              <a href="/services" className="nav-link text-white/90 hover:text-cyan-400 font-medium transition-all duration-400 relative">
                Services
              </a>
              <a href="/portfolio" className="nav-link text-white/90 hover:text-cyan-400 font-medium transition-all duration-400 relative">
                Portfolio
              </a>
              <a href="/about" className="nav-link text-white/90 hover:text-cyan-400 font-medium transition-all duration-400 relative">
                About
              </a>
              <a href="/blog" className="nav-link text-white/90 hover:text-cyan-400 font-medium transition-all duration-400 relative">
                Blog
              </a>
              <Button variant="primary" size="md" className="quantum-btn ml-4 px-6 py-2 rounded-full text-white font-semibold">
                Contact Us
              </Button>
            </nav>
            
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-3 rounded-xl text-white/90 hover:bg-cyan-400/20 transition-all duration-300 hover:scale-110 neural-pulse"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
          
          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className="lg:hidden pt-6 pb-4 space-y-2 fade-in-up morphic-card rounded-2xl mt-4 p-6">
              <a
                href="/"
                className="block py-3 px-4 text-white/90 hover:bg-cyan-400/20 rounded-xl transition-all duration-300 hover:scale-105 hover:text-cyan-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="/services"
                className="block py-3 px-4 text-white/90 hover:bg-cyan-400/20 rounded-xl transition-all duration-300 hover:scale-105 hover:text-cyan-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </a>
              <a
                href="/portfolio"
                className="block py-3 px-4 text-white/90 hover:bg-cyan-400/20 rounded-xl transition-all duration-300 hover:scale-105 hover:text-cyan-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Portfolio
              </a>
              <a
                href="/about"
                className="block py-3 px-4 text-white/90 hover:bg-cyan-400/20 rounded-xl transition-all duration-300 hover:scale-105 hover:text-cyan-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </a>
              <a
                href="/blog"
                className="block py-3 px-4 text-white/90 hover:bg-cyan-400/20 rounded-xl transition-all duration-300 hover:scale-105 hover:text-cyan-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </a>
              <div className="pt-4 px-4">
                <Button variant="primary" size="md" className="quantum-btn w-full rounded-full font-semibold">
                  Contact Us
                </Button>
              </div>
            </nav>
          )}
        </div>
        
        {/* Neural connection animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent neural-pulse" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent neural-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </header>
    );
  }
);

Navbar.displayName = "Navbar";

export { Navbar };

