import { motion } from "framer-motion";
import { Check, Clock, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PackageCardProps {
  name: string;
  sessions: number;
  basePrice: number;
  memberPrice?: number;
  savings?: number;
  validityDays?: number;
  isMember?: boolean;
  onPurchase: () => void;
  loading?: boolean;
  popular?: boolean;
}

export function PackageCard({
  name,
  sessions,
  basePrice,
  memberPrice,
  savings,
  validityDays,
  isMember = false,
  onPurchase,
  loading = false,
  popular = false,
}: PackageCardProps) {
  const displayPrice = isMember && memberPrice ? memberPrice : basePrice;
  const pricePerSession = Math.round(displayPrice / sessions);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative rounded-2xl border p-6 transition-all",
        popular
          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
          : "border-border bg-card hover:border-primary/50"
      )}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-xl font-bold text-foreground">{name}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <Package className="w-4 h-4" />
              {sessions} lessons
            </p>
          </div>
          {savings && savings > 0 && (
            <span className="bg-green-500/10 text-green-600 text-xs font-semibold px-2 py-1 rounded-full">
              Save ${savings}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">${displayPrice}</span>
            {isMember && memberPrice && memberPrice < basePrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${basePrice}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            ${pricePerSession}/lesson
          </p>
        </div>

        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="w-4 h-4 text-green-500" />
            {sessions} private lessons
          </li>
          {validityDays && (
            <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 text-primary" />
              Valid for {validityDays} days
            </li>
          )}
          {isMember && (
            <li className="flex items-center gap-2 text-sm text-primary">
              <Check className="w-4 h-4" />
              Member pricing applied
            </li>
          )}
        </ul>

        <Button
          onClick={onPurchase}
          disabled={loading}
          className={cn(
            "w-full",
            popular
              ? "bg-primary hover:bg-primary/90"
              : "bg-secondary hover:bg-secondary/90"
          )}
        >
          {loading ? "Processing..." : "Purchase Package"}
        </Button>
      </div>
    </motion.div>
  );
}
