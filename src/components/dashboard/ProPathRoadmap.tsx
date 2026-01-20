import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Layers,
  Zap,
  Eye,
  Target,
  Trophy,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Video,
  Clock,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PhaseInfo } from "@/hooks/useProgressTracking";

interface PhaseProgress {
  phase: string;
  started_at: string;
  completed_at: string | null;
}

interface PhaseAcademyLink {
  id: string;
  phase: string;
  level_id: string | null;
  description: string | null;
  level?: {
    id: string;
    title: string;
    slug: string;
    icon: string | null;
  };
}

interface ProPathRoadmapProps {
  currentPhase: string;
  currentWeek: number;
  phaseProgress: PhaseProgress[];
  phases: string[];
  weeksPerPhase: number;
  phaseInfo: Record<string, PhaseInfo>;
  phaseAcademyLinks: PhaseAcademyLink[];
  compact?: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  foundation: Layers,
  zap: Zap,
  eye: Eye,
  target: Target,
  trophy: Trophy,
};

const phaseColors: Record<number, { bg: string; border: string; text: string; glow: string }> = {
  0: { bg: "bg-blue-500", border: "border-blue-500", text: "text-blue-500", glow: "shadow-blue-500/20" },
  1: { bg: "bg-orange-500", border: "border-orange-500", text: "text-orange-500", glow: "shadow-orange-500/20" },
  2: { bg: "bg-purple-500", border: "border-purple-500", text: "text-purple-500", glow: "shadow-purple-500/20" },
  3: { bg: "bg-emerald-500", border: "border-emerald-500", text: "text-emerald-500", glow: "shadow-emerald-500/20" },
  4: { bg: "bg-amber-500", border: "border-amber-500", text: "text-amber-500", glow: "shadow-amber-500/20" },
};

