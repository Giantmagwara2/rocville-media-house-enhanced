import React, { useState } from 'react';

export default function AIConciergeChat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setLoading(true);
    // Call backend API
    const res = await fetch('/api/ai-concierge/nlp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: input, context: {} })
    });
    const data = await res.json();
    setMessages([...messages, { role: 'user', content: input }, { role: 'assistant', content: data.answer }]);
    setInput('');
    setLoading(false);
  }

  return (
    <div className="ai-concierge-chat">
      <div className="chat-history">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role}>{msg.role}: {msg.content}</div>
        ))}
        {loading && <div className="assistant">assistant: ...</div>}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' ? sendMessage() : undefined} placeholder="Ask the AI concierge..." />
      <button onClick={sendMessage} disabled={loading}>Send</button>
    </div>
  );
}
