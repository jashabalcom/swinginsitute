import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lesson } from "@/hooks/useCurriculum";
import logoImage from "@/assets/swing-institute-logo.png";

interface ContinueWatchingWidgetProps {
  lesson: Lesson | null;
  progress: number;
}

export function ContinueWatchingWidget({ lesson, progress }: ContinueWatchingWidgetProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (!lesson || isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.9 }}
        className="fixed bottom-24 lg:bottom-6 right-4 lg:right-6 z-50"
      >
        <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden max-w-xs">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
            <span className="text-xs font-medium text-muted-foreground">Continue Watching</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={() => setIsDismissed(true)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <Link to={`/academy/lesson/${lesson.id}`} className="block">
            <div className="flex items-center gap-3 p-3 hover:bg-muted/30 transition-colors">
              {/* Thumbnail */}
              <div className="relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden bg-[#0B1C2D]">
                <img 
                  src={logoImage} 
                  alt="Lesson thumbnail"
                  className="w-full h-full object-contain p-1"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-primary/60 transition-colors">
                  <Play className="w-5 h-5 text-white fill-white" />
                </div>
                {/* Progress bar on thumbnail */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground truncate">
                  {lesson.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {progress}% complete
                </p>
              </div>

              {/* Resume button */}
              <Button size="sm" className="flex-shrink-0 gap-1">
                <Play className="w-3 h-3" />
                Resume
              </Button>
            </div>
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
