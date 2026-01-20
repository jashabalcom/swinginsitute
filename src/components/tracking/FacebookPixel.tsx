import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const FB_PIXEL_ID = import.meta.env.VITE_FB_PIXEL_ID;

export function FacebookPixel() {
  const location = useLocation();

  useEffect(() => {
    if (!FB_PIXEL_ID) return;

    // Initialize Facebook Pixel
    const initPixel = () => {
      if (window.fbq) return;

      const n = (window.fbq = function (...args: unknown[]) {
        // @ts-expect-error - fbq.callMethod exists at runtime
        n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
      } as typeof window.fbq & { 
        push: typeof Array.prototype.push;
        loaded: boolean;
        version: string;
        queue: unknown[];
      });
      
      // @ts-expect-error - _fbq may not exist initially
      if (!window._fbq) window._fbq = n;
      
      (n as unknown as { push: typeof Array.prototype.push }).push = n as unknown as typeof Array.prototype.push;
      (n as unknown as { loaded: boolean }).loaded = true;
      (n as unknown as { version: string }).version = '2.0';
      (n as unknown as { queue: unknown[] }).queue = [];

      // Load the script
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript?.parentNode?.insertBefore(script, firstScript);

      // Initialize pixel
      window.fbq('init', FB_PIXEL_ID);
      window.fbq('track', 'PageView');
    };

    initPixel();
  }, []);

  // Track page views on route changes
  useEffect(() => {
    if (!FB_PIXEL_ID || !window.fbq) return;
    window.fbq('track', 'PageView');
  }, [location.pathname]);

  if (!FB_PIXEL_ID) return null;

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: 'none' }}
        src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  );
}
