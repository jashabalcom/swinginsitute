import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, PlayCircle, Clock, FileText, Lock, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Lesson } from "@/hooks/useCurriculum";
import { cn } from "@/lib/utils";
import logoImage from "@/assets/swing-institute-logo.png";

interface LessonCardProps {
  lesson: Lesson;
  isCompleted: boolean;
  watchProgress: number;
  index: number;
  isLocked?: boolean;
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return "";
  const mins = Math.floor(seconds / 60);
  return `${mins} min`;
}

export function LessonCard({
  lesson,
  isCompleted,
  watchProgress,
  index,
  isLocked = false,
}: LessonCardProps) {
  const isInProgress = watchProgress > 0 && watchProgress < 100 && !isCompleted;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Link
        to={isLocked ? "#" : `/academy/lesson/${lesson.id}`}
        className={cn(
          "flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 group",
          isLocked
            ? "bg-muted/30 border-border/50 cursor-not-allowed opacity-60"
            : isCompleted
            ? "bg-green-500/5 border-green-500/20 hover:border-green-500/40"
            : "bg-card border-border hover:border-primary/50 hover:bg-card/80"
        )}
      >
        {/* Video Thumbnail with Logo */}
        <div className="relative flex-shrink-0">
          <div
            className={cn(
              "w-20 h-14 rounded-lg overflow-hidden flex items-center justify-center",
              isLocked
                ? "bg-muted"
                : isCompleted
                ? "bg-green-500/10"
                : "bg-[#0B1C2D]"
            )}
          >
            <img 
              src={logoImage} 
              alt="Lesson thumbnail"
              className={cn(
                "w-12 h-12 object-contain",
                isLocked && "opacity-50"
              )}
            />
          </div>
          
          {/* Play button overlay */}
          {!isLocked && (
            <div className={cn(
              "absolute inset-0 flex items-center justify-center transition-opacity rounded-lg",
              isCompleted 
                ? "bg-green-500/60" 
                : "bg-black/40 group-hover:bg-primary/70"
            )}>
              {isCompleted ? (
                <CheckCircle2 className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white fill-white" />
              )}
            </div>
          )}

          {isLocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <Lock className="w-5 h-5 text-white/70" />
            </div>
          )}

          {/* Duration badge */}
          {lesson.video_duration_seconds && (
            <span className="absolute bottom-1 right-1 text-[10px] px-1 py-0.5 rounded bg-black/70 text-white font-medium">
              {formatDuration(lesson.video_duration_seconds)}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h5 className="font-medium text-foreground truncate">{lesson.title}</h5>
            {lesson.is_preview && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary font-medium">
                Preview
              </span>
            )}
          </div>
          {lesson.description && (
            <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
              {lesson.description}
            </p>
          )}
          
          {/* Meta info */}
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            {lesson.worksheet_url && (
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Worksheet
              </span>
            )}
            {isInProgress && (
              <div className="flex items-center gap-1.5">
                <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${watchProgress}%` }}
                  />
                </div>
                <span className="text-primary">{watchProgress}%</span>
              </div>
            )}
          </div>
        </div>

        {/* CTA Button */}
        {!isLocked && (
          <Button
            size="sm"
            variant={isCompleted ? "outline" : "default"}
            className={cn(
              "flex-shrink-0 gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity",
              isCompleted && "text-green-600 border-green-500/30 hover:bg-green-500/10"
            )}
          >
            <Play className="w-3.5 h-3.5" />
            {isCompleted ? "Rewatch" : isInProgress ? "Continue" : "Watch"}
          </Button>
        )}

        {/* Progress indicator for in-progress lessons */}
        {!isLocked && isInProgress && (
          <div className="w-10 h-10 relative flex-shrink-0 hidden sm:block">
            <svg className="w-10 h-10 -rotate-90">
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${(watchProgress / 100) * 100.5} 100.5`}
                className="text-primary"
              />
            </svg>
          </div>
        )}
      </Link>
    </motion.div>
  );
}
