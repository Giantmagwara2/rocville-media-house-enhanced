import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '../hooks/use-toast';

  const [platform, setPlatform] = useState('twitter');
  const [message, setMessage] = useState('Check out RocVille Media House!');
  const [url, setUrl] = useState('https://rocvillemedia.com');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const share = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/social-share', { platform, message, url });
      setResult(res.data);
      toast({ title: 'Shared to Social Media', description: `Platform: ${platform}` });
    } catch (e) {
      setError('Failed to share to social media');
      toast({ title: 'Error', description: 'Failed to share to social media' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="social-share-widget p-4 rounded shadow bg-white">
      <h2 className="text-lg font-bold mb-2">Social Media Sharing</h2>
      <div className="flex gap-2 mb-2">
        <select value={platform} onChange={e => setPlatform(e.target.value)} className="border px-2 py-1 rounded">
          <option value="twitter">Twitter</option>
          <option value="facebook">Facebook</option>
          <option value="linkedin">LinkedIn</option>
        </select>
        <input value={message} onChange={e => setMessage(e.target.value)} className="border px-2 py-1 rounded" />
        <input value={url} onChange={e => setUrl(e.target.value)} className="border px-2 py-1 rounded" />
        <button onClick={share} className="bg-blue-600 text-white px-3 py-1 rounded">Share</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {result && (
        <div className="mt-2">
          <p><strong>Result:</strong> {JSON.stringify(result)}</p>
        </div>
      )}
    </div>
  );
}
