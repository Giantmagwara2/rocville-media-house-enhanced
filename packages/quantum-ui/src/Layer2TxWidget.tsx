import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '../hooks/use-toast';

  const [network, setNetwork] = useState('optimism');
  const [txData, setTxData] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const sendTx = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/layer2-tx', { network, txData });
      setResult(res.data);
      toast({ title: 'Layer 2 Transaction Sent', description: `Network: ${network}` });
    } catch (e) {
      setError('Failed to send Layer 2 transaction');
      toast({ title: 'Error', description: 'Failed to send Layer 2 transaction' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layer2-tx-widget p-4 rounded shadow bg-white">
      <h2 className="text-lg font-bold mb-2">Layer 2 Transaction</h2>
      <div className="flex gap-2 mb-2">
        <select value={network} onChange={e => setNetwork(e.target.value)} className="border px-2 py-1 rounded">
          <option value="optimism">Optimism</option>
          <option value="arbitrum">Arbitrum</option>
        </select>
        <input value={txData} onChange={e => setTxData(e.target.value)} className="border px-2 py-1 rounded" placeholder="Transaction Data" />
        <button onClick={sendTx} className="bg-blue-600 text-white px-3 py-1 rounded">Send</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {result && (
        <div className="mt-2">
          <p><strong>Network:</strong> {result.network}</p>
          <p><strong>Tx Hash:</strong> {result.txHash}</p>
        </div>
      )}
    </div>
  );
}
