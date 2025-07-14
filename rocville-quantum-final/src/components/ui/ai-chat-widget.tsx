import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { cn } from "../../lib/utils";
import { Button } from "./button";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'typing';
}

interface AIChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  phoneNumber: string;
  apiEndpoint?: string;
}

const AIChatWidget: React.FC<AIChatWidgetProps> = ({
  isOpen,
  onToggle,
  phoneNumber,
  apiEndpoint = '/api/ai'
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm RocVille's advanced AI assistant with enhanced training capabilities. I can help you with our services, pricing, and provide intelligent responses using fine-tuned models, RAG retrieval, and continuous learning. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userLocation, setUserLocation] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat();
    }
  }, [isOpen]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get user location for pricing
  useEffect(() => {
    if (isOpen && !userLocation) {
      getUserLocation();
    }
  }, [isOpen]);

  const initializeChat = async () => {
    try {
      // Get user's location for personalized greeting
      const locationData = await fetch(`${apiEndpoint}/location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip: 'auto' })
      }).then(res => res.json());

      setUserLocation(locationData.location);

      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: "Hello! Welcome to RocVille Media House. I'm your AI assistant ready to help with web development, digital marketing, branding, and more. What can I help you with today?",
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages([welcomeMessage]);
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      const fallbackMessage: Message = {
        id: Date.now().toString(),
        content: "Hello! Welcome to RocVille Media House. I'm your AI assistant. How can I help you today?",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages([fallbackMessage]);
    }
  };

  const getUserLocation = async () => {
    try {
      // Try to get user's IP-based location
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      setUserLocation(data);
    } catch (error) {
      console.error('Failed to get location:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // Advanced AI processing with training capabilities
      const conversationHistory = messages.map(msg => msg.content);

      // First, analyze intent with advanced processing
      const intentResponse = await fetch('/api/training/analyze-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userInput,
          conversation_history: conversationHistory
        })
      });

      let response;
      const intentData = await intentResponse.json();

      // Use RAG for complex queries, regular AI for simple ones
      if (intentData.analysis?.technical_complexity > 0.6) {
        const ragResponse = await fetch('/api/training/rag-query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: userInput,
            user_context: { conversation_history: conversationHistory }
          })
        });
        const ragData = await ragResponse.json();
        response = ragData.result?.response?.text || generateAIResponse(userInput);
      } else {
        // Use standard AI processing with context management
        const contextResponse = await fetch('/api/training/context-management', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: 'web_user_' + Date.now(),
            message: userInput
          })
        });

        if (contextResponse.ok) {
          const contextData = await contextResponse.json();
          // Use enhanced response generation
          response = generateEnhancedAIResponse(userInput, intentData.analysis, contextData.context);
        } else {
          response = generateAIResponse(userInput);
        }
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm experiencing some technical difficulties. Let me help you with a basic response: " + generateAIResponse(userInput),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const openWhatsApp = () => {
    const message = "Hello! I'd like to continue our conversation on WhatsApp.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes('service') || input.includes('what do you do')) {
      return "We offer comprehensive digital solutions including:\n\n🌐 Web Development - Custom websites and web applications\n📱 Digital Marketing - SEO, social media, and online advertising\n🎨 Branding & Design - Logo design and brand identity\n💡 UI/UX Design - User-centered design solutions\n\nWhich service interests you most?";
    }

    if (input.includes('price') || input.includes('cost') || input.includes('pricing')) {
      return "Our pricing is competitive and tailored to your needs:\n\n💰 Web Development: Starting from $2,500\n📊 Digital Marketing: Starting from $1,500/month\n🎨 Branding Package: Starting from $1,200\n\nPrices vary based on project complexity and requirements. Would you like a detailed quote for a specific service?";
    }

    if (input.includes('contact') || input.includes('reach') || input.includes('phone')) {
      return "📞 Ready to get started? Contact us:\n\n• Phone: 0753426492\n• Email: rocvillemediahouse@gmail.com\n• WhatsApp: Available 24/7\n\nWe typically respond within 1 hour during business hours!";
    }

    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "Hello! 👋 Welcome to RocVille Media House! I'm here to help you with our digital services. Whether you need a stunning website, powerful marketing campaigns, or compelling branding, we've got you covered. What can I help you with today?";
    }

    return "Thank you for your message! I'm here to help with information about our web development, digital marketing, and branding services. Could you please tell me more about what specific service you're interested in, or ask me about pricing, our process, or how to get started?";
  };

  const generateEnhancedAIResponse = (userInput: string, intentAnalysis: any, context: any): string => {
    const input = userInput.toLowerCase();
    const urgency = intentAnalysis?.urgency_level || 0.5;
    const emotionalState = intentAnalysis?.emotional_state?.sentiment || 'neutral';
    const businessContext = intentAnalysis?.business_context || {};

    let response = generateAIResponse(userInput);

    // Enhance response based on urgency
    if (urgency > 0.8) {
      response = "⚡ I understand this is urgent! " + response + "\n\nFor immediate assistance, please call us at 0753426492 or WhatsApp us directly.";
    }

    // Enhance response based on emotional state
    if (emotionalState === 'frustrated' || emotionalState === 'negative') {
      response = "I understand your concerns, and I'm here to help resolve them. " + response;
    } else if (emotionalState === 'excited' || emotionalState === 'positive') {
      response = "That's fantastic! I love your enthusiasm! " + response;
    }

    // Add personalization based on context
    if (context?.user_preferences?.length > 0) {
      response += "\n\n💡 Based on our conversation, I think you might also be interested in our " + 
                  context.user_preferences.join(' and ') + " services.";
    }

    // Add business-specific enhancements
    if (businessContext.service_keywords?.length > 0) {
      const services = businessContext.service_keywords.join(', ');
      response += `\n\n🎯 I noticed you mentioned ${services}. I can provide detailed information about these specific areas.`;
    }

    return response;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-xs opacity-90">
              {isConnected ? 'Online' : 'Connecting...'}
            </p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="text-white/80 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                "max-w-[80%] p-3 rounded-lg",
                message.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none shadow-sm border'
              )}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className={cn(
                "text-xs mt-1 opacity-70",
                message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
              )}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 rounded-lg rounded-bl-none shadow-sm border p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </Button>
        </div>

        {/* WhatsApp CTA */}
        <div className="mt-3 pt-3 border-t">
          <Button
            onClick={openWhatsApp}
            className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.106"/>
            </svg>
            <span>Continue on WhatsApp</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export { AIChatWidget };
```