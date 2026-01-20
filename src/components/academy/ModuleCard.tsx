import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, PlayCircle, Clock, BookOpen, Play } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { CurriculumModule } from "@/hooks/useCurriculum";
import { cn } from "@/lib/utils";
import logoImage from "@/assets/swing-institute-logo.png";

interface ModuleCardProps {
  module: CurriculumModule;
  levelSlug: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  index: number;
}

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

export function ModuleCard({
  module,
  levelSlug,
  progress,
  completedLessons,
  totalLessons,
  index,
}: ModuleCardProps) {
  const isComplete = progress === 100;
  
  // Calculate total duration
  const totalDuration = module.lessons?.reduce(
    (acc, l) => acc + (l.video_duration_seconds || 0), 
    0
  ) || 0;

  // Get first few lessons for preview
  const previewLessons = module.lessons?.slice(0, 3) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={`/academy/level/${levelSlug}/module/${module.slug}`}
        className="block p-5 rounded-xl border bg-card hover:bg-card/80 border-border hover:border-primary/50 transition-all duration-300 group"
      >
        <div className="flex items-start gap-4">
          {/* Thumbnail with Logo */}
          <div className="relative flex-shrink-0">
            <div
              className={cn(
                "w-20 h-20 rounded-xl overflow-hidden flex items-center justify-center",
                isComplete ? "bg-green-500/10" : "bg-[#0B1C2D]"
              )}
            >
              <img 
                src={logoImage} 
                alt="Module thumbnail"
                className="w-14 h-14 object-contain"
              />
            </div>
            
            {/* Play/Complete overlay */}
            <div className={cn(
              "absolute inset-0 flex items-center justify-center rounded-xl transition-all",
              isComplete 
                ? "bg-green-500/60" 
                : "bg-black/30 group-hover:bg-primary/60"
            )}>
              {isComplete ? (
                <CheckCircle2 className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white fill-white" />
              )}
            </div>

            {/* Progress ring for in-progress modules */}
            {!isComplete && progress > 0 && (
              <svg className="absolute -inset-1 w-[88px] h-[88px] -rotate-90">
                <circle
                  cx="44"
                  cy="44"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-muted/30"
                />
                <circle
                  cx="44"
                  cy="44"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${(progress / 100) * 251.3} 251.3`}
                  className="text-primary"
                />
              </svg>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="font-display font-semibold text-foreground mb-1">
              {module.title}
            </h4>
            <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
              {module.description}
            </p>
            
            {/* Stats Row */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {totalLessons} lessons
              </span>
              {totalDuration > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(totalDuration)}
                </span>
              )}
            </div>

            {/* Lesson Preview */}
            {previewLessons.length > 0 && (
              <div className="space-y-1 mb-3">
                {previewLessons.map((lesson, i) => (
                  <div 
                    key={lesson.id}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <span className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium">
                      {i + 1}
                    </span>
                    <span className="truncate">{lesson.title}</span>
                    {lesson.is_preview && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                        Free
                      </span>
                    )}
                  </div>
                ))}
                {totalLessons > 3 && (
                  <div className="text-xs text-muted-foreground pl-6">
                    +{totalLessons - 3} more lessons
                  </div>
                )}
              </div>
            )}
            
            {/* Progress info */}
            <div className="flex items-center gap-3">
              <Progress value={progress} className="flex-1 h-1.5" />
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {completedLessons}/{totalLessons} done
              </span>
            </div>
          </div>

          {/* Arrow */}
          <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
        </div>
      </Link>
    </motion.div>
  );
}
