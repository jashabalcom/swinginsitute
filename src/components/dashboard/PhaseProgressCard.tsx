import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Lock, 
  CheckCircle2, 
  Layers, 
  Zap, 
  Eye, 
  Target, 
  Trophy,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PhaseInfo } from "@/hooks/useProgressTracking";

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
  phaseInfo?: Record<string, PhaseInfo>;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  foundation: Layers,
  zap: Zap,
  eye: Eye,
  target: Target,
  trophy: Trophy,
};

export function PhaseProgressCard({
  currentPhase,
  currentWeek,
  phaseProgress,
  phases,
  weeksPerPhase,
  phaseInfo,
}: PhaseProgressCardProps) {
  const currentPhaseIndex = phases.indexOf(currentPhase);
  const currentPhaseData = phaseInfo?.[currentPhase];

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

  const getPhaseIcon = (phase: string) => {
    const info = phaseInfo?.[phase];
    if (!info) return Layers;
    return iconMap[info.icon] || Layers;
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="card-accent-red p-6"
    >
      {/* Current Phase Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
            Current Training Focus
          </p>
          <h2 className="font-display text-2xl font-bold text-foreground">
            {currentPhaseData?.shortName || currentPhase}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {currentPhaseData?.description}
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-primary" />
        </div>
      </div>

      {/* Current Phase Focus Areas */}
      {currentPhaseData?.focus && (
        <div className="flex flex-wrap gap-2 mb-4">
          {currentPhaseData.focus.map((item, i) => (
            <span 
              key={i}
              className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium"
            >
              {item}
            </span>
          ))}
        </div>
      )}

      {/* Week Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Week {currentWeek} of {weeksPerPhase}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round((currentWeek / weeksPerPhase) * 100)}% of phase
          </span>
        </div>
        <div className="flex items-center gap-2">
          {Array.from({ length: weeksPerPhase }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 h-2.5 rounded-full transition-all",
                i < currentWeek
                  ? "bg-primary"
                  : i === currentWeek - 1
                  ? "bg-primary/60"
                  : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      {/* Phase Timeline */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Training Phases
        </h3>
        {phases.map((phase, index) => {
          const status = getPhaseStatus(phase, index);
          const isCompleted = status === "completed";
          const isCurrent = status === "current";
          const isLocked = status === "locked";
          const PhaseIcon = getPhaseIcon(phase);
          const info = phaseInfo?.[phase];

          return (
            <motion.div
              key={phase}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border transition-all",
                isCurrent
                  ? "bg-primary/10 border-primary/30"
                  : isCompleted
                  ? "bg-green-500/10 border-green-500/20"
                  : "bg-muted/30 border-border/50"
              )}
            >
              {/* Phase Icon */}
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isCurrent
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : isLocked ? (
                  <Lock className="w-5 h-5" />
                ) : (
                  <PhaseIcon className="w-5 h-5" />
                )}
              </div>

              {/* Phase Info */}
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "font-medium text-sm",
                    isLocked ? "text-muted-foreground" : "text-foreground"
                  )}
                >
                  {info?.shortName || phase}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {info?.description}
                </p>
              </div>

              {/* Status Indicator */}
              <div className="flex-shrink-0">
                {isCurrent && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                    Active
                  </span>
                )}
                {isCompleted && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-500 font-medium">
                    Done
                  </span>
                )}
                {isLocked && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Motivation Text */}
      <div className="mt-6 p-4 bg-background/50 rounded-lg border border-border/50">
        <p className="text-foreground font-medium">
          This is your <span className="text-primary">ONLY</span> focus right now.
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Master this phase before moving to the next. Trust the process.
        </p>
      </div>
    </motion.section>
  );
}
