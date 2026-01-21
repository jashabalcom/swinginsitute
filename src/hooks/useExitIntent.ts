import { useState, useEffect, useCallback } from 'react';

interface UseExitIntentOptions {
  threshold?: number; // How close to top of viewport to trigger (default: 50px)
  delay?: number; // Delay before enabling detection (default: 2000ms)
  onlyOnce?: boolean; // Only trigger once per session (default: true)
  enabled?: boolean; // Whether the detection is enabled
}

export function useExitIntent({
  threshold = 50,
  delay = 2000,
  onlyOnce = true,
  enabled = true,
}: UseExitIntentOptions = {}) {
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      // Only trigger if mouse is leaving toward the top of the viewport
      if (e.clientY <= threshold && enabled && (!onlyOnce || !hasTriggered)) {
        setShowExitIntent(true);
        setHasTriggered(true);
      }
    },
    [threshold, enabled, onlyOnce, hasTriggered]
  );

  const closeExitIntent = useCallback(() => {
    setShowExitIntent(false);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Delay before enabling to avoid false triggers on page load
    const timeoutId = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseLeave, delay, enabled]);

  return {
    showExitIntent,
    closeExitIntent,
    hasTriggered,
  };
}
