import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '../hooks/use-toast';

  const [ticker, setTicker] = useState('AAPL');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchESG = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/esg-score?ticker=${ticker}`);
      setData(res.data);
      toast({ title: 'ESG Score Fetched', description: `Ticker: ${ticker}` });
    } catch (e) {
      setError('Failed to fetch ESG score');
      toast({ title: 'Error', description: 'Failed to fetch ESG score' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="esg-score-widget p-4 rounded shadow bg-white">
      <h2 className="text-lg font-bold mb-2">ESG Score</h2>
      <div className="flex gap-2 mb-2">
        <input value={ticker} onChange={e => setTicker(e.target.value)} className="border px-2 py-1 rounded" />
        <button onClick={fetchESG} className="bg-green-600 text-white px-3 py-1 rounded">Fetch</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {data && (
        <div className="mt-2">
          <p><strong>Ticker:</strong> {ticker}</p>
          <p><strong>ESG Score:</strong> {data.esgScore}</p>
          <p><strong>Carbon Footprint:</strong> {data.carbonFootprint}</p>
        </div>
      )}
    </div>
  );
}
