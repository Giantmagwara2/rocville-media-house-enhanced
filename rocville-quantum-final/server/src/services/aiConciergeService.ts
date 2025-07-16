import { AIConcierge } from '../../../prototypes/ai-concierge-advanced';
import { Portfolio, MarketData, SustainabilityMetrics } from '../../../prototypes/types';

const concierge = new AIConcierge();

export async function handleNLPQuestion(question: string, context: any) {
  return concierge.answerQuestion(question, context);
}

export async function handlePredictPerformance(portfolio: Portfolio, market: MarketData, sustainability: SustainabilityMetrics) {
  return concierge.predictPerformance(portfolio, market, sustainability);
}

export function handleOptimizePortfolio(portfolio: Portfolio, userPrefs: { riskTolerance: number; sustainability: boolean; }) {
  return concierge.optimizePortfolio(portfolio, userPrefs);
}
