import { motion } from "framer-motion";
import { CheckCircle2, Circle, Play, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface Drill {
  id: string;
  title: string;
  description: string | null;
  is_priority: boolean;
  duration_minutes: number;
}

interface WeeklyDrillsCardProps {
  drills: Drill[];
  isDrillCompleted: (drillId: string) => boolean;
  onToggleDrill: (drillId: string) => void;
  progressPercent: number;
  canAdvance: boolean;
  onAdvance: () => void;
  currentWeek: number;
  weeksPerPhase: number;
}

export function WeeklyDrillsCard({
  drills,
  isDrillCompleted,
  onToggleDrill,
  progressPercent,
  canAdvance,
  onAdvance,
  currentWeek,
  weeksPerPhase,
}: WeeklyDrillsCardProps) {
  const completedCount = drills.filter((d) => isDrillCompleted(d.id)).length;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card-premium p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Week {currentWeek} Drills
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Complete priority drills to advance
          </p>
        </div>
        <span className="text-sm text-muted-foreground">
          {completedCount}/{drills.length} completed
        </span>
      </div>

      <Progress value={progressPercent} className="h-2 mb-6" />

      <ul className="space-y-3">
        {drills.map((drill) => {
          const completed = isDrillCompleted(drill.id);
          return (
            <li
              key={drill.id}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                completed
                  ? "bg-accent/10 border-accent/20"
                  : drill.is_priority
                  ? "bg-primary/5 border-primary/20 hover:bg-primary/10"
                  : "bg-card border-border/50 hover:bg-muted/30"
              }`}
              onClick={() => onToggleDrill(drill.id)}
            >
              {completed ? (
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
              ) : (
                <Circle
                  className={`w-5 h-5 flex-shrink-0 ${
                    drill.is_priority ? "text-primary" : "text-muted-foreground"
                  }`}
                />
              )}
              <div className="flex-1 min-w-0">
                <span
                  className={`block ${
                    completed
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  }`}
                >
                  {drill.title}
                </span>
                {drill.description && (
                  <span className="text-xs text-muted-foreground block truncate">
                    {drill.description}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-muted-foreground">
                  {drill.duration_minutes}min
                </span>
                {drill.is_priority && !completed && (
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                    Priority
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {canAdvance && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 pt-6 border-t border-border"
        >
          <Button
            onClick={onAdvance}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            {currentWeek < weeksPerPhase ? (
              <>
                Advance to Week {currentWeek + 1}
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Complete Phase & Advance
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </motion.div>
      )}
    </motion.section>
  );
}