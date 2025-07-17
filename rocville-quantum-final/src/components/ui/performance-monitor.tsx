
import React, { useEffect } from 'react';

export const PerformanceMonitor: React.FC = () => {
  useEffect(() => {
    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          console.log('Navigation timing:', entry);
        }
        if (entry.entryType === 'paint') {
          console.log('Paint timing:', entry);
        }
      }
    });

    observer.observe({ entryTypes: ['navigation', 'paint'] });

    // Memory usage monitoring
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      console.log('Memory usage:', {
        used: memoryInfo.usedJSHeapSize,
        total: memoryInfo.totalJSHeapSize,
        limit: memoryInfo.jsHeapSizeLimit
      });
    }

    return () => observer.disconnect();
  }, []);

  return null;
};
