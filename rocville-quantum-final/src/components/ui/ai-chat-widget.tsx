import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { ScrollArea } from './scroll-area';
import { MessageCircle, Send, Bot, User, X, Minimize2 } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'typing' | 'error';
}

interface AIChatWidgetProps {
  isOpen?: boolean;
  onToggle?: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  apiEndpoint?: string;
}

export function AIChatWidget({
  isOpen = false,
  onToggle,
  position = 'bottom-right',
  apiEndpoint = '/api/ai/test-ai'
}: AIChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI assistant from RocVille Media House. How can I help you today?',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: `typing-${Date.now()}`,
      content: 'AI is thinking...',
      sender: 'ai',
      timestamp: new Date(),
      type: 'typing'
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          phone: 'web_user',
          location: {}
        }),
      });

      const data = await response.json();

      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.type !== 'typing'));

      if (data.status === 'success') {
        const aiMessage: Message = {
          id: Date.now().toString(),
          content: data.result?.response || data.response || 'I received your message, how can I help you?',
          sender: 'ai',
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.message || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('AI Chat Error:', error);

      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.type !== 'typing'));

      const errorMessage: Message = {
        id: Date.now().toString(),
        content: 'I\'m experiencing some technical difficulties. Please try again or contact us directly at rocvillemediahouse@gmail.com',
        sender: 'ai',
        timestamp: new Date(),
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [apiEndpoint]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading && inputValue.trim()) {
      sendMessage(inputValue);
    }
  }, [isLoading, inputValue, sendMessage]);

  const getPositionClasses = useCallback(() => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      default:
        return 'bottom-4 right-4';
    }
  }, [position]);

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className={`fixed ${getPositionClasses()} h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 z-50`}
        size="icon"
        aria-label="Open AI Chat"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed ${getPositionClasses()} w-96 shadow-2xl z-50 flex flex-col ${isMinimized ? 'h-16' : 'h-[500px]'}`}>
      <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5" />
          <CardTitle className="text-lg">AI Assistant</CardTitle>
          <Badge variant="secondary" className="bg-white/20 text-white">
            Online
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-8 w-8 text-white hover:bg-white/20"
            aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8 text-white hover:bg-white/20"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-[80%] ${
                        message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.sender === 'user'
                            ? 'bg-blue-500'
                            : message.type === 'error'
                            ? 'bg-red-500'
                            : 'bg-gradient-to-r from-purple-500 to-pink-500'
                        }`}
                      >
                        {message.sender === 'user' ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div
                        className={`rounded-lg p-3 ${
                          message.sender === 'user'
                            ? 'bg-blue-500 text-white'
                            : message.type === 'error'
                            ? 'bg-red-50 text-red-800 border border-red-200'
                            : message.type === 'typing'
                            ? 'bg-gray-100 text-gray-600'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        {message.type === 'typing' && (
                          <div className="flex space-x-1 mt-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        )}
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>
          </CardContent>

          <CardFooter className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex w-full space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
                maxLength={500}
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !inputValue.trim()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </>
      )}
    </Card>
  );
}

const generateEnhancedAIResponse = async (userInput: string, intentAnalysis: any, context: any): Promise<string> => {
    const input = userInput.toLowerCase();
    const urgency = intentAnalysis?.urgency_level || 0.5;
    const emotionalState = intentAnalysis?.emotional_state?.sentiment || 'neutral';
    const businessContext = intentAnalysis?.business_context || {};

    // Use advanced AI processing
    try {
      const multiModalInput = {
        text: userInput,
        metadata: {
          urgency,
          emotionalState,
          businessContext,
          user_preferences: context?.user_preferences || [],
          timestamp: new Date().toISOString()
        }
      };

      const response = await fetch('/api/training/test-enhanced-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput,
          phone: 'web_user_' + Date.now(),
          location: getUserLocation(),
          user_profile: context
        })
      });

      const result = await response.json();

      if (result.success) {
        let aiResponse = result.data.ai_response;

        // Add urgency handling
        if (urgency > 0.8) {
          aiResponse = "⚡ I understand this is urgent! " + aiResponse + "\n\nFor immediate assistance, please call us at 0753426492 or WhatsApp us directly.";
        }

        // Add emotional context
        if (emotionalState === 'frustrated' || emotionalState === 'negative') {
          aiResponse = "I understand your concerns, and I'm here to help resolve them. " + aiResponse;
        } else if (emotionalState === 'excited' || emotionalState === 'positive') {
          aiResponse = "That's fantastic! I love your enthusiasm! " + aiResponse;
        }

        // Add personalization
        if (context?.user_preferences?.length > 0) {
          aiResponse += "\n\n💡 Based on our conversation, I think you might also be interested in our " + 
                        context.user_preferences.join(', ') + " services.";
        }

        return aiResponse;
      }
    } catch (error) {
      console.error('Enhanced AI processing failed:', error);
    }

    // Fallback to basic response
    return generateAIResponse(userInput);
  };

  const getUserLocation = () => {
    return {
      country: 'US',
      city: 'Unknown',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  };

export default AIChatWidget;