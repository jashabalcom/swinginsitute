import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, CheckCircle2, ChevronRight, Diamond, Target, Dumbbell, Brain } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { CurriculumLevel } from "@/hooks/useCurriculum";
import { cn } from "@/lib/utils";

interface LevelCardProps {
  level: CurriculumLevel;
  progress: number;
  canAccess: boolean;
  index: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  diamond: Diamond,
  target: Target,
  dumbbell: Dumbbell,
  brain: Brain,
};

export function LevelCard({ level, progress, canAccess, index }: LevelCardProps) {
  const Icon = iconMap[level.icon || "book"] || Diamond;
  const isComplete = progress === 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        to={canAccess ? `/academy/level/${level.slug}` : "#"}
        className={cn(
          "block p-6 rounded-xl border transition-all duration-300",
          canAccess
            ? "bg-card hover:bg-card/80 border-border hover:border-primary/50 cursor-pointer"
            : "bg-muted/30 border-border/50 cursor-not-allowed opacity-70"
        )}
      >
        <div className="flex items-start gap-4">
          {/* Level Number & Icon */}
          <div
            className={cn(
              "flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center",
              isComplete
                ? "bg-green-500/20 text-green-500"
                : canAccess
                ? "bg-primary/20 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            {!canAccess ? (
              <Lock className="w-6 h-6" />
            ) : isComplete ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <Icon className="w-6 h-6" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Level {level.level_number}
              </span>
              {level.is_locked && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 font-medium">
                  PRO
                </span>
              )}
            </div>
            <h3 className="font-display text-lg font-bold text-foreground mb-1 truncate">
              {level.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {level.description}
            </p>

            {/* Progress */}
            {canAccess && (
              <div className="flex items-center gap-3">
                <Progress value={progress} className="flex-1 h-2" />
                <span className="text-xs font-medium text-muted-foreground">
                  {progress}%
                </span>
              </div>
            )}

            {/* Module count */}
            <p className="text-xs text-muted-foreground mt-2">
              {level.modules?.length || 0} modules
            </p>
          </div>

          {/* Arrow */}
          {canAccess && (
            <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          )}
        </div>
      </Link>
    </motion.div>
  );
}
