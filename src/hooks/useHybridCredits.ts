import { useAuth } from "@/contexts/AuthContext";
import { getHybridCredits, MembershipTier } from "@/config/stripe";

export function useHybridCredits() {
  const { profile } = useAuth();
  
  const membershipTier = profile?.membership_tier as MembershipTier | null;
  const hybridCreditsRemaining = profile?.hybrid_credits_remaining ?? 0;
  const hybridCreditsResetDate = profile?.hybrid_credits_reset_date;
  
  // Get max credits for this tier
  const maxHybridCredits = membershipTier ? getHybridCredits(membershipTier) : 0;
  
  // Check if user has a hybrid membership
  const isHybridMember = membershipTier === "hybrid-core" || membershipTier === "hybrid-pro";
  
  // Check if user has available hybrid credits
  const hasHybridCredits = hybridCreditsRemaining > 0;
  
  // Calculate next reset date (roughly monthly from last reset)
  const getNextResetDate = (): Date | null => {
    if (!hybridCreditsResetDate) return null;
    const lastReset = new Date(hybridCreditsResetDate);
    const nextReset = new Date(lastReset);
    nextReset.setMonth(nextReset.getMonth() + 1);
    return nextReset;
  };
  
  return {
    hybridCreditsRemaining,
    maxHybridCredits,
    isHybridMember,
    hasHybridCredits,
    hybridCreditsResetDate,
    getNextResetDate,
  };
}