import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface UserPoints {
  id: string;
  user_id: string;
  total_points: number;
  level: number;
  streak_days: number;
  last_active_date: string | null;
}

interface Badge {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  points_required: number;
  criteria: Record<string, unknown>;
}

interface UserBadge {
  id: string;
  badge_id: string;
  earned_at: string;
  badge: Badge;
}

// Level thresholds
const LEVEL_THRESHOLDS = [
  0,     // Level 1: 0-99
  100,   // Level 2: 100-299
  300,   // Level 3: 300-599
  600,   // Level 4: 600-999
  1000,  // Level 5: 1000-1499
  1500,  // Level 6: 1500-2499
  2500,  // Level 7: 2500-3999
  4000,  // Level 8: 4000-5999
  6000,  // Level 9: 6000-8499
  8500,  // Level 10: 8500+
];

const LEVEL_NAMES = [
  "Rookie",
  "Starter",
  "Player",
  "Competitor",
  "Advanced",
  "Expert",
  "Elite",
  "Master",
  "Champion",
  "Legend",
];

// Point values for actions
export const POINT_VALUES = {
  create_post: 10,
  receive_like: 2,
  comment: 3,
  receive_comment_like: 1,
  daily_login: 5,
  first_post_week: 15,
  upload_video: 20,
};

export function calculateLevel(points: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (points >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

export function getLevelName(level: number): string {
  return LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)];
}

export function getProgressToNextLevel(points: number): { current: number; next: number; percentage: number } {
  const level = calculateLevel(points);
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  
  if (level >= 10) {
    return { current: points, next: nextThreshold, percentage: 100 };
  }
  
  const pointsInLevel = points - currentThreshold;
  const pointsNeeded = nextThreshold - currentThreshold;
  const percentage = Math.min((pointsInLevel / pointsNeeded) * 100, 100);
  
  return { current: points, next: nextThreshold, percentage };
}

export function useGamification() {
  const { user } = useAuth();
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize or fetch user points
  const fetchUserPoints = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_points")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code === "PGRST116") {
      // No record exists, create one
      const { data: newData, error: insertError } = await supabase
        .from("user_points")
        .insert({ user_id: user.id })
        .select()
        .single();

      if (!insertError && newData) {
        setUserPoints(newData);
      }
    } else if (data) {
      setUserPoints(data);
    }
  }, [user]);

  // Fetch user badges
  const fetchUserBadges = useCallback(async () => {
    if (!user) return;

    const { data } = await supabase
      .from("user_badges")
      .select(`
        id,
        badge_id,
        earned_at,
        badge:badges(*)
      `)
      .eq("user_id", user.id);

    if (data) {
      setUserBadges(data as unknown as UserBadge[]);
    }
  }, [user]);

  // Fetch all badges
  const fetchAllBadges = useCallback(async () => {
    const { data } = await supabase
      .from("badges")
      .select("*")
      .order("points_required");

    if (data) {
      setAllBadges(data as Badge[]);
    }
  }, []);

  // Award points
  const awardPoints = useCallback(async (
    actionType: keyof typeof POINT_VALUES,
    referenceId?: string
  ) => {
    if (!user || !userPoints) return;

    const points = POINT_VALUES[actionType];
    const newTotal = userPoints.total_points + points;
    const newLevel = calculateLevel(newTotal);

    // Update user points
    await supabase
      .from("user_points")
      .update({
        total_points: newTotal,
        level: newLevel,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    // Record transaction
    await supabase.from("point_transactions").insert({
      user_id: user.id,
      points,
      action_type: actionType,
      reference_id: referenceId,
    });

    // Refetch to update state
    fetchUserPoints();
  }, [user, userPoints, fetchUserPoints]);

  // Initialize
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchUserPoints(), fetchUserBadges(), fetchAllBadges()]);
      setLoading(false);
    };

    if (user) {
      loadData();
    }
  }, [user, fetchUserPoints, fetchUserBadges, fetchAllBadges]);

  return {
    userPoints,
    userBadges,
    allBadges,
    loading,
    awardPoints,
    calculateLevel,
    getLevelName,
    getProgressToNextLevel,
    refetch: fetchUserPoints,
  };
}
