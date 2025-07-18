import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '../hooks/use-toast';

  const [symbol, setSymbol] = useState('AAPL');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/market-data?symbol=${symbol}`);
      setData(res.data);
      toast({ title: 'Market Data Fetched', description: `Symbol: ${symbol}`, });
    } catch (e) {
      setError('Failed to fetch market data');
      toast({ title: 'Error', description: 'Failed to fetch market data', });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="market-data-widget p-4 rounded shadow bg-white">
      <h2 className="text-lg font-bold mb-2">Market Data Feed</h2>
      <div className="flex gap-2 mb-2">
        <input value={symbol} onChange={e => setSymbol(e.target.value)} className="border px-2 py-1 rounded" />
        <button onClick={fetchData} className="bg-blue-600 text-white px-3 py-1 rounded">Fetch</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {data && (
        <div className="mt-2">
          <p><strong>Symbol:</strong> {symbol}</p>
          <p><strong>Price:</strong> {data.c}</p>
          <p><strong>Open:</strong> {data.o}</p>
          <p><strong>High:</strong> {data.h}</p>
          <p><strong>Low:</strong> {data.l}</p>
        </div>
      )}
    </div>
  );
}
