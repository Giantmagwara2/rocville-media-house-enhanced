import PortfolioVisualization from './components/PortfolioVisualization';
import AIConciergeChat from './components/AIConciergeChat';
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/ui/navbar'
import { useEffect } from 'react';
import { Footer } from './components/ui/footer'
import HomePage from './pages/HomePage'
import AboutUsPage from './pages/AboutUsPage'
import ServicesPage from './pages/ServicesPage'
import PortfolioPage from './pages/PortfolioPage'
import ContactUsPage from './pages/ContactUsPage'
import BlogPage from './pages/BlogPage'
import { Toaster } from './components/ui/toaster'
import FloatingAIAssistant from './components/ui/floating-ai-assistant'
import { AIChatWidget } from './components/ui/ai-chat-widget'
import { ErrorBoundary } from './components/ErrorBoundary';
import { usePerformanceOptimizer } from './hooks/use-performance-optimizer';
import { useUserPersonalization } from './hooks/use-user-personalization';
import { useAccessibilityAudit } from './hooks/use-accessibility-audit';
import { useEventStream } from './hooks/use-event-stream';
import { useApiHealthDashboard } from './hooks/use-api-health-dashboard';
import './App.css'
function App() {
  usePerformanceOptimizer();
  useUserPersonalization();
  useAccessibilityAudit();
  useEventStream();
  useApiHealthDashboard();
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const toggleAIChat = () => {
    setIsAIChatOpen(!isAIChatOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ErrorBoundary>
      <Router>
        <div className={`min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-cyan-50/30 ${theme}`}> 
          <Navbar />
          <button
            className="fixed top-4 right-4 z-50 px-3 py-2 rounded bg-gray-800 text-white shadow-lg"
            onClick={toggleTheme}
          >
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/contact" element={<ContactUsPage />} />
              <Route path="/blog" element={<BlogPage />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />

          {/* AI Assistant Components */}
          <FloatingAIAssistant onToggle={toggleAIChat} isOpen={isAIChatOpen} />
          <AIChatWidget 
            isOpen={isAIChatOpen} 
            onToggle={toggleAIChat} 
          />
          <AIConciergeChat />
          {/* Example portfolio visualization */}
          <PortfolioVisualization portfolio={{ assets: [
            { sector: 'Renewable Energy', weight: 0.4, risk: 0.08, esgScore: 90 },
            { sector: 'Tech', weight: 0.3, risk: 0.15, esgScore: 70 },
            { sector: 'Healthcare', weight: 0.2, risk: 0.12, esgScore: 80 },
            { sector: 'Utilities', weight: 0.1, risk: 0.09, esgScore: 60 },
          ] }} />
        </div>
      </Router>
    </ErrorBoundary>
  );

}

export default App