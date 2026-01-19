import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, PlayCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { CurriculumModule } from "@/hooks/useCurriculum";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  module: CurriculumModule;
  levelSlug: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  index: number;
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={`/academy/level/${levelSlug}/module/${module.slug}`}
        className="block p-5 rounded-lg border bg-card hover:bg-card/80 border-border hover:border-primary/50 transition-all duration-300"
      >
        <div className="flex items-center gap-4">
          {/* Status Icon */}
          <div
            className={cn(
              "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
              isComplete ? "bg-green-500/20 text-green-500" : "bg-primary/20 text-primary"
            )}
          >
            {isComplete ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <PlayCircle className="w-5 h-5" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="font-display font-semibold text-foreground truncate">
              {module.title}
            </h4>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {module.description}
            </p>
            
            {/* Progress info */}
            <div className="flex items-center gap-3 mt-2">
              <Progress value={progress} className="flex-1 h-1.5" />
              <span className="text-xs text-muted-foreground">
                {completedLessons}/{totalLessons} lessons
              </span>
            </div>
          </div>

          {/* Arrow */}
          <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        </div>
      </Link>
    </motion.div>
  );
}
