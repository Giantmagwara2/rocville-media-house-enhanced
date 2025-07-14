import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/ui/navbar'
import { Footer } from './components/ui/footer'
import HomePage from './pages/HomePage'
import AboutUsPage from './pages/AboutUsPage'
import ServicesPage from './pages/ServicesPage'
import PortfolioPage from './pages/PortfolioPage'
import ContactUsPage from './pages/ContactUsPage'
import BlogPage from './pages/BlogPage'
import { Toaster } from './components/ui/toaster'
import { ErrorBoundary } from './components/ui/error-boundary'
import FloatingAIAssistant from './components/ui/floating-ai-assistant'
import { AIChatWidget } from './components/ui/ai-chat-widget'
import './App.css'

function App() {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  const toggleAIChat = () => {
    setIsAIChatOpen(!isAIChatOpen);
  };

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-cyan-50/30">
          <Navbar />
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
            phoneNumber="254753426492"
          />
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App