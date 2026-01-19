import { Link } from "react-router-dom";
import { Lock, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UpgradePromptProps {
  title?: string;
  description?: string;
  variant?: "inline" | "overlay" | "banner";
  className?: string;
}

export function UpgradePrompt({
  title = "Unlock Full Access",
  description = "Upgrade to post, comment, and engage with the community.",
  variant = "inline",
  className,
}: UpgradePromptProps) {
  if (variant === "banner") {
    return (
      <div className={cn(
        "bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border border-primary/20 rounded-xl p-4",
        className
      )}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">{title}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <Link to="/checkout">
            <Button size="sm" className="btn-hero">
              Upgrade Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (variant === "overlay") {
    return (
      <div className={cn(
        "absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl",
        className
      )}>
        <div className="text-center p-6 max-w-sm">
          <div className="p-3 bg-primary/20 rounded-full w-fit mx-auto mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-display text-lg font-bold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          <Link to="/checkout">
            <Button className="btn-hero">
              Upgrade Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Default inline variant
  return (
    <div className={cn(
      "bg-card border border-border rounded-xl p-6 text-center",
      className
    )}>
      <div className="p-3 bg-primary/20 rounded-full w-fit mx-auto mb-4">
        <Lock className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-display text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <Link to="/checkout">
        <Button className="btn-hero">
          Upgrade Now
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </div>
  );
}
