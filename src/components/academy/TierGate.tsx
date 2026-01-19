import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Lock, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface TierGateProps {
  requiredTiers: string[];
  children: ReactNode;
  fallback?: ReactNode;
  showUpgrade?: boolean;
  allowFreePreview?: boolean;
  previewContent?: ReactNode;
}

export function TierGate({ 
  requiredTiers, 
  children, 
  fallback, 
  showUpgrade = true,
  allowFreePreview = false,
  previewContent
}: TierGateProps) {
  const { profile } = useAuth();
  const userTier = profile?.membership_tier || "starter";
  const isFreeTier = profile?.is_free_tier || (!profile?.membership_tier);

  // If no tiers required or user has access
  if (requiredTiers.length === 0 || requiredTiers.includes(userTier)) {
    return <>{children}</>;
  }

  // If free preview is allowed and user is on free tier, show preview content
  if (allowFreePreview && isFreeTier && previewContent) {
    return <>{previewContent}</>;
  }

  // Show fallback if provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default locked state
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-card/50 rounded-lg border border-border">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Lock className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="font-display text-lg font-bold text-foreground mb-2">
        {isFreeTier ? "Unlock Full Access" : "Pro Track Content"}
      </h3>
      <p className="text-muted-foreground text-sm max-w-sm mb-4">
        {isFreeTier 
          ? "Join a membership to unlock all training content, events, and community features."
          : `This content is available for ${requiredTiers.join(" or ")} members. Upgrade to unlock exclusive training materials.`
        }
      </p>
      {showUpgrade && (
        <Link to="/train-online">
          <Button className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400">
            <Crown className="w-4 h-4 mr-2" />
            {isFreeTier ? "View Plans" : "Upgrade Now"}
          </Button>
        </Link>
      )}
    </div>
  );
}
