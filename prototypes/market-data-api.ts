// Live Market Data Integration (Yahoo Finance API example)
import axios from 'axios';

export async function fetchMarketData(symbol: string): Promise<any> {
  // Example: Yahoo Finance unofficial API
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`;
  const res = await axios.get(url);
  return res.data.quoteResponse.result[0];
}
