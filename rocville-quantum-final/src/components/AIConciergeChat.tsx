import React, { useState } from 'react';
import { useToast } from '../hooks/use-toast';

const AIConciergeChat: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([
    { sender: 'ai', text: 'Hello! I am your AI investment concierge. How can I help you today?' }
  ]);
  const [input, setInput] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const handleSend = async (): Promise<void> => {
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setLoading(true);
    const { toast } = useToast();
    try {
      const res = await fetch('/api/ai-concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      setMessages((msgs: { sender: string; text: string }[]) => [...msgs, { sender: 'ai', text: data.response }]);
      toast({ title: 'AI Concierge Response', description: 'Message sent to AI Concierge.' });
    } catch {
      setMessages((msgs: { sender: string; text: string }[]) => [...msgs, { sender: 'ai', text: 'Sorry, I could not process your request.' }]);
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
        {messages.map((msg: { sender: string; text: string }, i: number) => (
          <div key={i} style={{ textAlign: msg.sender === 'ai' ? 'left' : 'right', margin: '6px 0' }}>
            <span style={{ background: msg.sender === 'ai' ? '#f1f5f9' : '#bae6fd', borderRadius: 6, padding: '6px 12px', display: 'inline-block' }}>{msg.text}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          className="border rounded px-2 py-1 flex-1"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything..."
          disabled={loading}
        />
        <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={handleSend} disabled={loading}>{loading ? '...' : 'Send'}</button>
      </div>
    </div>
  );
};

export default AIConciergeChat;
