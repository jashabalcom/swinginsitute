import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Upload,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface VideoSubmission {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  status: "pending" | "reviewed" | "needs_work";
  coach_feedback: string | null;
  phase: string;
  week: number;
  submitted_at: string;
}

interface VideoSubmissionCardProps {
  submissions: VideoSubmission[];
  onSubmit: (file: File, title: string, description?: string) => Promise<unknown>;
  isSubmitting?: boolean;
}

const statusConfig = {
  pending: {
    icon: Clock,
    label: "Pending Review",
    className: "bg-amber-500/20 text-amber-400",
  },
  reviewed: {
    icon: CheckCircle,
    label: "Reviewed",
    className: "bg-accent/20 text-accent",
  },
  needs_work: {
    icon: AlertCircle,
    label: "Needs Work",
    className: "bg-primary/20 text-primary",
  },
};

export function VideoSubmissionCard({
  submissions,
  onSubmit,
}: VideoSubmissionCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoSubmission | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-generate title from filename
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !title.trim()) return;

    setUploading(true);
    try {
      await onSubmit(selectedFile, title.trim(), description.trim() || undefined);
      setIsOpen(false);
      setSelectedFile(null);
      setTitle("");
      setDescription("");
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const recentSubmissions = submissions.slice(0, 5);

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-accent-blue p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-foreground">
            Swing Videos
          </h2>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Upload className="w-4 h-4 mr-2" />
                Submit Video
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">
                  Submit Swing for Review
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div
                  className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <Video className="w-8 h-8 text-primary" />
                      <div className="text-left">
                        <p className="text-foreground font-medium">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Video className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">
                        Click to select a video file
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        MP4, MOV, or WebM up to 100MB
                      </p>
                    </>
                  )}
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Title
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Front Toss Session - Jan 19"
                    className="bg-muted border-border"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Notes for Coach (optional)
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What should Coach focus on? Any specific concerns?"
                    className="bg-muted border-border resize-none"
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={!selectedFile || !title.trim() || uploading}
                >
                  {uploading ? "Uploading..." : "Submit for Review"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {recentSubmissions.length === 0 ? (
          <div className="text-center py-6">
            <Video className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">
              No videos submitted yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Submit your first swing video for coach review
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {recentSubmissions.map((submission) => {
              const status = statusConfig[submission.status];
              const StatusIcon = status.icon;

              return (
                <li
                  key={submission.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50 cursor-pointer hover:bg-background/80 transition-colors"
                  onClick={() => setSelectedVideo(submission)}
                >
                  <div className="w-10 h-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                    <Play className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-medium truncate">
                      {submission.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(submission.submitted_at)} · Week{" "}
                      {submission.week}
                    </p>
                  </div>
                  <span
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${status.className}`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        {submissions.length > 5 && (
          <Button
            variant="ghost"
            className="w-full mt-4 text-muted-foreground hover:text-foreground"
          >
            View All Submissions ({submissions.length})
          </Button>
        )}
      </motion.section>

      {/* Video Detail Dialog */}
      <AnimatePresence>
        {selectedVideo && (
          <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
            <DialogContent className="bg-card border-border max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">
                  {selectedVideo.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="aspect-video bg-background rounded-lg overflow-hidden">
                  <video
                    src={selectedVideo.video_url}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>
                    Submitted: {formatDate(selectedVideo.submitted_at)}
                  </span>
                  <span>·</span>
                  <span>{selectedVideo.phase}</span>
                  <span>·</span>
                  <span>Week {selectedVideo.week}</span>
                </div>

                {selectedVideo.description && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">
                      Your Notes:
                    </p>
                    <p className="text-foreground">{selectedVideo.description}</p>
                  </div>
                )}

                {selectedVideo.coach_feedback && (
                  <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                    <p className="text-sm text-accent mb-1 font-medium">
                      Coach Feedback:
                    </p>
                    <p className="text-foreground">
                      {selectedVideo.coach_feedback}
                    </p>
                  </div>
                )}

                {selectedVideo.status === "pending" && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <p className="text-amber-400 text-sm">
                      Coach Jasha will review this video within your feedback
                      window.
                    </p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}