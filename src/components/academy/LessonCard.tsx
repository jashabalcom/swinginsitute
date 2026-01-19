import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, PlayCircle, Clock, FileText, Lock } from "lucide-react";
import { Lesson } from "@/hooks/useCurriculum";
import { cn } from "@/lib/utils";

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
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Link
        to={isLocked ? "#" : `/academy/lesson/${lesson.id}`}
        className={cn(
          "flex items-center gap-4 p-4 rounded-lg border transition-all duration-200",
          isLocked
            ? "bg-muted/30 border-border/50 cursor-not-allowed opacity-60"
            : isCompleted
            ? "bg-green-500/5 border-green-500/20 hover:border-green-500/40"
            : "bg-card border-border hover:border-primary/50 hover:bg-card/80"
        )}
      >
        {/* Status Icon */}
        <div
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
            isLocked
              ? "bg-muted text-muted-foreground"
              : isCompleted
              ? "bg-green-500/20 text-green-500"
              : watchProgress > 0
              ? "bg-primary/20 text-primary"
              : "bg-muted text-muted-foreground"
          )}
        >
          {isLocked ? (
            <Lock className="w-4 h-4" />
          ) : isCompleted ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <PlayCircle className="w-5 h-5" />
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
          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
            {lesson.video_duration_seconds && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDuration(lesson.video_duration_seconds)}
              </span>
            )}
            {lesson.worksheet_url && (
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Worksheet
              </span>
            )}
            {watchProgress > 0 && watchProgress < 100 && !isCompleted && (
              <span className="text-primary">{watchProgress}% watched</span>
            )}
          </div>
        </div>

        {/* Progress indicator for in-progress lessons */}
        {!isLocked && watchProgress > 0 && watchProgress < 100 && !isCompleted && (
          <div className="w-12 h-12 relative">
            <svg className="w-12 h-12 -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${(watchProgress / 100) * 125.6} 125.6`}
                className="text-primary"
              />
            </svg>
          </div>
        )}
      </Link>
    </motion.div>
  );
}
