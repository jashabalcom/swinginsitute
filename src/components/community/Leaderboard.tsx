import { useState, useEffect } from "react";
import { Trophy, Medal, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LevelBadge } from "./LevelBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LeaderboardEntry {
  user_id: string;
  total_points: number;
  level: number;
  profile: {
    player_name: string | null;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface LeaderboardProps {
  limit?: number;
  showHeader?: boolean;
}

export function Leaderboard({ limit = 5, showHeader = true }: LeaderboardProps) {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      const { data: pointsData } = await supabase
        .from("user_points")
        .select("user_id, total_points, level")
        .order("total_points", { ascending: false })
        .limit(limit);

      if (!pointsData || pointsData.length === 0) {
        setLoading(false);
        return;
      }

      const userIds = pointsData.map(p => p.user_id);
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, player_name, full_name, avatar_url")
        .in("user_id", userIds);

      const profileMap = new Map(profilesData?.map(p => [p.user_id, p]));

      const leaderboardData: LeaderboardEntry[] = pointsData.map(p => ({
        user_id: p.user_id,
        total_points: p.total_points,
        level: p.level,
        profile: profileMap.get(p.user_id) || null,
      }));

      setLeaders(leaderboardData);
      setLoading(false);
    }

    fetchLeaderboard();
  }, [limit]);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-4 h-4 text-yellow-400" />;
      case 1:
        return <Medal className="w-4 h-4 text-gray-400" />;
      case 2:
        return <Award className="w-4 h-4 text-amber-600" />;
      default:
        return <span className="w-4 h-4 text-center text-xs text-muted-foreground">{index + 1}</span>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="h-10 bg-muted/50 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (leaders.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground text-sm">
        No activity yet. Be the first!
      </div>
    );
  }

  return (
    <div>
      {showHeader && (
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <h3 className="font-semibold text-sm">Leaderboard</h3>
        </div>
      )}
      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {leaders.map((entry, index) => (
            <div
              key={entry.user_id}
              className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="w-5 flex justify-center">{getRankIcon(index)}</div>
              <Avatar className="h-7 w-7">
                <AvatarImage src={entry.profile?.avatar_url || undefined} />
                <AvatarFallback className="text-xs bg-primary/20 text-primary">
                  {(entry.profile?.player_name || entry.profile?.full_name || "?")[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {entry.profile?.player_name || entry.profile?.full_name || "Anonymous"}
                </p>
              </div>
              <LevelBadge level={entry.level} size="sm" />
              <span className="text-xs text-muted-foreground font-mono">
                {entry.total_points.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
