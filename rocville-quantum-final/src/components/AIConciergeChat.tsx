import React, { useState } from 'react';

const AIConciergeChat: React.FC = () => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your AI investment concierge. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input }]);
    // Simulate AI response
    setTimeout(() => {
      setMessages((msgs: { sender: string; text: string }[]) => [...msgs, { sender: 'ai', text: `You said: ${input}` }]);
    }, 600);
    setInput('');
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
        />
        <button 