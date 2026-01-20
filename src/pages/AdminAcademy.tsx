import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  GraduationCap,
  Plus,
  Pencil,
  Trash2,
  Video,
  BookOpen,
  Layers,
  Lock,
  Eye,
  ChevronRight,
} from "lucide-react";
import {
  useAdminAcademy,
  AdminLevel,
  AdminModule,
  AdminLesson,
  AcademyStats,
} from "@/hooks/useAdminAcademy";
import { LevelEditor } from "@/components/admin/LevelEditor";
import { ModuleEditor } from "@/components/admin/ModuleEditor";
import { LessonEditor } from "@/components/admin/LessonEditor";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminAcademy() {
  const {
    levels,
    modules,
    lessons,
    loading,
    selectedLevelId,
    selectedModuleId,
    setSelectedLevelId,
    setSelectedModuleId,
    fetchStats,
    createLevel,
    updateLevel,
    deleteLevel,
    createModule,
    updateModule,
    deleteModule,
    createLesson,
    updateLesson,
    deleteLesson,
    uploadVideo,
    uploadThumbnail,
  } = useAdminAcademy();

  const [stats, setStats] = useState<AcademyStats | null>(null);
  const [levelEditorOpen, setLevelEditorOpen] = useState(false);
  const [moduleEditorOpen, setModuleEditorOpen] = useState(false);
  const [lessonEditorOpen, setLessonEditorOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<AdminLevel | null>(null);
  const [editingModule, setEditingModule] = useState<AdminModule | null>(null);
  const [editingLesson, setEditingLesson] = useState<AdminLesson | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    type: "level" | "module" | "lesson";
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    fetchStats().then(setStats);
  }, [fetchStats]);

  const handleEditLevel = (level: AdminLevel) => {
    setEditingLevel(level);
    setLevelEditorOpen(true);
  };

  const handleEditModule = (module: AdminModule) => {
    setEditingModule(module);
    setModuleEditorOpen(true);
  };

  const handleEditLesson = (lesson: AdminLesson) => {
    setEditingLesson(lesson);
    setLessonEditorOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog) return;

    if (deleteDialog.type === "level") {
      await deleteLevel(deleteDialog.id);
    } else if (deleteDialog.type === "module") {
      await deleteModule(deleteDialog.id);
    } else if (deleteDialog.type === "lesson") {
      await deleteLesson(deleteDialog.id);
    }

    setDeleteDialog(null);
    fetchStats().then(setStats);
  };

  const handleSaveLevel = async (data: Partial<AdminLevel>) => {
    const result = editingLevel
      ? await updateLevel(editingLevel.id, data)
      : await createLevel(data);
    if (result) fetchStats().then(setStats);
    return result;
  };

  const handleSaveModule = async (data: Partial<AdminModule>) => {
    const result = editingModule
      ? await updateModule(editingModule.id, data)
      : await createModule(data);
    if (result) fetchStats().then(setStats);
    return result;
  };

  const handleSaveLesson = async (data: Partial<AdminLesson>) => {
    const result = editingLesson
      ? await updateLesson(editingLesson.id, data)
      : await createLesson(data);
    if (result) fetchStats().then(setStats);
    return result;
  };

  const videoProgress = stats
    ? Math.round((stats.lessonsWithVideos / Math.max(stats.totalLessons, 1)) * 100)
    : 0;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link to="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Academy Content</h1>
                <p className="text-sm text-muted-foreground">
                  Manage curriculum, modules, and lesson videos
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg border bg-background p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm">Levels</span>
                </div>
                <p className="mt-1 text-2xl font-bold">{stats.totalLevels}</p>
              </div>
              <div className="rounded-lg border bg-background p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Layers className="h-4 w-4" />
                  <span className="text-sm">Modules</span>
                </div>
                <p className="mt-1 text-2xl font-bold">{stats.totalModules}</p>
              </div>
              <div className="rounded-lg border bg-background p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Video className="h-4 w-4" />
                  <span className="text-sm">Lessons</span>
                </div>
                <p className="mt-1 text-2xl font-bold">{stats.totalLessons}</p>
              </div>
              <div className="rounded-lg border bg-background p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Video className="h-4 w-4" />
                  <span className="text-sm">Videos Uploaded</span>
                </div>
                <p className="mt-1 text-2xl font-bold">
                  {stats.lessonsWithVideos}/{stats.totalLessons}
                </p>
                <Progress value={videoProgress} className="mt-2 h-1.5" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Three-panel layout */}
      <div className="container mx-auto grid h-[calc(100vh-200px)] grid-cols-1 gap-4 p-4 md:grid-cols-3">
        {/* Levels Panel */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">Levels</CardTitle>
            <Button
              size="sm"
              onClick={() => {
                setEditingLevel(null);
                setLevelEditorOpen(true);
              }}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full">
              <div className="space-y-1 p-4 pt-0">
                {levels.map((level) => (
                  <div
                    key={level.id}
                    className={`group flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent ${
                      selectedLevelId === level.id ? "bg-accent border-primary" : ""
                    }`}
                    onClick={() => setSelectedLevelId(level.id)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary/10 text-sm font-bold text-primary">
                        {level.level_number}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{level.title}</p>
                        <div className="flex items-center gap-2">
                          {level.is_locked && (
                            <Lock className="h-3 w-3 text-muted-foreground" />
                          )}
                          {level.required_tiers?.length > 0 && (
                            <span className="text-xs text-muted-foreground">
                              {level.required_tiers.join(", ")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditLevel(level);
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteDialog({
                            type: "level",
                            id: level.id,
                            name: level.title,
                          });
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
                {levels.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    No levels yet. Create your first level!
                  </p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Modules Panel */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">Modules</CardTitle>
            <Button
              size="sm"
              disabled={!selectedLevelId}
              onClick={() => {
                setEditingModule(null);
                setModuleEditorOpen(true);
              }}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full">
              <div className="space-y-1 p-4 pt-0">
                {!selectedLevelId ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    Select a level to see modules
                  </p>
                ) : modules.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    No modules in this level. Create one!
                  </p>
                ) : (
                  modules.map((module) => (
                    <div
                      key={module.id}
                      className={`group flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent ${
                        selectedModuleId === module.id ? "bg-accent border-primary" : ""
                      }`}
                      onClick={() => setSelectedModuleId(module.id)}
                    >
                      <div className="min-w-0">
                        <p className="font-medium truncate">{module.title}</p>
                        {module.description && (
                          <p className="text-xs text-muted-foreground truncate">
                            {module.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditModule(module);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteDialog({
                              type: "module",
                              id: module.id,
                              name: module.title,
                            });
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Lessons Panel */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">Lessons</CardTitle>
            <Button
              size="sm"
              disabled={!selectedModuleId}
              onClick={() => {
                setEditingLesson(null);
                setLessonEditorOpen(true);
              }}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full">
              <div className="space-y-1 p-4 pt-0">
                {!selectedModuleId ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    Select a module to see lessons
                  </p>
                ) : lessons.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    No lessons in this module. Create one!
                  </p>
                ) : (
                  lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="group flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded ${
                            lesson.video_url
                              ? "bg-green-500/10 text-green-500"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Video className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">{lesson.title}</p>
                            {lesson.is_preview && (
                              <Badge variant="secondary" className="text-xs shrink-0">
                                <Eye className="mr-1 h-3 w-3" />
                                Preview
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {lesson.video_url ? "Video uploaded" : "No video"}
                            {lesson.video_duration_seconds &&
                              ` • ${Math.floor(lesson.video_duration_seconds / 60)}:${String(
                                lesson.video_duration_seconds % 60
                              ).padStart(2, "0")}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleEditLesson(lesson)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() =>
                            setDeleteDialog({
                              type: "lesson",
                              id: lesson.id,
                              name: lesson.title,
                            })
                          }
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <LevelEditor
        open={levelEditorOpen}
        onOpenChange={setLevelEditorOpen}
        level={editingLevel}
        onSave={handleSaveLevel}
      />

      <ModuleEditor
        open={moduleEditorOpen}
        onOpenChange={setModuleEditorOpen}
        module={editingModule}
        onSave={handleSaveModule}
      />

      <LessonEditor
        open={lessonEditorOpen}
        onOpenChange={setLessonEditorOpen}
        lesson={editingLesson}
        onSave={handleSaveLesson}
        onUploadVideo={uploadVideo}
        onUploadThumbnail={uploadThumbnail}
      />

      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteDialog?.type}?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDialog?.name}"? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
