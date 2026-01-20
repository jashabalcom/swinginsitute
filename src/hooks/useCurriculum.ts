import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface CurriculumLevel {
  id: string;
  level_number: number;
  title: string;
  slug: string;
  description: string | null;
  icon: string | null;
  is_locked: boolean;
  required_tiers: string[];
  sort_order: number;
  modules?: CurriculumModule[];
}

export interface CurriculumModule {
  id: string;
  level_id: string;
  title: string;
  slug: string;
  description: string | null;
  sort_order: number;
  lessons?: Lesson[];
  level?: CurriculumLevel;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  video_duration_seconds: number | null;
  worksheet_url: string | null;
  sort_order: number;
  is_preview: boolean;
  module?: CurriculumModule;
}

export interface LessonCompletion {
  id: string;
  user_id: string;
  lesson_id: string;
  completed_at: string;
  watch_progress_percent: number;
}

export function useCurriculum() {
  const { user, profile } = useAuth();
  const [levels, setLevels] = useState<CurriculumLevel[]>([]);
  const [completions, setCompletions] = useState<LessonCompletion[]>([]);
  const [loading, setLoading] = useState(true);

  const userTier = profile?.membership_tier || "starter";

  const fetchLevels = useCallback(async () => {
    const { data, error } = await supabase
      .from("curriculum_levels")
      .select(`
        *,
        modules:curriculum_modules(
          *,
          lessons(*)
        )
      `)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching curriculum:", error);
      return;
    }

    // Sort modules and lessons within each level
    const sortedData = (data || []).map((level: any) => ({
      ...level,
      modules: (level.modules || [])
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((module: any) => ({
          ...module,
          lessons: (module.lessons || []).sort((a: any, b: any) => a.sort_order - b.sort_order),
        })),
    }));

    setLevels(sortedData);
  }, []);

  const fetchCompletions = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("lesson_completions")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching completions:", error);
      return;
    }

    setCompletions(data || []);
  }, [user]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchLevels(), fetchCompletions()]);
      setLoading(false);
    };
    load();
  }, [fetchLevels, fetchCompletions]);

  const isLessonCompleted = useCallback(
    (lessonId: string) => {
      return completions.some((c) => c.lesson_id === lessonId);
    },
    [completions]
  );

  const getLessonProgress = useCallback(
    (lessonId: string) => {
      const completion = completions.find((c) => c.lesson_id === lessonId);
      return completion?.watch_progress_percent || 0;
    },
    [completions]
  );

  const markLessonComplete = useCallback(
    async (lessonId: string, progressPercent: number = 100) => {
      if (!user) return;

      const existing = completions.find((c) => c.lesson_id === lessonId);

      if (existing) {
        const { error } = await supabase
          .from("lesson_completions")
          .update({ watch_progress_percent: progressPercent, completed_at: new Date().toISOString() })
          .eq("id", existing.id);

        if (!error) {
          setCompletions((prev) =>
            prev.map((c) =>
              c.id === existing.id ? { ...c, watch_progress_percent: progressPercent } : c
            )
          );
        }
      } else {
        const { data, error } = await supabase
          .from("lesson_completions")
          .insert({
            user_id: user.id,
            lesson_id: lessonId,
            watch_progress_percent: progressPercent,
          })
          .select()
          .single();

        if (!error && data) {
          setCompletions((prev) => [...prev, data]);
        }
      }
    },
    [user, completions]
  );

  const canAccessLevel = useCallback(
    (level: CurriculumLevel) => {
      if (!level.is_locked) return true;
      if (!level.required_tiers || level.required_tiers.length === 0) return true;
      return level.required_tiers.includes(userTier);
    },
    [userTier]
  );

  const getLevelProgress = useCallback(
    (level: CurriculumLevel) => {
      const allLessons = level.modules?.flatMap((m) => m.lessons || []) || [];
      if (allLessons.length === 0) return 0;
      const completed = allLessons.filter((l) => isLessonCompleted(l.id)).length;
      return Math.round((completed / allLessons.length) * 100);
    },
    [isLessonCompleted]
  );

  const getModuleProgress = useCallback(
    (module: CurriculumModule) => {
      const lessons = module.lessons || [];
      if (lessons.length === 0) return 0;
      const completed = lessons.filter((l) => isLessonCompleted(l.id)).length;
      return Math.round((completed / lessons.length) * 100);
    },
    [isLessonCompleted]
  );

  const getTotalProgress = useCallback(() => {
    const accessibleLevels = levels.filter(canAccessLevel);
    const allLessons = accessibleLevels.flatMap(
      (level) => level.modules?.flatMap((m) => m.lessons || []) || []
    );
    if (allLessons.length === 0) return 0;
    const completed = allLessons.filter((l) => isLessonCompleted(l.id)).length;
    return Math.round((completed / allLessons.length) * 100);
  }, [levels, canAccessLevel, isLessonCompleted]);

  // Get last watched lesson (one with progress but not complete)
  const getLastWatchedLesson = useCallback(() => {
    const inProgressCompletions = completions
      .filter((c) => c.watch_progress_percent > 0 && c.watch_progress_percent < 100)
      .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
    
    if (inProgressCompletions.length === 0) return null;
    
    const lastCompletion = inProgressCompletions[0];
    
    // Find the lesson
    for (const level of levels) {
      for (const module of level.modules || []) {
        const lesson = module.lessons?.find((l) => l.id === lastCompletion.lesson_id);
        if (lesson) return lesson;
      }
    }
    
    return null;
  }, [completions, levels]);

  return {
    levels,
    completions,
    loading,
    isLessonCompleted,
    getLessonProgress,
    markLessonComplete,
    canAccessLevel,
    getLevelProgress,
    getModuleProgress,
    getTotalProgress,
    getLastWatchedLesson,
    refetch: () => Promise.all([fetchLevels(), fetchCompletions()]),
  };
}
