import { useEffect } from 'react';

export function PerformanceOptimizer() {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      const criticalImages = [
        '/assets/logo.jpg',
        '/assets/portfolio/ecoshop.jpg',
        '/assets/portfolio/fintrack.jpg',
        '/assets/portfolio/vitaltrack.jpg'
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    // Optimize images with lazy loading
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || '';
            img.classList.remove('image-loading');
            observer.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    };

    // Add smooth scrolling behavior
    const addSmoothScrolling = () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (this: HTMLAnchorElement, e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href') || '');
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });
    };

    // Initialize optimizations
    preloadCriticalResources();
    optimizeImages();
    addSmoothScrolling();

    // Cleanup function
    return () => {
      // Remove event listeners if needed
    };
  }, []);

  return null; // This component doesn't render anything
}

