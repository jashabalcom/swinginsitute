import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Hardcoded pixel ID - this is public information visible in page source
const FB_PIXEL_ID = import.meta.env.VITE_FB_PIXEL_ID || '1609199719332056';

declare global {
  interface Window {
    fbq: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue: unknown[];
      loaded: boolean;
      version: string;
    };
    _fbq: typeof window.fbq;
  }
}

export function FacebookPixel() {
  const location = useLocation();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    
    console.log('[Meta Pixel] Initializing with ID:', FB_PIXEL_ID);

    // Create fbq function before script loads
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) {
        fbq.callMethod.apply(fbq, args);
      } else {
        fbq.queue.push(args);
      }
    } as typeof window.fbq;

    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = '2.0';

    window.fbq = fbq;
    window._fbq = fbq;

    // Load the Facebook Pixel script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    
    script.onload = () => {
      console.log('[Meta Pixel] Script loaded successfully');
      // Init and track after script loads
      window.fbq('init', FB_PIXEL_ID);
      window.fbq('track', 'PageView');
      console.log('[Meta Pixel] Initialized and PageView tracked');
    };
    
    script.onerror = () => {
      console.error('[Meta Pixel] Failed to load script - may be blocked by ad blocker');
    };

    document.head.appendChild(script);
    initialized.current = true;
  }, []);

  // Track page views on route changes (skip initial since we track in init)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    if (window.fbq) {
      window.fbq('track', 'PageView');
      console.log('[Meta Pixel] PageView tracked for:', location.pathname);
    }
  }, [location.pathname]);

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
