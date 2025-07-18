import axios from 'axios';

// Types
interface Portfolio {
  assets: Array<{
    sector: string;
    weight: number;
    risk: number;
    esgScore: number;
  }>;
}

interface MarketData {
  trends: Array<{
    sector: string;
    growth: number;
    volatility: number;
  }>;
}

interface SustainabilityMetrics {
  esgScores: Record<string, number>;
  carbonFootprint: Record<string, number>;
}

// Mock AIConcierge class until we have the real implementation
class AIConcierge {
  async answerQuestion(question: string, context: any) {
    return `AI Response to: ${question}`;
  }

  async predictPerformance(portfolio: Portfolio, market: MarketData, sustainability: SustainabilityMetrics) {
    return {
      expectedReturn: 0.08,
      risk: 0.15,
      sustainabilityScore: 75
    };
  }

  optimizePortfolio(portfolio: Portfolio, userPrefs: { riskTolerance: number; sustainability: boolean; }) {
    return {
      ...portfolio,
      optimizationMessage: 'Portfolio optimized based on preferences'
    };
  }
}

const concierge = new AIConcierge();

// Utility function types
type FailoverFn = (providers: Array<() => Promise<any>>) => Promise<any>;
type CacheFn = {
  getCache: (key: string) => Promise<any>;
  setCache: (key: string, value: any, ttl: number) => Promise<void>;
};
type ObservabilityFns = {
  logMetric: (metric: string, value: number) => void;
  logError: (error: Error) => void;
};

// Utility functions for reliability
async function getFailoverUtil(): Promise<FailoverFn> {
  const { failover } = await import('../utils/failoverProvider');
  return failover;
}

async function getCacheUtil(): Promise<CacheFn> {
  const { getCache, setCache } = await import('../utils/cacheService');
  return { getCache, setCache };
}

async function getObservabilityUtil(): Promise<ObservabilityFns> {
  const { logMetric, logError } = await import('../utils/observability');
  return { logMetric, logError };
}

export async function handleNLPQuestion(question: string, context: any): Promise<string> {
  const { logMetric, logError } = await getObservabilityUtil();
  const { getCache, setCache } = await getCacheUtil();
  
  try {
    // Check cache first
    const cacheKey = `nlp:${question}:${JSON.stringify(context)}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      logMetric('nlp_cache_hit', 1);
      return cached;
    }

    const answer = await concierge.answerQuestion(question, context);
    await setCache(cacheKey, answer, 120);
    logMetric('nlp_success', 1);
    return answer;
  } catch (error) {
    logError(error as Error);
    return 'Sorry, I could not process your request at this time.';
  }
}

export async function handlePredictPerformance(
  portfolio: Portfolio,
  market: MarketData,
  sustainability: SustainabilityMetrics
): Promise<{ expectedReturn: number; risk: number; sustainabilityScore: number; } | null> {
  const { logMetric, logError } = await getObservabilityUtil();
  
  try {
    const prediction = await concierge.predictPerformance(portfolio, market, sustainability);
    logMetric('prediction_success', 1);
    return prediction;
  } catch (error) {
    logError(error as Error);
    return null;
  }
}

export async function handleOptimizePortfolio(
  portfolio: Portfolio,
  userPrefs: { riskTolerance: number; sustainability: boolean; }
): Promise<Portfolio | null> {
  const failover = await getFailoverUtil();
  const { logMetric, logError } = await getObservabilityUtil();

  const optimizers: Array<() => Promise<Portfolio>> = [
    async () => concierge.optimizePortfolio(portfolio, userPrefs),
    async () => ({
      ...portfolio,
      assets: portfolio.assets.map(asset => ({ ...asset })),
      optimizationMessage: 'Using fallback optimization strategy'
    })
  ];

  try {
    const result = await failover(optimizers);
    logMetric('optimization_success', 1);
    return result;
  } catch (error) {
    logError(error as Error);
    return null;
  }
}
}