export function ProPathRoadmap({
  currentPhase,
  currentWeek,
  phaseProgress,
  phases,
  weeksPerPhase,
  phaseInfo,
  phaseAcademyLinks,
  compact = false,
}: ProPathRoadmapProps) {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(currentPhase);
  const currentPhaseIndex = phases.indexOf(currentPhase);
  const totalWeeks = phases.length * weeksPerPhase;
  const completedWeeks = currentPhaseIndex * weeksPerPhase + (currentWeek - 1);
  const overallProgress = Math.round((completedWeeks / totalWeeks) * 100);

  const getPhaseStatus = (phase: string, index: number) => {
    const progress = phaseProgress.find((p) => p.phase === phase);
    if (progress?.completed_at) return "completed";
    if (phase === currentPhase) return "current";
    if (index > currentPhaseIndex) return "locked";
    return "available";
  };

  const getWeekStatus = (phaseIndex: number, weekIndex: number) => {
    if (phaseIndex < currentPhaseIndex) return "completed";
    if (phaseIndex === currentPhaseIndex) {
      if (weekIndex < currentWeek - 1) return "completed";
      if (weekIndex === currentWeek - 1) return "current";
      return "locked";
    }
    return "locked";
  };

  const getPhaseIcon = (phase: string) => {
    const info = phaseInfo[phase];
    if (!info) return Layers;
    return iconMap[info.icon] || Layers;
  };

  const getPhaseAcademyContent = (phase: string) => {
    return phaseAcademyLinks.filter((l) => l.phase === phase);
  };

  if (compact) {
    return (
      <div className="space-y-4">
        {/* Overall Progress */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Pro Path Progress</span>
              <span className="text-sm text-muted-foreground">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-foreground">{completedWeeks}</span>
            <span className="text-sm text-muted-foreground">/{totalWeeks} weeks</span>
          </div>
        </div>

        {/* Compact Phase Indicators */}
        <div className="flex items-center gap-2">
          {phases.map((phase, index) => {
            const status = getPhaseStatus(phase, index);
            const colors = phaseColors[index];
            const PhaseIcon = getPhaseIcon(phase);

            return (
              <div key={phase} className="flex items-center flex-1">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                    status === "completed" && "bg-green-500 text-white",
                    status === "current" && `${colors.bg} text-white ring-2 ring-offset-2 ring-offset-background ${colors.border}`,
                    status === "locked" && "bg-muted text-muted-foreground"
                  )}
                >
                  {status === "completed" ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : status === "locked" ? (
                    <Lock className="w-3 h-3" />
                  ) : (
                    <PhaseIcon className="w-4 h-4" />
                  )}
                </div>
                {index < phases.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-1 mx-1 rounded-full",
                      index < currentPhaseIndex ? "bg-green-500" : "bg-muted"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-3">
            <Flame className="w-6 h-6 text-primary" />
            Your Pro Path
          </h2>
          <p className="text-muted-foreground mt-1">
            15-week journey to elite swing mechanics
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-foreground">{overallProgress}%</div>
          <div className="text-sm text-muted-foreground">
            Week {completedWeeks + 1} of {totalWeeks}
          </div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="relative">
        <Progress value={overallProgress} className="h-3" />
        <div className="flex justify-between mt-2">
          {phases.map((_, index) => (
            <div
              key={index}
              className="text-xs text-muted-foreground"
              style={{ width: `${100 / phases.length}%` }}
            >
              Phase {index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Phase Cards */}
      <div className="space-y-4">
        {phases.map((phase, index) => {
          const status = getPhaseStatus(phase, index);
          const info = phaseInfo[phase];
          const colors = phaseColors[index];
          const PhaseIcon = getPhaseIcon(phase);
          const isExpanded = expandedPhase === phase;
          const academyLinks = getPhaseAcademyContent(phase);

          // Calculate phase progress
          let phaseWeeksCompleted = 0;
          if (status === "completed") {
            phaseWeeksCompleted = weeksPerPhase;
          } else if (status === "current") {
            phaseWeeksCompleted = currentWeek - 1;
          }
          const phaseProgress = Math.round((phaseWeeksCompleted / weeksPerPhase) * 100);

          return (
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "rounded-xl border overflow-hidden transition-all",
                status === "current" && `border-2 ${colors.border} shadow-lg ${colors.glow}`,
                status === "completed" && "border-green-500/30 bg-green-500/5",
                status === "locked" && "border-border/50 opacity-60"
              )}
            >
              {/* Phase Header */}
              <button
                onClick={() => setExpandedPhase(isExpanded ? null : phase)}
                className={cn(
                  "w-full p-4 flex items-center gap-4 text-left transition-colors",
                  status !== "locked" && "hover:bg-muted/30"
                )}
                disabled={status === "locked"}
              >
                {/* Phase Number & Icon */}
                <div
                  className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
                    status === "completed" && "bg-green-500 text-white",
                    status === "current" && `${colors.bg} text-white`,
                    status === "locked" && "bg-muted text-muted-foreground"
                  )}
                >
                  {status === "completed" ? (
                    <CheckCircle2 className="w-7 h-7" />
                  ) : status === "locked" ? (
                    <Lock className="w-6 h-6" />
                  ) : (
                    <PhaseIcon className="w-7 h-7" />
                  )}
                </div>

                {/* Phase Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={cn(
                      "font-display text-lg font-bold",
                      status === "locked" ? "text-muted-foreground" : "text-foreground"
                    )}>
                      {info?.shortName || `Phase ${index + 1}`}
                    </h3>
                    {status === "current" && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} text-white font-medium`}>
                        Active
                      </span>
                    )}
                    {status === "completed" && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500 text-white font-medium">
                        Complete
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5 truncate">
                    {info?.description}
                  </p>
                  
                  {/* Focus Areas */}
                  {info?.focus && status !== "locked" && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {info.focus.map((item, i) => (
                        <span
                          key={i}
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            status === "completed" 
                              ? "bg-green-500/10 text-green-600"
                              : status === "current"
                              ? `${colors.bg}/10 ${colors.text}`
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Progress & Expand */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  {status !== "locked" && (
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-medium text-foreground">
                        {phaseWeeksCompleted}/{weeksPerPhase} weeks
                      </div>
                      <Progress value={phaseProgress} className="h-1.5 w-20 mt-1" />
                    </div>
                  )}
                  {status !== "locked" && (
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 text-muted-foreground transition-transform",
                        isExpanded && "rotate-180"
                      )}
                    />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && status !== "locked" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-4 border-t border-border/50 pt-4">
                      {/* Weekly Timeline */}
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Weekly Breakdown
                        </h4>
                        <div className="grid grid-cols-3 gap-3">
                          {Array.from({ length: weeksPerPhase }).map((_, weekIndex) => {
                            const weekStatus = getWeekStatus(index, weekIndex);
                            return (
                              <div
                                key={weekIndex}
                                className={cn(
                                  "p-3 rounded-lg border text-center transition-all",
                                  weekStatus === "completed" && "bg-green-500/10 border-green-500/30",
                                  weekStatus === "current" && `${colors.bg}/10 ${colors.border}/50 border-2`,
                                  weekStatus === "locked" && "bg-muted/30 border-border/30"
                                )}
                              >
                                <div className={cn(
                                  "text-xs font-medium mb-1",
                                  weekStatus === "completed" && "text-green-600",
                                  weekStatus === "current" && colors.text,
                                  weekStatus === "locked" && "text-muted-foreground"
                                )}>
                                  Week {weekIndex + 1}
                                </div>
                                <div className={cn(
                                  "w-6 h-6 rounded-full mx-auto flex items-center justify-center",
                                  weekStatus === "completed" && "bg-green-500 text-white",
                                  weekStatus === "current" && `${colors.bg} text-white`,
                                  weekStatus === "locked" && "bg-muted text-muted-foreground"
                                )}>
                                  {weekStatus === "completed" ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                  ) : weekStatus === "current" ? (
                                    <span className="text-xs font-bold">{currentWeek}</span>
                                  ) : (
                                    <Lock className="w-3 h-3" />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Academy Integration */}
                      {academyLinks.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            Academy Content
                          </h4>
                          <div className="space-y-2">
                            {academyLinks.map((link) => (
                              <Link
                                key={link.id}
                                to={link.level?.slug ? `/academy/${link.level.slug}` : '/academy'}
                                className={cn(
                                  "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                                  "bg-secondary/5 border-secondary/20 hover:bg-secondary/10"
                                )}
                              >
                                <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center">
                                  <BookOpen className="w-4 h-4 text-secondary" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-foreground">
                                    {link.level?.title}
                                  </div>
                                  {link.description && (
                                    <div className="text-xs text-muted-foreground">
                                      {link.description}
                                    </div>
                                  )}
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Phase Transition Video Note */}
                      {status === "current" && currentWeek === weeksPerPhase && (
                        <div className="flex items-start gap-3 p-3 bg-secondary/10 border border-secondary/20 rounded-lg">
                          <Video className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-sm font-medium text-foreground">
                              Ready for Phase Completion
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              Submit your swing video for coach review to advance to the next phase.
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Completion Badge */}
      {overallProgress === 100 && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-8 bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-amber-500/10 border border-amber-500/30 rounded-2xl"
        >
          <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h3 className="font-display text-2xl font-bold text-foreground">
            Pro Path Complete!
          </h3>
          <p className="text-muted-foreground mt-2">
            You've mastered all 15 weeks of elite swing training.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}