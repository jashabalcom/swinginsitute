import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollToSection() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      // Small delay to ensure DOM is ready after navigation
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Scroll to top on page navigation without hash
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, location.hash]);
}
