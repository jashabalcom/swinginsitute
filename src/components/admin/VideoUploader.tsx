import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, Video, CheckCircle } from "lucide-react";

interface VideoUploaderProps {
  currentUrl?: string | null;
  onUpload: (file: File) => Promise<string | null>;
  onUrlChange: (url: string | null) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
}

export function VideoUploader({
  currentUrl,
  onUpload,
  onUrlChange,
  accept = "video/mp4,video/webm,video/quicktime",
  maxSizeMB = 500,
  label = "Video",
}: VideoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File too large. Maximum size is ${maxSizeMB}MB.`);
      return;
    }

    setUploading(true);
    setProgress(0);

    // Simulate progress since Supabase doesn't provide upload progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90));
    }, 200);

    const url = await onUpload(file);

    clearInterval(progressInterval);
    setProgress(100);

    if (url) {
      onUrlChange(url);
    }

    setTimeout(() => {
      setUploading(false);
      setProgress(0);
    }, 500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    onUrlChange(null);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      
      {currentUrl ? (
        <div className="relative rounded-lg border bg-muted/50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Video className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Video uploaded</span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{currentUrl}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <video
            src={currentUrl}
            controls
            className="mt-3 w-full rounded-lg max-h-48 object-contain bg-black"
          />
        </div>
      ) : (
        <div
          className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          {uploading ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground animate-pulse" />
              </div>
              <p className="text-sm text-muted-foreground">Uploading...</p>
              <Progress value={progress} className="h-2" />
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Drag and drop your video here, or{" "}
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="text-primary hover:underline"
                >
                  browse
                </button>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                MP4, WebM, MOV up to {maxSizeMB}MB
              </p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
