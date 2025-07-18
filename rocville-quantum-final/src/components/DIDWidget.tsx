import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '../hooks/use-toast';

  const [ethAddress, setEthAddress] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const verifyDID = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/verify-did?ethAddress=${ethAddress}`);
      setResult(res.data);
      toast({ title: 'DID Verified', description: `Address: ${ethAddress}` });
    } catch (e) {
      setError('Failed to verify DID');
      toast({ title: 'Error', description: 'Failed to verify DID' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="did-widget p-4 rounded shadow bg-white">
      <h2 className="text-lg font-bold mb-2">Decentralized Identity (DID)</h2>
      <div className="flex gap-2 mb-2">
        <input value={ethAddress} onChange={e => setEthAddress(e.target.value)} className="border px-2 py-1 rounded" placeholder="Ethereum Address" />
        <button onClick={verify} className="bg-green-600 text-white px-3 py-1 rounded">Verify</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {result && (
        <div className="mt-2">
          <p><strong>DID:</strong> {result.did}</p>
          <p><strong>Verified:</strong> {result.verified ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
}
