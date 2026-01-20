import { motion } from "framer-motion";
import { CheckCircle2, Circle, Play, Clock, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Drill {
  id: string;
  title: string;
  description: string | null;
  is_priority: boolean;
  duration_minutes: number;
  video_url?: string | null;
}

interface DrillCardProps {
  drill: Drill;
  isCompleted: boolean;
  onToggle: (drillId: string) => void;
  index: number;
}

export function DrillCard({ drill, isCompleted, onToggle, index }: DrillCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => onToggle(drill.id)}
      className={cn(
        "group relative rounded-xl border overflow-hidden cursor-pointer transition-all duration-200",
        isCompleted
          ? "bg-accent/5 border-accent/30"
          : drill.is_priority
          ? "bg-primary/5 border-primary/30 hover:border-primary/50"
          : "bg-card border-border/50 hover:border-border"
      )}
    >
      {/* Video Thumbnail Area */}
      <div 
        className={cn(
          "relative h-24 flex items-center justify-center",
          isCompleted ? "bg-accent/10" : drill.is_priority ? "bg-primary/10" : "bg-muted/30"
        )}
      >
        {/* Play Button Overlay */}
        {drill.video_url && !isCompleted && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
              <Play className="w-5 h-5 text-background fill-current ml-0.5" />
            </div>
          </div>
        )}
        
        {/* Completion Overlay */}
        {isCompleted && (
          <div className="absolute inset-0 flex items-center justify-center bg-accent/20">
            <CheckCircle2 className="w-10 h-10 text-accent" />
          </div>
        )}
        
        {/* Priority Badge */}
        {drill.is_priority && !isCompleted && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
            <Star className="w-3 h-3 fill-current" />
            Priority
          </div>
        )}
        
        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-background/80 text-foreground text-xs">
          <Clock className="w-3 h-3" />
          {drill.duration_minutes}min
        </div>
        
        {/* Placeholder Icon when no video/completion */}
        {!isCompleted && !drill.video_url && (
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center",
            drill.is_priority ? "bg-primary/20" : "bg-muted"
          )}>
            <Circle className={cn(
              "w-6 h-6",
              drill.is_priority ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-3">
        <h4 className={cn(
          "font-medium text-sm leading-tight mb-1 line-clamp-2",
          isCompleted ? "text-muted-foreground line-through" : "text-foreground"
        )}>
          {drill.title}
        </h4>
        {drill.description && (
          <p className="text-xs text-muted-foreground line-clamp-1">
            {drill.description}
          </p>
        )}
      </div>
      
      {/* Bottom Status Bar */}
      <div className={cn(
        "h-1 w-full",
        isCompleted ? "bg-accent" : drill.is_priority ? "bg-primary/30" : "bg-transparent"
      )} />
    </motion.div>
  );
}
