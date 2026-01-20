import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Drill {
  id: string;
  phase: string;
  week: number;
  title: string;
  description: string | null;
  video_url: string | null;
  duration_minutes: number;
  is_priority: boolean;
  sort_order: number;
}

interface DrillCompletion {
  id: string;
  drill_id: string;
  completed_at: string;
  notes: string | null;
}

interface VideoSubmission {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  status: "pending" | "reviewed" | "needs_work";
  coach_feedback: string | null;
  phase: string;
  week: number;
  submitted_at: string;
  reviewed_at: string | null;
}

interface PhaseProgress {
  id: string;
  phase: string;
  started_at: string;
  completed_at: string | null;
}

export interface PhaseInfo {
  name: string;
  shortName: string;
  description: string;
  icon: string;
  focus: string[];
}

const PHASES: string[] = [
  "Phase 1: Foundation",
  "Phase 2: Power Development",
  "Phase 3: Timing & Recognition",
  "Phase 4: Contact & Adjustment",
  "Phase 5: Game Integration",
];

const PHASE_INFO: Record<string, PhaseInfo> = {
  "Phase 1: Foundation": {
    name: "Phase 1: Foundation",
    shortName: "Foundation",
    description: "Build the fundamentals of an elite swing",
    icon: "foundation",
    focus: ["Stance & Balance", "Load Position", "Connection"]
  },
  "Phase 2: Power Development": {
    name: "Phase 2: Power Development",
    shortName: "Power",
    description: "Develop rotational power and bat speed",
    icon: "zap",
    focus: ["Hip Rotation", "Separation", "Ground Force"]
  },
  "Phase 3: Timing & Recognition": {
    name: "Phase 3: Timing & Recognition",
    shortName: "Timing",
    description: "Master pitch tracking and timing adjustments",
    icon: "eye",
    focus: ["Pitch Tracking", "Rhythm", "Velocity Adjustment"]
  },
  "Phase 4: Contact & Adjustment": {
    name: "Phase 4: Contact & Adjustment",
    shortName: "Contact",
    description: "Refine barrel control and in-game adjustments",
    icon: "target",
    focus: ["Barrel Control", "Pitch Zones", "Situational Hitting"]
  },
  "Phase 5: Game Integration": {
    name: "Phase 5: Game Integration",
    shortName: "Integration",
    description: "Apply skills in competitive situations",
    icon: "trophy",
    focus: ["At-Bat Strategy", "Mental Game", "Competition Ready"]
  }
};

const WEEKS_PER_PHASE = 3;

