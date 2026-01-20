import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Layers,
  Zap,
  Eye,
  Target,
  Trophy,
  BookOpen,
  Video,
  ChevronRight,
  Flame,
  Calendar,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PhaseInfo } from "@/hooks/useProgressTracking";

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

interface TrainingHeroSectionProps {
  currentPhase: string;
  currentWeek: number;
  phaseInfo: Record<string, PhaseInfo>;
  weeksPerPhase: number;
  phases: string[];
  academyLinks?: PhaseAcademyLink[];
  onSubmitSwing?: () => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  foundation: Layers,
  zap: Zap,
  eye: Eye,
  target: Target,
  trophy: Trophy,
};

const phaseColors: Record<number, { bg: string; text: string; border: string; glow: string }> = {
  0: { bg: "bg-blue-500", text: "text-blue-500", border: "border-blue-500", glow: "shadow-blue-500/30" },
  1: { bg: "bg-orange-500", text: "text-orange-500", border: "border-orange-500", glow: "shadow-orange-500/30" },
  2: { bg: "bg-purple-500", text: "text-purple-500", border: "border-purple-500", glow: "shadow-purple-500/30" },
  3: { bg: "bg-emerald-500", text: "text-emerald-500", border: "border-emerald-500", glow: "shadow-emerald-500/30" },
  4: { bg: "bg-amber-500", text: "text-amber-500", border: "border-amber-500", glow: "shadow-amber-500/30" },
};

export function TrainingHeroSection({
  currentPhase,
  currentWeek,
  phaseInfo,
  weeksPerPhase,
  phases,
  academyLinks,
  onSubmitSwing,
}: TrainingHeroSectionProps) {
  const currentPhaseIndex = phases.indexOf(currentPhase);
  const colors = phaseColors[currentPhaseIndex] || phaseColors[0];
  const info = phaseInfo[currentPhase];
  const PhaseIcon = iconMap[info?.icon] || Layers;
  
  const weekProgress = Math.round((currentWeek / weeksPerPhase) * 100);
  const totalWeeks = phases.length * weeksPerPhase;
  const overallWeek = currentPhaseIndex * weeksPerPhase + currentWeek;
  const weeksRemaining = totalWeeks - overallWeek;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border-2 p-6 md:p-8",
        colors.border,
        "bg-gradient-to-br from-card via-card to-card/80"
      )}
    >
      {/* Background Glow */}
      <div 
        className={cn(
          "absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-20",
          colors.bg
        )} 
      />
      
      <div className="relative z-10">
        {/* Top Row: Phase Badge + Progress */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            {/* Phase Icon */}
            <div 
              className={cn(
                "w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center shadow-lg",
                colors.bg,
                colors.glow
              )}
            >
              <PhaseIcon className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            
            {/* Phase Info */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={cn("text-xs font-bold uppercase tracking-wider", colors.text)}>
                  Phase {currentPhaseIndex + 1}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  Week {currentWeek} of {weeksPerPhase}
                </span>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                {info?.shortName || currentPhase}
              </h1>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                {info?.description}
              </p>
            </div>
          </div>
          
          {/* Progress Ring / Stats */}
          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <div className="text-3xl font-display font-bold text-foreground">
                {overallWeek}
                <span className="text-lg text-muted-foreground">/{totalWeeks}</span>
              </div>
              <p className="text-xs text-muted-foreground">weeks complete</p>
            </div>
            <div className="hidden md:flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span className="text-xs">{weeksRemaining} weeks to go</span>
            </div>
          </div>
        </div>
        
        {/* Week Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Phase Progress</span>
            <span className={cn("text-sm font-bold", colors.text)}>{weekProgress}%</span>
          </div>
          <div className="relative h-3 bg-muted/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${weekProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={cn("absolute inset-y-0 left-0 rounded-full", colors.bg)}
            />
            {/* Week markers */}
            <div className="absolute inset-0 flex">
              {Array.from({ length: weeksPerPhase }).map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "flex-1 border-r last:border-r-0",
                    i < currentWeek ? "border-white/20" : "border-muted-foreground/20"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Focus Areas */}
        {info?.focus && (
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-xs text-muted-foreground uppercase tracking-wide mr-2">Focus:</span>
            {info.focus.map((item, i) => (
              <span
                key={i}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full font-medium",
                  colors.bg + "/10",
                  colors.text
                )}
              >
                {item}
              </span>
            ))}
          </div>
        )}
        
        {/* Action Cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Academy Link Card */}
          {academyLinks && academyLinks.length > 0 && (
            <Link
              to={academyLinks[0]?.level?.slug ? `/academy/${academyLinks[0].level.slug}` : "/academy"}
              className="group"
            >
              <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/5 border border-secondary/20 hover:bg-secondary/10 hover:border-secondary/40 transition-all">
                <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground text-sm">Academy Content</h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {academyLinks[0]?.level?.title || "Explore lessons"}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-secondary group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          )}
          
          {/* Submit Swing Card */}
          <button onClick={onSubmitSwing} className="group text-left">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Video className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground text-sm">Submit Swing</h3>
                <p className="text-xs text-muted-foreground truncate">
                  Get coach feedback
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </motion.section>
  );
}
