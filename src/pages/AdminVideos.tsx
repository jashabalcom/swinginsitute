import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Video,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Calendar,
  Play,
  MessageSquare,
  Filter,
  RefreshCw,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface VideoSubmission {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  phase: string;
  week: number;
  status: string;
  coach_feedback: string | null;
  is_phase_transition: boolean | null;
  approved_for_advancement: boolean | null;
  submitted_at: string;
  reviewed_at: string | null;
  profile?: {
    full_name: string | null;
    player_name: string | null;
  };
}

export default function AdminVideos() {
  const [submissions, setSubmissions] = useState<VideoSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<VideoSubmission | null>(null);
  const [feedback, setFeedback] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [submitting, setSubmitting] = useState(false);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("video_submissions")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Fetch profiles for each submission
      const userIds = [...new Set(data?.map((s) => s.user_id) || [])];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, player_name")
        .in("user_id", userIds);

      const profileMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);

      const submissionsWithProfiles = data?.map((s) => ({
        ...s,
        profile: profileMap.get(s.user_id),
      })) || [];

      setSubmissions(submissionsWithProfiles);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter]);

  const handleReview = async (approved: boolean) => {
    if (!selectedSubmission) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("video_submissions")
        .update({
          status: approved ? "approved" : "rejected",
          coach_feedback: feedback || null,
          reviewed_at: new Date().toISOString(),
          approved_for_advancement: selectedSubmission.is_phase_transition ? approved : null,
        })
        .eq("id", selectedSubmission.id);

      if (error) throw error;

      // If approved for phase transition, update user's current phase
      if (approved && selectedSubmission.is_phase_transition) {
        // Get next phase based on current phase
        const phaseOrder = [
          "Phase 1: Foundation",
          "Phase 2: Load & Timing",
          "Phase 3: Launch & Extension",
          "Phase 4: Contact & Adjustment",
          "Phase 5: Game Integration",
        ];
        const currentIndex = phaseOrder.indexOf(selectedSubmission.phase);
        if (currentIndex < phaseOrder.length - 1) {
          await supabase
            .from("profiles")
            .update({
              current_phase: phaseOrder[currentIndex + 1],
              current_week: 1,
            })
            .eq("user_id", selectedSubmission.user_id);
        }
      }

      toast.success(approved ? "Video approved!" : "Video review submitted");
      setSelectedSubmission(null);
      setFeedback("");
      fetchSubmissions();
    } catch (error) {
      console.error("Error reviewing submission:", error);
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "approved":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPlayerName = (submission: VideoSubmission) => {
    return (
      submission.profile?.player_name ||
      submission.profile?.full_name ||
      "Unknown Player"
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-8 border-b border-border mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Video className="w-8 h-8 text-rose-500" />
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    Video Reviews
                  </h1>
                </div>
                <p className="text-muted-foreground">
                  Review member swing submissions and provide feedback
                </p>
              </div>
              <Link to="/admin">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Admin
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Submissions</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" size="sm" onClick={fetchSubmissions}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Submissions List */}
            <div className="space-y-4">
              <h2 className="font-display text-lg font-semibold text-foreground">
                Submissions ({submissions.length})
              </h2>

              {loading ? (
                <Card className="bg-card border-border">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    Loading submissions...
                  </CardContent>
                </Card>
              ) : submissions.length === 0 ? (
                <Card className="bg-card border-border">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    No {statusFilter === "all" ? "" : statusFilter} submissions found
                  </CardContent>
                </Card>
              ) : (
                submissions.map((submission) => (
                  <Card
                    key={submission.id}
                    className={`bg-card border-border cursor-pointer transition-all hover:border-primary/50 ${
                      selectedSubmission?.id === submission.id
                        ? "ring-2 ring-primary"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedSubmission(submission);
                      setFeedback(submission.coach_feedback || "");
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground truncate">
                              {submission.title}
                            </h3>
                            {submission.is_phase_transition && (
                              <Badge variant="outline" className="text-xs border-primary text-primary">
                                Phase Transition
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {getPlayerName(submission)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(submission.submitted_at), "MMM d")}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {submission.phase} • Week {submission.week}
                          </p>
                        </div>
                        <Badge className={getStatusColor(submission.status)}>
                          {submission.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Review Panel */}
            <div className="lg:sticky lg:top-24">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                Review Panel
              </h2>

              {selectedSubmission ? (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Play className="w-5 h-5 text-primary" />
                      {selectedSubmission.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Video Player */}
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <video
                        src={selectedSubmission.video_url}
                        controls
                        className="w-full h-full object-contain"
                        poster={selectedSubmission.thumbnail_url || undefined}
                      />
                    </div>

                    {/* Submission Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Player:</span>
                        <p className="font-medium text-foreground">
                          {getPlayerName(selectedSubmission)}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Phase:</span>
                        <p className="font-medium text-foreground">
                          {selectedSubmission.phase}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Week:</span>
                        <p className="font-medium text-foreground">
                          Week {selectedSubmission.week}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Submitted:</span>
                        <p className="font-medium text-foreground">
                          {format(new Date(selectedSubmission.submitted_at), "MMM d, h:mm a")}
                        </p>
                      </div>
                    </div>

                    {selectedSubmission.description && (
                      <div>
                        <span className="text-sm text-muted-foreground">Player Notes:</span>
                        <p className="text-sm text-foreground mt-1">
                          {selectedSubmission.description}
                        </p>
                      </div>
                    )}

                    {selectedSubmission.is_phase_transition && (
                      <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                        <p className="text-sm font-medium text-primary">
                          ⚡ Phase Transition Request
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Approving this will advance the player to the next phase.
                        </p>
                      </div>
                    )}

                    {/* Feedback */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                        <MessageSquare className="w-4 h-4" />
                        Coach Feedback
                      </label>
                      <Textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Provide feedback on the swing mechanics, areas of improvement, and next steps..."
                        rows={4}
                        disabled={selectedSubmission.status !== "pending"}
                      />
                    </div>

                    {/* Action Buttons */}
                    {selectedSubmission.status === "pending" ? (
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleReview(true)}
                          disabled={submitting}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          {selectedSubmission.is_phase_transition
                            ? "Approve & Advance"
                            : "Approve"}
                        </Button>
                        <Button
                          onClick={() => handleReview(false)}
                          disabled={submitting}
                          variant="destructive"
                          className="flex-1"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Request Revision
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center text-sm text-muted-foreground">
                        Reviewed on{" "}
                        {selectedSubmission.reviewed_at
                          ? format(new Date(selectedSubmission.reviewed_at), "MMM d, yyyy")
                          : "N/A"}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-card border-border">
                  <CardContent className="p-8 text-center">
                    <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Select a submission to review
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}