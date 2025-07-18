// Advanced AI Concierge Service
import axios from 'axios';

export async function getAIResponse(messages: { sender: string; text: string }[]): Promise<string> {
  // Ultimate reliability: failover, caching, observability
  const { failover } = await import('../utils/failoverProvider');
  const { getCache, setCache } = await import('../utils/cacheService');
  const { logMetric, logError } = await import('../utils/observability');
  const cacheKey = `ai:response:${JSON.stringify(messages)}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    logMetric('ai_cache_hit', 1);
    return cached;
  }
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const systemPrompt = `You are an expert investment concierge. You:
Answer complex investment questions using natural language (NLP)
Provide predictive analytics based on market trends, historical data, and sustainability metrics
Offer real-time portfolio optimization suggestions tailored to user goals, risk tolerance, and sustainability preferences
Use ESG, market, and diversification data when relevant
Respond conversationally and helpfully.`;
  const providers = [
    async () => {
      if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not set');
      const res = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }))
        ],
        max_tokens: 400
      }, {
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}` }
      });
      return res.data.choices[0].message.content;
    },
    async () => {
      // Alternate provider stub (expand as needed)
      throw new Error('Alternate AI provider not implemented');
    }
  ];
  try {
    const response = await failover(providers);
    await setCache(cacheKey, response, 120);
    logMetric('ai_api_success', 1);
    return response;
  } catch (error) {
    logError(error as Error);
    return 'AI error';
  }
}
