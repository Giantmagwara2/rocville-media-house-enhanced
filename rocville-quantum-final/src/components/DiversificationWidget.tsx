import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '../hooks/use-toast';

  const [userId, setUserId] = useState('demo-user');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchDiversification = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/diversification?userId=${userId}`);
      setData(res.data);
      toast({ title: 'Diversification Data Fetched', description: `User: ${userId}` });
    } catch (e) {
      setError('Failed to fetch diversification tools');
      toast({ title: 'Error', description: 'Failed to fetch diversification tools' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="diversification-widget p-4 rounded shadow bg-white">
      <h2 className="text-lg font-bold mb-2">Diversification Tools</h2>
      <div className="flex gap-2 mb-2">
        <input value={userId} onChange={e => setUserId(e.target.value)} className="border px-2 py-1 rounded" />
        <button onClick={fetchDiversification} className="bg-purple-600 text-white px-3 py-1 rounded">Fetch</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {data && (
        <div className="mt-2">
          <p><strong>User ID:</strong> {userId}</p>
          <p><strong>Notes:</strong> {data.notes}</p>
          <ul className="mt-2">
            {data.recommendedAssets.map((a: any, i: number) => (
              <li key={i}><strong>{a.sector}</strong>: {a.weight * 100}%</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
