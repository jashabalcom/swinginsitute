import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export function GoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    // Initialize Google Analytics
    const initGA = () => {
      if (window.gtag) return;

      // Initialize dataLayer
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer.push(args);
      };
      window.gtag('js', new Date());
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location.pathname,
      });

      // Load the script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);
    };

    initGA();
  }, []);

  // Track page views on route changes
  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !window.gtag) return;
    
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: location.pathname,
    });
  }, [location.pathname]);

  return null;
}
