import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, CheckCircle2, ChevronRight, Diamond, Target, Dumbbell, Brain, Play, Clock, BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
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
  
  // Calculate total lessons and estimated time
  const totalLessons = level.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
  const totalMinutes = level.modules?.reduce((acc, m) => 
    acc + (m.lessons?.reduce((sum, l) => sum + ((l.video_duration_seconds || 0) / 60), 0) || 0)
  , 0) || 0;
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = Math.round(totalMinutes % 60);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        to={canAccess ? `/academy/level/${level.slug}` : "#"}
        className={cn(
          "block p-6 rounded-xl border transition-all duration-300 group",
          canAccess
            ? "bg-card hover:bg-card/80 border-border hover:border-primary/50 cursor-pointer"
            : "bg-muted/30 border-border/50 cursor-not-allowed opacity-70"
        )}
      >
        <div className="flex items-start gap-4">
          {/* Level Icon with Progress Ring */}
          <div className="relative flex-shrink-0">
            <div
              className={cn(
                "w-16 h-16 rounded-xl flex items-center justify-center",
                isComplete
                  ? "bg-green-500/20 text-green-500"
                  : canAccess
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {!canAccess ? (
                <Lock className="w-7 h-7" />
              ) : isComplete ? (
                <CheckCircle2 className="w-7 h-7" />
              ) : (
                <Icon className="w-7 h-7" />
              )}
            </div>
            {/* Progress ring overlay */}
            {canAccess && progress > 0 && progress < 100 && (
              <svg className="absolute inset-0 w-16 h-16 -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${(progress / 100) * 175.9} 175.9`}
                  className="text-primary"
                />
              </svg>
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
            <h3 className="font-display text-lg font-bold text-foreground mb-1">
              {level.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {level.description}
            </p>

            {/* Stats Row */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                {totalLessons} lessons
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {totalHours > 0 ? `${totalHours}h ${remainingMinutes}m` : `${remainingMinutes}m`}
              </span>
              <span className="flex items-center gap-1.5">
                {level.modules?.length || 0} modules
              </span>
            </div>

            {/* Progress */}
            {canAccess && (
              <div className="flex items-center gap-3">
                <Progress value={progress} className="flex-1 h-2" />
                <span className="text-xs font-medium text-muted-foreground min-w-[36px]">
                  {progress}%
                </span>
              </div>
            )}
          </div>

          {/* CTA */}
          {canAccess && (
            <div className="flex-shrink-0 flex items-center gap-2">
              <Button 
                size="sm" 
                className={cn(
                  "gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity",
                  isComplete ? "bg-green-500 hover:bg-green-600" : ""
                )}
              >
                <Play className="w-3.5 h-3.5" />
                {isComplete ? "Review" : progress > 0 ? "Continue" : "Start"}
              </Button>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
