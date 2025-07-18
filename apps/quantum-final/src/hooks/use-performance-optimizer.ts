import { useEffect } from 'react';

export function usePerformanceOptimizer() {
  useEffect(() => {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      if (img.getAttribute('src') !== img.getAttribute('data-src')) {
        img.setAttribute('src', img.getAttribute('data-src') || '');
      }
    });
    // Code splitting and prefetch
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        import(/* webpackPrefetch: true */ '../components/PortfolioVisualization');
      });
    }
  }, []);
}
