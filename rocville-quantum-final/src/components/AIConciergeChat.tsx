import React, { useState } from 'react';
import { useToast } from '../../../prototypes/use-toast';

const AIConciergeChat: React.FC = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: 'Hello! I am your AI investment concierge. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setLoading(true);
    
    try {
      const res = await fetch('/api/ai-concierge/nlp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: input,
          context: {} // Add context as needed
        })
      });
      const data = await res.json();
      setMessages(msgs => [...msgs, { role: 'assistant', content: data.answer }]);
      toast({ title: 'AI Concierge Response', description: 'Message sent successfully.' });
    } catch (error) {
      setMessages(msgs => [...msgs, { role: 'assistant', content: 'Sorry, I could not process your request.' }]);
      toast({ title: 'Error', description: 'Failed to get AI Concierge response.' });
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, background: '#fff' }}>
      <h3 className="text-lg font-bold mb-2">AI Concierge</h3>
      <div style={{ minHeight: 120, marginBottom: 12 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.role === 'assistant' ? 'left' : 'right', margin: '6px 0' }}>
            <span style={{ background: msg.role === 'assistant' ? '#f1f5f9' : '#bae6fd', borderRadius: 6, padding: '6px 12px', display: 'inline-block' }}>
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          className="border rounded px-2 py-1 flex-1"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask me anything..."
          disabled={loading}
        />
        <button 
          className="bg-blue-500 text-white px-3 py-1 rounded" 
          onClick={sendMessage} 
          disabled={loading}
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default AIConciergeChat;
