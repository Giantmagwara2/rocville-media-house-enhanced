import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '../hooks/use-toast';

  const [address, setAddress] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const fetchBalance = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/multichain-balance?address=${address}`);
      setResult(res.data);
      toast({ title: 'Multi-Chain Balance Fetched', description: `Address: ${address}` });
    } catch (e) {
      setError('Failed to fetch balance');
      toast({ title: 'Error', description: 'Failed to fetch multi-chain balance' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="multichain-balance-widget p-4 rounded shadow bg-white">
      <h2 className="text-lg font-bold mb-2">Multi-Chain Balance</h2>
      <div className="flex gap-2 mb-2">
        <input value={address} onChange={e => setAddress(e.target.value)} className="border px-2 py-1 rounded" placeholder="Wallet Address" />
        <button onClick={fetchBalance} className="bg-purple-600 text-white px-3 py-1 rounded">Fetch</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {result && (
        <div className="mt-2">
          <p><strong>Ethereum:</strong> {result.ethereum}</p>
          <p><strong>Solana:</strong> {result.solana}</p>
          <p><strong>Polkadot:</strong> {result.polkadot}</p>
        </div>
      )}
    </div>
  );
}
