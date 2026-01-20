import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  name: string;
  description: string;
  duration: number;
  price: number;
  memberPrice?: number;
  isMember?: boolean;
  icon: LucideIcon;
  iconColor?: string;
  selected: boolean;
  onClick: () => void;
}

export function ServiceCard({
  name,
  description,
  duration,
  price,
  memberPrice,
  isMember,
  icon: Icon,
  iconColor = "text-primary",
  selected,
  onClick,
}: ServiceCardProps) {
  const displayPrice = isMember && memberPrice ? memberPrice : price;
  const hasDiscount = isMember && memberPrice && memberPrice < price;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
        selected
          ? "border-primary bg-primary/10 shadow-lg"
          : "border-border bg-card hover:border-primary/50 hover:bg-card/80"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg bg-background ${selected ? "ring-2 ring-primary" : ""}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-display text-lg font-semibold text-foreground">
              {name}
            </h3>
            {selected && (
              <span className="text-xs font-medium text-primary bg-primary/20 px-2 py-0.5 rounded-full">
                Selected
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{duration} minutes</span>
            <div className="text-right">
              <span className="font-display text-xl font-bold text-foreground">
                ${displayPrice}
              </span>
              {hasDiscount && (
                <span className="ml-2 text-xs text-muted-foreground line-through">
                  ${price}
                </span>
              )}
              {hasDiscount && (
                <span className="block text-xs text-primary font-medium">
                  Member rate
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
