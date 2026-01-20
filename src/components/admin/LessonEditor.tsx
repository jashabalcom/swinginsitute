import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { VideoUploader } from "./VideoUploader";
import { AdminLesson } from "@/hooks/useAdminAcademy";

interface LessonEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson?: AdminLesson | null;
  onSave: (data: Partial<AdminLesson>) => Promise<boolean>;
  onUploadVideo: (file: File, lessonId: string) => Promise<string | null>;
  onUploadThumbnail: (file: File, lessonId: string) => Promise<string | null>;
}

export function LessonEditor({
  open,
  onOpenChange,
  lesson,
  onSave,
  onUploadVideo,
  onUploadThumbnail,
}: LessonEditorProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [durationSeconds, setDurationSeconds] = useState<number | null>(null);
  const [worksheetUrl, setWorksheetUrl] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (lesson) {
      setTitle(lesson.title);
      setDescription(lesson.description || "");
      setVideoUrl(lesson.video_url);
      setThumbnailUrl(lesson.thumbnail_url);
      setDurationSeconds(lesson.video_duration_seconds);
      setWorksheetUrl(lesson.worksheet_url || "");
      setIsPreview(lesson.is_preview);
    } else {
      setTitle("");
      setDescription("");
      setVideoUrl(null);
      setThumbnailUrl(null);
      setDurationSeconds(null);
      setWorksheetUrl("");
      setIsPreview(false);
    }
  }, [lesson, open]);

  const handleVideoUpload = async (file: File) => {
    // Use a temporary ID for new lessons
    const id = lesson?.id || `temp-${Date.now()}`;
    return onUploadVideo(file, id);
  };

  const handleThumbnailUpload = async (file: File) => {
    const id = lesson?.id || `temp-${Date.now()}`;
    return onUploadThumbnail(file, id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const success = await onSave({
      title,
      description: description || null,
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl,
      video_duration_seconds: durationSeconds,
      worksheet_url: worksheetUrl || null,
      is_preview: isPreview,
    });

    setSaving(false);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{lesson ? "Edit Lesson" : "Create Lesson"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., The Power of Mental Imagery"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will students learn in this lesson?"
              rows={3}
            />
          </div>

          <VideoUploader
            currentUrl={videoUrl}
            onUpload={handleVideoUpload}
            onUrlChange={setVideoUrl}
            label="Lesson Video"
          />

          <VideoUploader
            currentUrl={thumbnailUrl}
            onUpload={handleThumbnailUpload}
            onUrlChange={setThumbnailUrl}
            accept="image/jpeg,image/png,image/webp"
            maxSizeMB={5}
            label="Thumbnail Image (optional)"
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (seconds)</Label>
              <Input
                id="duration"
                type="number"
                value={durationSeconds || ""}
                onChange={(e) =>
                  setDurationSeconds(e.target.value ? parseInt(e.target.value) : null)
                }
                placeholder="e.g., 300 for 5 mins"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="worksheet">Worksheet URL (optional)</Label>
              <Input
                id="worksheet"
                value={worksheetUrl}
                onChange={(e) => setWorksheetUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="preview" className="font-medium">
                Free Preview
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow non-members to watch this lesson
              </p>
            </div>
            <Switch
              id="preview"
              checked={isPreview}
              onCheckedChange={setIsPreview}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : lesson ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
