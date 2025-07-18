import { useEffect } from 'react';

export function useApiHealthDashboard() {
  useEffect(() => {
    // Example: fetch health status from backend
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        window.dispatchEvent(new CustomEvent('show-toast', { detail: { title: 'API Health', description: JSON.stringify(data) } }));
      });
  }, []);
}
