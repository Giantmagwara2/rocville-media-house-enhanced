import { useEffect } from 'react';

export function useEventStream() {
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5000/api/events');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Example: show toast for compliance alerts
      if (data.type === 'compliance_alert') {
        window.dispatchEvent(new CustomEvent('show-toast', { detail: { title: 'Compliance Alert', description: data.message } }));
      }
    };
    return () => ws.close();
  }, []);
}
