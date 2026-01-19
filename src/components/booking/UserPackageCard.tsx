import { format } from "date-fns";
import { motion } from "framer-motion";
import { Package, Clock, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { PurchasedPackage } from "@/types/booking";

interface UserPackageCardProps {
  pkg: PurchasedPackage;
  onUseCredits?: () => void;
}

export function UserPackageCard({ pkg, onUseCredits }: UserPackageCardProps) {
  const expiresAt = new Date(pkg.expires_at);
  const daysUntilExpiry = Math.ceil(
    (expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const isExpiringSoon = daysUntilExpiry <= 14;
  const usedSessions = pkg.sessions_total - pkg.sessions_remaining;
  const progressPercent = (usedSessions / pkg.sessions_total) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card p-4"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">
              {pkg.package?.name || "Lesson Package"}
            </h4>
            <p className="text-sm text-muted-foreground">
              Purchased {format(new Date(pkg.purchased_at), "MMM d, yyyy")}
            </p>
          </div>
        </div>

        {isExpiringSoon && (
          <div className="flex items-center gap-1 text-amber-600 text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Expires soon</span>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Sessions used</span>
          <span className="font-medium text-foreground">
            {usedSessions} / {pkg.sessions_total}
          </span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Credits remaining */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">
            {pkg.sessions_remaining}
          </span>
          <span className="text-muted-foreground">credits remaining</span>
        </div>

        <div className={cn(
          "flex items-center gap-1 text-sm",
          isExpiringSoon ? "text-amber-600" : "text-muted-foreground"
        )}>
          <Clock className="w-4 h-4" />
          <span>
            Expires {format(expiresAt, "MMM d, yyyy")}
          </span>
        </div>
      </div>

      {onUseCredits && pkg.sessions_remaining > 0 && (
        <button
          onClick={onUseCredits}
          className="mt-4 w-full py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Use credits to book a session →
        </button>
      )}
    </motion.div>
  );
}
