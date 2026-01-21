import { useState, useEffect, useMemo } from 'react';

export type ABVariant = 'A' | 'B';

/**
 * Get variant synchronously from localStorage
 */
function getStoredVariant(testId: string): ABVariant | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(`ab_test_${testId}`);
  return stored === 'A' || stored === 'B' ? stored : null;
}

/**
 * Hook for A/B testing with persistent variant assignment
 * Stores variant in localStorage to ensure consistent experience
 */
export function useABTest(testId: string): {
  variant: ABVariant;
  isLoading: boolean;
} {
  // Initialize synchronously if possible
  const initialVariant = useMemo(() => {
    const stored = getStoredVariant(testId);
    if (stored) return stored;
    
    // Randomly assign variant (50/50 split)
    const newVariant: ABVariant = Math.random() < 0.5 ? 'A' : 'B';
    if (typeof window !== 'undefined') {
      localStorage.setItem(`ab_test_${testId}`, newVariant);
    }
    return newVariant;
  }, [testId]);

  const [variant] = useState<ABVariant>(initialVariant);

  return { variant, isLoading: false };
}

/**
 * Get the current variant for a test (useful for tracking)
 */
export function getABVariant(testId: string): ABVariant | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(`ab_test_${testId}`);
  return stored === 'A' || stored === 'B' ? stored : null;
}
