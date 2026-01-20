import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Layers,
  Zap,
  Eye,
  Target,
  Trophy,
  CheckCircle2,
  Lock,
  Flame,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { PhaseInfo } from "@/hooks/useProgressTracking";

interface PhaseProgress {
  phase: string;
  started_at: string;
  completed_at: string | null;
}

interface TrainingProgressHubProps {
  currentPhase: string;
  currentWeek: number;
  phaseProgress: PhaseProgress[];
  phases: string[];
  weeksPerPhase: number;
  phaseInfo: Record<string, PhaseInfo>;
  academyProgress?: number;
  drillsCompleted?: number;
  isAdminView?: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  foundation: Layers,
  zap: Zap,
  eye: Eye,
  target: Target,
  trophy: Trophy,
};

const phaseColors: Record<number, { bg: string; text: string; border: string }> = {
  0: { bg: "bg-blue-500", text: "text-blue-500", border: "border-blue-500" },
  1: { bg: "bg-orange-500", text: "text-orange-500", border: "border-orange-500" },
  2: { bg: "bg-purple-500", text: "text-purple-500", border: "border-purple-500" },
  3: { bg: "bg-emerald-500", text: "text-emerald-500", border: "border-emerald-500" },
  4: { bg: "bg-amber-500", text: "text-amber-500", border: "border-amber-500" },
};

export function TrainingProgressHub({
  currentPhase,
  currentWeek,
  phaseProgress,
  phases,
  weeksPerPhase,
  phaseInfo,
  academyProgress = 0,
  drillsCompleted = 0,
  isAdminView = false,
}: TrainingProgressHubProps) {
  const currentPhaseIndex = phases.indexOf(currentPhase);
  const totalWeeks = phases.length * weeksPerPhase;
  const completedWeeks = currentPhaseIndex * weeksPerPhase + (currentWeek - 1);
  const overallProgress = Math.round((completedWeeks / totalWeeks) * 100);

  const getPhaseStatus = (phase: string, index: number) => {
    if (isAdminView) {
      const progress = phaseProgress.find((p) => p.phase === phase);
      if (progress?.completed_at) return "completed";
      return "available";
    }
    const progress = phaseProgress.find((p) => p.phase === phase);
    if (progress?.completed_at) return "completed";
    if (phase === currentPhase) return "current";
    if (index > currentPhaseIndex) return "locked";
    return "available";
  };

  const getPhaseIcon = (phase: string) => {
    const info = phaseInfo[phase];
    if (!info) return Layers;
    return iconMap[info.icon] || Layers;
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="card-premium p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">Training Progress</h2>
            <p className="text-xs text-muted-foreground">Your 15-week Pro Path journey</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-display font-bold text-foreground">{overallProgress}%</div>
          <p className="text-xs text-muted-foreground">complete</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 rounded-lg bg-muted/30">
          <div className="text-xl font-bold text-foreground">{completedWeeks}</div>
          <p className="text-xs text-muted-foreground">Weeks Done</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-muted/30">
          <div className="text-xl font-bold text-foreground">{drillsCompleted}</div>
          <p className="text-xs text-muted-foreground">Drills</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-muted/30">
          <div className="text-xl font-bold text-foreground">{academyProgress}%</div>
          <p className="text-xs text-muted-foreground">Academy</p>
        </div>
      </div>

      {/* Phase Pills */}
      <div className="flex items-center gap-2 mb-4">
        {phases.map((phase, index) => {
          const status = getPhaseStatus(phase, index);
          const colors = phaseColors[index];
          const PhaseIcon = getPhaseIcon(phase);
          const info = phaseInfo[phase];

          return (
            <div key={phase} className="flex items-center flex-1">
              <div
                className={cn(
                  "relative group flex-shrink-0",
                  status !== "locked" && "cursor-pointer"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                    status === "completed" && "bg-accent text-white",
                    status === "current" && cn(colors.bg, "text-white ring-2 ring-offset-2 ring-offset-card", colors.border),
                    status === "locked" && "bg-muted text-muted-foreground",
                    status === "available" && "bg-muted/50 text-muted-foreground"
                  )}
                >
                  {status === "completed" ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : status === "locked" ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <PhaseIcon className="w-5 h-5" />
                  )}
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-card border border-border rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {info?.shortName || `Phase ${index + 1}`}
                </div>
              </div>
              
              {/* Connector Line */}
              {index < phases.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-1 mx-1 rounded-full transition-colors",
                    index < currentPhaseIndex ? "bg-accent" : "bg-muted"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Current Phase Detail */}
      <div className={cn(
        "p-4 rounded-xl border-2",
        phaseColors[currentPhaseIndex]?.border || "border-border",
        "bg-gradient-to-r from-muted/30 to-muted/10"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              phaseColors[currentPhaseIndex]?.bg || "bg-primary"
            )}>
              {(() => {
                const PhaseIcon = getPhaseIcon(currentPhase);
                return <PhaseIcon className="w-4 h-4 text-white" />;
              })()}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Current Phase</p>
              <h3 className="font-medium text-foreground">
                {phaseInfo[currentPhase]?.shortName || currentPhase}
              </h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Week</p>
            <p className="font-bold text-foreground">{currentWeek}/{weeksPerPhase}</p>
          </div>
        </div>
        
        {/* Week Progress */}
        <div className="mt-3">
          <Progress 
            value={(currentWeek / weeksPerPhase) * 100} 
            className="h-1.5"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex gap-3 mt-4">
        <Link 
          to="/academy" 
          className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors text-sm font-medium text-foreground"
        >
          <BookOpen className="w-4 h-4 text-secondary" />
          Academy
        </Link>
        <Link 
          to="/training-room" 
          className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-sm font-medium text-foreground"
        >
          <Flame className="w-4 h-4 text-primary" />
          Community
        </Link>
      </div>
    </motion.section>
  );
}
