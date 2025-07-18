// Market Data Feed Integration (Yahoo Finance API example)
import axios from 'axios';
import { failover } from '../utils/failoverProvider';
import { getCache, setCache } from '../utils/cacheService';
import { traceRequest, logMetric, logError } from '../utils/observability';
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const YAHOO_API_KEY = process.env.YAHOO_API_KEY;

export async function fetchMarketData(symbol: string, req?: any, res?: any): Promise<any> {
  if (req && res) traceRequest(req, res, () => {});
  const cacheKey = `market:${symbol}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    logMetric('market_cache_hit', 1, { symbol });
    return cached;
  }
  const providers = [
    async () => {
      if (!FINNHUB_API_KEY) throw new Error('FINNHUB_API_KEY not set');
      const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
      const res = await axios.get(url);
      return res.data;
    },
    async () => {
      if (!YAHOO_API_KEY) throw new Error('YAHOO_API_KEY not set');
      const url = `https://yfapi.net/v6/finance/quote?symbols=${symbol}`;
      const res = await axios.get(url, { headers: { 'x-api-key': YAHOO_API_KEY } });
      return res.data;
    }
  ];
  try {
    const data = await failover(providers);
    await setCache(cacheKey, data, 60);
    logMetric('market_api_success', 1, { symbol });
    return data;
  } catch (error) {
    logError(error as Error, { symbol });
    throw error;
  }
}
