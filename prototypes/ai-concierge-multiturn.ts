// Multi-turn Conversational AI Concierge Prototype
import { OpenAI } from 'openai';
import { Portfolio, MarketData, SustainabilityMetrics } from './types';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export class MultiTurnAIConcierge {
  private conversationHistory: { role: string; content: string }[] = [];

  // Add a message to the conversation history
  addMessage(role: 'user' | 'assistant', content: string) {
    this.conversationHistory.push({ role, content });
    if (this.conversationHistory.length > 10) this.conversationHistory.shift();
  }

  // Conversational Q&A with context
  async answer(question: string, context: any): Promise<string> {
    this.addMessage('user', question);
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an advanced investment and sustainability AI concierge.' },
        ...this.conversationHistory,
        { role: 'user', content: question }
      ],
      temperature: 0.2,
      max_tokens: 512,
    });
    const answer = response.choices[0].message.content.trim();
    this.addMessage('assistant', answer);
    return answer;
  }

  // Entity extraction (region, sector, risk, etc.)
  async extractEntities(question: string): Promise<any> {
    const prompt = `Extract key entities (region, sector, risk, sustainability, etc.) from: "${question}". Return as JSON.`;
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0,
      max_tokens: 256,
    });
    try {
      return JSON.parse(response.choices[0].message.content);
    } catch {
      return {};
    }
  }

  // Scenario simulation
  async simulateScenario(portfolio: Portfolio, scenario: string): Promise<any> {
    const prompt = `Given the portfolio: ${JSON.stringify(portfolio)}, simulate the scenario: ${scenario}. Return the expected impact as JSON.`;
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 512,
    });
    try {
      return JSON.parse(response.choices[0].message.content);
    } catch {
      return { note: response.choices[0].message.content };
    }
  }
}
