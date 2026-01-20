import { motion } from "framer-motion";
import { CheckCircle2, Circle, ChevronRight, Video, Clock, AlertCircle, BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AdvancementStatus } from "@/hooks/useProgressTracking";

interface Drill {
  id: string;
  title: string;
  description: string | null;
  is_priority: boolean;
  duration_minutes: number;
}

interface PhaseAcademyLink {
  id: string;
  phase: string;
  level_id: string | null;
  module_id: string | null;
  description: string | null;
  level?: {
    id: string;
    title: string;
    slug: string;
    icon: string | null;
  };
  module?: {
    id: string;
    title: string;
    slug: string;
  };
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
  advancementStatus?: AdvancementStatus;
  academyLinks?: PhaseAcademyLink[];
  onSubmitPhaseVideo?: () => void;
  isAdminView?: boolean;
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
  advancementStatus,
  academyLinks,
  onSubmitPhaseVideo,
  isAdminView = false,
}: WeeklyDrillsCardProps) {
  const completedCount = drills.filter((d) => isDrillCompleted(d.id)).length;
  const isLastWeek = currentWeek >= weeksPerPhase;
  const needsPhaseTransitionVideo = isLastWeek && advancementStatus?.priorityDrillsComplete && !advancementStatus?.hasPhaseTransitionVideo && !isAdminView;
  const pendingReview = advancementStatus?.pendingReview && !isAdminView;
  
  // Admin can always advance
  const effectiveCanAdvance = isAdminView ? true : canAdvance;
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

      {/* Academy Links for Current Phase */}
      {academyLinks && academyLinks.length > 0 && (
        <div className="mb-6 p-4 bg-secondary/5 border border-secondary/20 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-foreground">Related Academy Content</span>
          </div>
          <div className="space-y-2">
            {academyLinks.map((link) => (
              <Link
                key={link.id}
                to={link.level?.slug ? `/academy/${link.level.slug}` : '/academy'}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary transition-colors"
              >
                <ChevronRight className="w-3 h-3" />
                <span>{link.level?.title || link.module?.title}</span>
                {link.description && (
                  <span className="text-xs text-muted-foreground/60">— {link.description}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

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

      {/* Phase Transition Video Required */}
      {needsPhaseTransitionVideo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-secondary/10 border border-secondary/20 rounded-lg"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
              <Video className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">Ready for Phase Advancement!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You've completed all priority drills. Submit a swing video for Coach Jasha to review before advancing to the next phase.
              </p>
              <Button
                className="mt-3 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={onSubmitPhaseVideo}
              >
                <Video className="w-4 h-4 mr-2" />
                Submit Phase Transition Video
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Pending Coach Review */}
      {pendingReview && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">Awaiting Coach Review</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your phase transition video is being reviewed by Coach Jasha. You'll be notified when approved to advance.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Blocked Reason */}
      {advancementStatus?.blockedReason && !needsPhaseTransitionVideo && !pendingReview && !canAdvance && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-3 bg-muted/50 border border-border rounded-lg"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="w-4 h-4" />
            <span>{advancementStatus.blockedReason}</span>
          </div>
        </motion.div>
      )}

      {effectiveCanAdvance && (
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