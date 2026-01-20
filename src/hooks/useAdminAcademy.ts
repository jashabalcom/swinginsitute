import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AdminLevel {
  id: string;
  level_number: number;
  title: string;
  slug: string;
  description: string | null;
  icon: string | null;
  is_locked: boolean;
  required_tiers: string[];
  sort_order: number;
}

export interface AdminModule {
  id: string;
  level_id: string;
  title: string;
  slug: string;
  description: string | null;
  sort_order: number;
}

export interface AdminLesson {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  video_duration_seconds: number | null;
  worksheet_url: string | null;
  thumbnail_url: string | null;
  sort_order: number;
  is_preview: boolean;
}

export interface AcademyStats {
  totalLevels: number;
  totalModules: number;
  totalLessons: number;
  lessonsWithVideos: number;
}

export function useAdminAcademy() {
  const { toast } = useToast();
  const [levels, setLevels] = useState<AdminLevel[]>([]);
  const [modules, setModules] = useState<AdminModule[]>([]);
  const [lessons, setLessons] = useState<AdminLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  const fetchLevels = useCallback(async () => {
    const { data, error } = await supabase
      .from("curriculum_levels")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching levels:", error);
      toast({ title: "Error loading levels", variant: "destructive" });
      return;
    }

    setLevels(data || []);
  }, [toast]);

  const fetchModules = useCallback(async (levelId: string) => {
    const { data, error } = await supabase
      .from("curriculum_modules")
      .select("*")
      .eq("level_id", levelId)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching modules:", error);
      return;
    }

    setModules(data || []);
  }, []);

  const fetchLessons = useCallback(async (moduleId: string) => {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("module_id", moduleId)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching lessons:", error);
      return;
    }

    setLessons(data || []);
  }, []);

  const fetchStats = useCallback(async (): Promise<AcademyStats> => {
    const [levelsRes, modulesRes, lessonsRes] = await Promise.all([
      supabase.from("curriculum_levels").select("id", { count: "exact" }),
      supabase.from("curriculum_modules").select("id", { count: "exact" }),
      supabase.from("lessons").select("id, video_url"),
    ]);

    const lessonsWithVideos = (lessonsRes.data || []).filter(l => l.video_url).length;

    return {
      totalLevels: levelsRes.count || 0,
      totalModules: modulesRes.count || 0,
      totalLessons: lessonsRes.data?.length || 0,
      lessonsWithVideos,
    };
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchLevels();
      setLoading(false);
    };
    load();
  }, [fetchLevels]);

  useEffect(() => {
    if (selectedLevelId) {
      fetchModules(selectedLevelId);
      setSelectedModuleId(null);
      setLessons([]);
    }
  }, [selectedLevelId, fetchModules]);

  useEffect(() => {
    if (selectedModuleId) {
      fetchLessons(selectedModuleId);
    }
  }, [selectedModuleId, fetchLessons]);

  // Level CRUD
  const createLevel = async (data: Partial<AdminLevel>) => {
    const maxSort = levels.reduce((max, l) => Math.max(max, l.sort_order), 0);
    const maxLevelNum = levels.reduce((max, l) => Math.max(max, l.level_number), 0);
    
    const { error } = await supabase.from("curriculum_levels").insert({
      title: data.title!,
      slug: data.slug!,
      description: data.description,
      icon: data.icon || "book",
      is_locked: data.is_locked || false,
      required_tiers: data.required_tiers || [],
      sort_order: maxSort + 1,
      level_number: maxLevelNum + 1,
    });

    if (error) {
      toast({ title: "Error creating level", variant: "destructive" });
      return false;
    }

    toast({ title: "Level created successfully" });
    await fetchLevels();
    return true;
  };

  const updateLevel = async (id: string, data: Partial<AdminLevel>) => {
    const { error } = await supabase
      .from("curriculum_levels")
      .update(data)
      .eq("id", id);

    if (error) {
      toast({ title: "Error updating level", variant: "destructive" });
      return false;
    }

    toast({ title: "Level updated successfully" });
    await fetchLevels();
    return true;
  };

  const deleteLevel = async (id: string) => {
    const { error } = await supabase
      .from("curriculum_levels")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error deleting level. Make sure it has no modules.", variant: "destructive" });
      return false;
    }

    toast({ title: "Level deleted successfully" });
    await fetchLevels();
    if (selectedLevelId === id) {
      setSelectedLevelId(null);
      setModules([]);
    }
    return true;
  };

  // Module CRUD
  const createModule = async (data: Partial<AdminModule>) => {
    if (!selectedLevelId) return false;

    const maxSort = modules.reduce((max, m) => Math.max(max, m.sort_order), 0);
    
    const { error } = await supabase.from("curriculum_modules").insert({
      level_id: selectedLevelId,
      title: data.title!,
      slug: data.slug!,
      description: data.description,
      sort_order: maxSort + 1,
    });

    if (error) {
      toast({ title: "Error creating module", variant: "destructive" });
      return false;
    }

    toast({ title: "Module created successfully" });
    await fetchModules(selectedLevelId);
    return true;
  };

  const updateModule = async (id: string, data: Partial<AdminModule>) => {
    const { error } = await supabase
      .from("curriculum_modules")
      .update(data)
      .eq("id", id);

    if (error) {
      toast({ title: "Error updating module", variant: "destructive" });
      return false;
    }

    toast({ title: "Module updated successfully" });
    if (selectedLevelId) await fetchModules(selectedLevelId);
    return true;
  };

  const deleteModule = async (id: string) => {
    const { error } = await supabase
      .from("curriculum_modules")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error deleting module. Make sure it has no lessons.", variant: "destructive" });
      return false;
    }

    toast({ title: "Module deleted successfully" });
    if (selectedLevelId) await fetchModules(selectedLevelId);
    if (selectedModuleId === id) {
      setSelectedModuleId(null);
      setLessons([]);
    }
    return true;
  };

  // Lesson CRUD
  const createLesson = async (data: Partial<AdminLesson>) => {
    if (!selectedModuleId) return false;

    const maxSort = lessons.reduce((max, l) => Math.max(max, l.sort_order), 0);
    
    const { error } = await supabase.from("lessons").insert({
      module_id: selectedModuleId,
      title: data.title!,
      description: data.description,
      video_url: data.video_url,
      video_duration_seconds: data.video_duration_seconds,
      worksheet_url: data.worksheet_url,
      thumbnail_url: data.thumbnail_url,
      is_preview: data.is_preview || false,
      sort_order: maxSort + 1,
    });

    if (error) {
      toast({ title: "Error creating lesson", variant: "destructive" });
      return false;
    }

    toast({ title: "Lesson created successfully" });
    await fetchLessons(selectedModuleId);
    return true;
  };

  const updateLesson = async (id: string, data: Partial<AdminLesson>) => {
    const { error } = await supabase
      .from("lessons")
      .update(data)
      .eq("id", id);

    if (error) {
      toast({ title: "Error updating lesson", variant: "destructive" });
      return false;
    }

    toast({ title: "Lesson updated successfully" });
    if (selectedModuleId) await fetchLessons(selectedModuleId);
    return true;
  };

  const deleteLesson = async (id: string) => {
    const { error } = await supabase
      .from("lessons")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error deleting lesson", variant: "destructive" });
      return false;
    }

    toast({ title: "Lesson deleted successfully" });
    if (selectedModuleId) await fetchLessons(selectedModuleId);
    return true;
  };

  // Video upload
  const uploadVideo = async (file: File, lessonId: string): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${lessonId}-${Date.now()}.${fileExt}`;
    const filePath = `lessons/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("academy-videos")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({ title: "Error uploading video", variant: "destructive" });
      return null;
    }

    const { data } = supabase.storage
      .from("academy-videos")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const uploadThumbnail = async (file: File, lessonId: string): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `thumb-${lessonId}-${Date.now()}.${fileExt}`;
    const filePath = `thumbnails/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("academy-videos")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({ title: "Error uploading thumbnail", variant: "destructive" });
      return null;
    }

    const { data } = supabase.storage
      .from("academy-videos")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  return {
    // State
    levels,
    modules,
    lessons,
    loading,
    selectedLevelId,
    selectedModuleId,
    
    // Selection
    setSelectedLevelId,
    setSelectedModuleId,
    
    // Stats
    fetchStats,
    
    // Level CRUD
    createLevel,
    updateLevel,
    deleteLevel,
    
    // Module CRUD
    createModule,
    updateModule,
    deleteModule,
    
    // Lesson CRUD
    createLesson,
    updateLesson,
    deleteLesson,
    
    // Uploads
    uploadVideo,
    uploadThumbnail,
    
    // Refresh
    refetch: fetchLevels,
  };
}
