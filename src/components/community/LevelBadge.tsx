import { getLevelName } from "@/hooks/useGamification";
import { cn } from "@/lib/utils";

interface LevelBadgeProps {
  level: number;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  className?: string;
}

const levelColors: Record<number, string> = {
  1: "bg-muted text-muted-foreground",
  2: "bg-slate-600 text-slate-100",
  3: "bg-green-600 text-green-100",
  4: "bg-blue-600 text-blue-100",
  5: "bg-purple-600 text-purple-100",
  6: "bg-pink-600 text-pink-100",
  7: "bg-orange-600 text-orange-100",
  8: "bg-red-600 text-red-100",
  9: "bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950",
  10: "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-amber-950 animate-pulse",
};

export function LevelBadge({ level, size = "md", showName = false, className }: LevelBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-0.5",
    lg: "text-base px-3 py-1",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold",
        levelColors[level] || levelColors[1],
        sizeClasses[size],
        className
      )}
    >
      <span>Lv.{level}</span>
      {showName && <span className="hidden sm:inline">• {getLevelName(level)}</span>}
    </span>
  );
}