export function useProgressTracking() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  
  const [drills, setDrills] = useState<Drill[]>([]);
  const [completions, setCompletions] = useState<DrillCompletion[]>([]);
  const [submissions, setSubmissions] = useState<VideoSubmission[]>([]);
  const [phaseProgress, setPhaseProgress] = useState<PhaseProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const currentPhase = profile?.current_phase || PHASES[0];
  const currentWeek = profile?.current_week || 1;

  // Fetch all progress data
  const fetchProgressData = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [drillsRes, completionsRes, submissionsRes, progressRes] = await Promise.all([
        supabase
          .from("drills")
          .select("*")
          .eq("phase", currentPhase)
          .eq("week", currentWeek)
          .order("sort_order"),
        supabase
          .from("drill_completions")
          .select("*")
          .eq("user_id", user.id),
        supabase
          .from("video_submissions")
          .select("*")
          .eq("user_id", user.id)
          .order("submitted_at", { ascending: false }),
        supabase
          .from("phase_progress")
          .select("*")
          .eq("user_id", user.id),
      ]);

      if (drillsRes.data) setDrills(drillsRes.data);
      if (completionsRes.data) setCompletions(completionsRes.data);
      if (submissionsRes.data) {
        setSubmissions(submissionsRes.data as VideoSubmission[]);
      }
      if (progressRes.data) setPhaseProgress(progressRes.data);
    } catch (error) {
      console.error("Error fetching progress data:", error);
    } finally {
      setLoading(false);
    }
  }, [user, currentPhase, currentWeek]);

  useEffect(() => {
    fetchProgressData();
  }, [fetchProgressData]);

  // Check if a drill is completed
  const isDrillCompleted = useCallback(
    (drillId: string) => completions.some((c) => c.drill_id === drillId),
    [completions]
  );

  // Toggle drill completion
  const toggleDrillCompletion = async (drillId: string) => {
    if (!user) return;

    const isCompleted = isDrillCompleted(drillId);

    try {
      if (isCompleted) {
        await supabase
          .from("drill_completions")
          .delete()
          .eq("user_id", user.id)
          .eq("drill_id", drillId);
        
        setCompletions((prev) => prev.filter((c) => c.drill_id !== drillId));
      } else {
        const { data, error } = await supabase
          .from("drill_completions")
          .insert({ user_id: user.id, drill_id: drillId })
          .select()
          .single();

        if (error) throw error;
        if (data) setCompletions((prev) => [...prev, data]);
      }
    } catch (error) {
      console.error("Error toggling drill completion:", error);
      toast({
        title: "Error",
        description: "Failed to update drill status",
        variant: "destructive",
      });
    }
  };

  // Calculate weekly progress percentage
  const getWeeklyProgress = useCallback(() => {
    const weekDrills = drills.filter(
      (d) => d.phase === currentPhase && d.week === currentWeek
    );
    if (weekDrills.length === 0) return 0;

    const completedCount = weekDrills.filter((d) =>
      isDrillCompleted(d.id)
    ).length;
    return Math.round((completedCount / weekDrills.length) * 100);
  }, [drills, currentPhase, currentWeek, isDrillCompleted]);

  // Check if ready to advance to next week/phase
  const canAdvance = useCallback(() => {
    const weekDrills = drills.filter(
      (d) => d.phase === currentPhase && d.week === currentWeek
    );
    const priorityDrills = weekDrills.filter((d) => d.is_priority);
    
    // Must complete all priority drills to advance
    return priorityDrills.every((d) => isDrillCompleted(d.id));
  }, [drills, currentPhase, currentWeek, isDrillCompleted]);

  // Get phase info
  const getPhaseInfo = useCallback((phase: string): PhaseInfo => {
    return PHASE_INFO[phase] || PHASE_INFO[PHASES[0]];
  }, []);

  // Advance to next week or phase
  const advanceProgress = async () => {
    if (!user || !canAdvance()) return;

    try {
      let newWeek = currentWeek;
      let newPhase = currentPhase;

      if (currentWeek < WEEKS_PER_PHASE) {
        // Advance to next week
        newWeek = currentWeek + 1;
      } else {
        // Advance to next phase
        const currentPhaseIndex = PHASES.indexOf(currentPhase);
        if (currentPhaseIndex < PHASES.length - 1) {
          newPhase = PHASES[currentPhaseIndex + 1];
          newWeek = 1;

          // Mark current phase as completed
          await supabase
            .from("phase_progress")
            .upsert({
              user_id: user.id,
              phase: currentPhase,
              completed_at: new Date().toISOString(),
            });

          // Start new phase
          await supabase
            .from("phase_progress")
            .upsert({
              user_id: user.id,
              phase: newPhase,
              started_at: new Date().toISOString(),
            });
        } else {
          // All phases completed!
          toast({
            title: "🎉 Congratulations!",
            description: "You've completed all training phases!",
          });
          return;
        }
      }

      // Update profile with new week/phase
      const { error } = await supabase
        .from("profiles")
        .update({
          current_week: newWeek,
          current_phase: newPhase,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      await refreshProfile();
      await fetchProgressData();

      toast({
        title: newWeek === 1 ? "Phase Advanced!" : "Week Completed!",
        description:
          newWeek === 1
            ? `Welcome to ${newPhase}`
            : `Moving to Week ${newWeek}`,
      });
    } catch (error) {
      console.error("Error advancing progress:", error);
      toast({
        title: "Error",
        description: "Failed to advance progress",
        variant: "destructive",
      });
    }
  };

  // Submit a swing video
  const submitVideo = async (file: File, title: string, description?: string) => {
    if (!user) return;

    try {
      // Upload to storage
      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("swing-videos")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("swing-videos")
        .getPublicUrl(fileName);

      // Create submission record
      const { data, error } = await supabase
        .from("video_submissions")
        .insert({
          user_id: user.id,
          title,
          description,
          video_url: urlData.publicUrl,
          phase: currentPhase,
          week: currentWeek,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setSubmissions((prev) => [data as VideoSubmission, ...prev]);
      }

      toast({
        title: "Video Submitted!",
        description: "Coach Jasha will review your swing soon.",
      });

      return data;
    } catch (error) {
      console.error("Error submitting video:", error);
      toast({
        title: "Error",
        description: "Failed to submit video",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    drills,
    completions,
    submissions,
    phaseProgress,
    loading,
    currentPhase,
    currentWeek,
    isDrillCompleted,
    toggleDrillCompletion,
    getWeeklyProgress,
    canAdvance,
    advanceProgress,
    submitVideo,
    refreshData: fetchProgressData,
    getPhaseInfo,
    PHASES,
    PHASE_INFO,
    WEEKS_PER_PHASE,
  };
}
