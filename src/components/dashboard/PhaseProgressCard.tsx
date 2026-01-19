import { motion } from "framer-motion";
import { TrendingUp, Lock, CheckCircle2, Circle } from "lucide-react";

interface PhaseProgress {
  phase: string;
  started_at: string;
  completed_at: string | null;
}

interface PhaseProgressCardProps {
  currentPhase: string;
  currentWeek: number;
  phaseProgress: PhaseProgress[];
  phases: string[];
  weeksPerPhase: number;
}

export function PhaseProgressCard({
  currentPhase,
  currentWeek,
  phaseProgress,
  phases,
  weeksPerPhase,
}: PhaseProgressCardProps) {
  const currentPhaseIndex = phases.indexOf(currentPhase);

  const getPhaseStatus = (phase: string, index: number) => {
    const progress = phaseProgress.find((p) => p.phase === phase);
    
    if (progress?.completed_at) {
      return "completed";
    }
    if (phase === currentPhase) {
      return "current";
    }
    if (index > currentPhaseIndex) {
      return "locked";
    }
    return "available";
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="card-accent-red p-6"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
            Current Training Focus
          </p>
          <h2 className="font-display text-2xl font-bold text-foreground">
            {currentPhase}
          </h2>
          <p className="text-muted-foreground">
            Week {currentWeek} of {weeksPerPhase}
          </p>
        </div>
        <TrendingUp className="w-8 h-8 text-primary" />
      </div>

      {/* Week Progress Dots */}
      <div className="flex items-center gap-2 mb-6">
        {Array.from({ length: weeksPerPhase }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-2 rounded-full ${
              i < currentWeek
                ? "bg-primary"
                : i === currentWeek - 1
                ? "bg-primary/50"
                : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Phase Timeline */}
      <div className="space-y-3">
        {phases.map((phase, index) => {
          const status = getPhaseStatus(phase, index);
          const isCompleted = status === "completed";
          const isCurrent = status === "current";
          const isLocked = status === "locked";

          return (
            <div
              key={phase}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                isCurrent
                  ? "bg-primary/10 border-primary/30"
                  : isCompleted
                  ? "bg-accent/10 border-accent/20"
                  : "bg-muted/30 border-border/50"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? "bg-accent text-accent-foreground"
                    : isCurrent
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isLocked ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-bold">{index + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    isLocked ? "text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {phase}
                </p>
                {isCurrent && (
                  <p className="text-xs text-primary">In Progress</p>
                )}
                {isCompleted && (
                  <p className="text-xs text-accent">Completed</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-background/50 rounded-lg border border-border/50">
        <p className="text-foreground font-medium">
          This is your <span className="text-primary">ONLY</span> focus right
          now.
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Master this phase before moving to the next. Trust the process.
        </p>
      </div>
    </motion.section>
  );
}