import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '../hooks/use-toast';

  const [status, setStatus] = useState('');
  const [lastAudit, setLastAudit] = useState('');
  const [alerts, setAlerts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchCompliance() {
      try {
        const res = await axios.get<{ status: string; lastAudit: string; alerts: string[] }>('/api/compliance/status');
        setStatus(res.data.status);
        setLastAudit(res.data.lastAudit);
        setAlerts(res.data.alerts);
        toast({ title: 'Compliance Status Fetched', description: `Status: ${res.data.status}` });
        if (res.data.alerts && res.data.alerts.length > 0) {
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 5000);
        }
      } catch {
        setStatus('error');
        setAlerts(['Unable to fetch compliance status.']);
        toast({ title: 'Error', description: 'Unable to fetch compliance status' });
      } finally {
        setLoading(false);
      }
    }
    fetchCompliance();
  }, []);

  const triggerKYC = async () => {
    await axios.post('/api/kyc/trigger');
    alert('KYC process triggered.');
  };

  const viewAuditLogs = async () => {
    window.open('/audit-logs', '_blank');
  };

  return (
    <div className="compliance-widget p-4 rounded shadow bg-white relative">
      <div className="flex items-center mb-2">
        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${status === 'compliant' ? 'bg-green-500 animate-pulse' : status === 'error' ? 'bg-red-500 animate-pulse' : 'bg-yellow-400 animate-pulse'}`}></span>
        <h2 className="text-lg font-bold">Regulatory Compliance Status</h2>
        {status === 'compliant' && <span className="ml-2 text-green-600 flex items-center"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Compliant</span>}
        {status === 'error' && <span className="ml-2 text-red-600 flex items-center"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12" y2="16"/></svg> Error</span>}
        {status !== 'compliant' && status !== 'error' && <span className="ml-2 text-yellow-600 flex items-center"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12" y2="16"/></svg> Pending</span>}
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p className="mb-1">Last Audit: <span className="font-semibold">{lastAudit}</span></p>
          <div className="mt-2">
            <h3 className="font-semibold">Alerts:</h3>
            <ul className="list-disc ml-6">
              {alerts.length === 0 ? <li>No alerts</li> : alerts.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </div>
          {showActions && (
            <div className="mt-4 flex gap-2">
              <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition" onClick={triggerKYC}>Trigger KYC</button>
              <button className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition" onClick={viewAuditLogs}>View Audit Logs</button>
            </div>
          )}
        </>
      )}
      {showNotification && (
        <div className="absolute top-2 right-2 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded shadow animate-bounce">
          <strong>Compliance Alert:</strong> {alerts[0]}
        </div>
      )}
    </div>
  );
}
