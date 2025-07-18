import { useEffect } from 'react';

export function useUserPersonalization() {
  useEffect(() => {
    // Load theme from localStorage
    const theme = localStorage.getItem('theme');
    if (theme) {
      document.documentElement.className = theme;
    }
    // Save theme changes
    const observer = new MutationObserver(() => {
      localStorage.setItem('theme', document.documentElement.className);
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);
}
