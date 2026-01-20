import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  ChevronRight, 
  Video, 
  Clock, 
  AlertCircle, 
  BookOpen,
  Flame,
  Target 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { DrillCard } from "./DrillCard";
import { AdvancementStatus } from "@/hooks/useProgressTracking";
import { cn } from "@/lib/utils";

interface Drill {
  id: string;
  title: string;
  description: string | null;
  is_priority: boolean;
  duration_minutes: number;
  video_url?: string | null;
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

interface WeeklyTrainingCardProps {
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

export function WeeklyTrainingCard({
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
}: WeeklyTrainingCardProps) {
  const completedCount = drills.filter((d) => isDrillCompleted(d.id)).length;
  const priorityDrills = drills.filter((d) => d.is_priority);
  const completedPriority = priorityDrills.filter((d) => isDrillCompleted(d.id)).length;
  const isLastWeek = currentWeek >= weeksPerPhase;
  const needsPhaseTransitionVideo = isLastWeek && advancementStatus?.priorityDrillsComplete && !advancementStatus?.hasPhaseTransitionVideo && !isAdminView;
  const pendingReview = advancementStatus?.pendingReview && !isAdminView;
  const effectiveCanAdvance = isAdminView ? true : canAdvance;
  
  const totalMinutes = drills.reduce((sum, d) => sum + (d.duration_minutes || 0), 0);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card-premium p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">
              Week {currentWeek} Training
            </h2>
            <p className="text-sm text-muted-foreground">
              {drills.length} drills • ~{totalMinutes} min
            </p>
          </div>
        </div>
        
        {/* Completion Badge */}
        <div className="flex items-center gap-2">
          {completedCount === drills.length && drills.length > 0 ? (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Complete
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">
              {completedCount}/{drills.length}
            </span>
          )}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <Progress value={progressPercent} className="h-2" />
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>{completedPriority}/{priorityDrills.length} priority complete</span>
          <span>{progressPercent}%</span>
        </div>
      </div>
      
      {/* Drill Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {drills.map((drill, index) => (
          <DrillCard
            key={drill.id}
            drill={drill}
            isCompleted={isDrillCompleted(drill.id)}
            onToggle={onToggleDrill}
            index={index}
          />
        ))}
      </div>
      
      {/* Related Academy Content */}
      {academyLinks && academyLinks.length > 0 && (
        <div className="mb-6 p-4 bg-secondary/5 border border-secondary/20 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-foreground">Learn the Theory</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {academyLinks.map((link) => (
              <Link
                key={link.id}
                to={link.level?.slug ? `/academy/${link.level.slug}` : '/academy'}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors"
              >
                <span className="text-sm text-foreground">{link.level?.title || link.module?.title}</span>
                <ChevronRight className="w-3.5 h-3.5 text-secondary" />
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Phase Transition Video Required */}
      {needsPhaseTransitionVideo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-primary/5 border border-primary/20 rounded-xl"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Video className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground flex items-center gap-2">
                <Flame className="w-4 h-4 text-primary" />
                Ready for Phase Advancement!
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Submit your swing video for Coach Jasha to review before advancing.
              </p>
              <Button
                className="mt-3 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={onSubmitPhaseVideo}
              >
                <Video className="w-4 h-4 mr-2" />
                Submit Phase Video
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
          className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">Awaiting Coach Review</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your phase transition video is being reviewed. You'll be notified when approved.
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
          className="p-3 bg-muted/50 border border-border rounded-lg"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="w-4 h-4" />
            <span>{advancementStatus.blockedReason}</span>
          </div>
        </motion.div>
      )}

      {/* Advance Button */}
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
