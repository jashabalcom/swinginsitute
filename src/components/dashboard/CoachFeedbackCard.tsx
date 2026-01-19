import { motion } from "framer-motion";
import { MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { format, addDays, startOfWeek, endOfWeek, addWeeks } from "date-fns";

interface VideoSubmission {
  id: string;
  title: string;
  status: string;
  submitted_at: string;
  reviewed_at: string | null;
  coach_feedback: string | null;
}

interface CoachFeedbackCardProps {
  submissions: VideoSubmission[];
  feedbackFrequency: string;
}

export function CoachFeedbackCard({
  submissions,
  feedbackFrequency,
}: CoachFeedbackCardProps) {
  // Get the most recent reviewed submission
  const reviewedSubmissions = submissions
    .filter((s) => s.status === "reviewed" && s.reviewed_at)
    .sort(
      (a, b) =>
        new Date(b.reviewed_at!).getTime() - new Date(a.reviewed_at!).getTime()
    );

  const lastReviewed = reviewedSubmissions[0];
  const pendingSubmissions = submissions.filter((s) => s.status === "pending");
  const hasPending = pendingSubmissions.length > 0;

  // Calculate next review window based on feedback frequency
  const calculateNextWindow = () => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 0 }); // Sunday

    if (feedbackFrequency === "bi-weekly") {
      // Bi-weekly: every other week
      const nextWeekStart = addWeeks(weekStart, 1);
      const windowStart = nextWeekStart;
      const windowEnd = addDays(windowStart, 3); // Sun-Wed
      return { start: windowStart, end: windowEnd };
    }

    // Weekly: this week or next week
    const windowStart = weekStart;
    const windowEnd = addDays(windowStart, 3); // Sun-Wed

    // If we're past Wednesday, show next week
    if (now > windowEnd) {
      const nextWeekStart = addWeeks(weekStart, 1);
      return { start: nextWeekStart, end: addDays(nextWeekStart, 3) };
    }

    return { start: windowStart, end: windowEnd };
  };

  const nextWindow = calculateNextWindow();

  // Determine status
  type StatusType = "awaiting" | "reviewed" | "no_submissions";
  let status: StatusType = "no_submissions";
  let statusLabel = "No Submissions";
  let StatusIcon = AlertCircle;
  let statusColor = "text-muted-foreground";

  if (hasPending) {
    status = "awaiting";
    statusLabel = "Awaiting Review";
    StatusIcon = Clock;
    statusColor = "text-amber-400";
  } else if (reviewedSubmissions.length > 0) {
    status = "reviewed";
    statusLabel = "All Reviewed";
    StatusIcon = CheckCircle;
    statusColor = "text-accent";
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card-accent-blue p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-secondary" />
        <h2 className="font-display text-xl font-bold text-foreground">
          Coach Feedback Status
        </h2>
      </div>

      <div className="space-y-4">
        {/* Last Review & Next Window */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Last Review</p>
            <p className="text-foreground font-medium">
              {lastReviewed?.reviewed_at
                ? format(new Date(lastReviewed.reviewed_at), "MMM d, yyyy")
                : "No reviews yet"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Next Window</p>
            <p className="text-foreground font-medium">
              {format(nextWindow.start, "MMM d")} -{" "}
              {format(nextWindow.end, "d, yyyy")}
            </p>
          </div>
        </div>

        {/* Coach Feedback Note */}
        {lastReviewed?.coach_feedback && (
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground mb-1">Latest Feedback</p>
            <p className="text-foreground text-sm italic">
              "{lastReviewed.coach_feedback.length > 150
                ? `${lastReviewed.coach_feedback.slice(0, 150)}...`
                : lastReviewed.coach_feedback}"
            </p>
          </div>
        )}

        {/* Status Badge */}
        <div className="flex items-center gap-2 pt-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          <div className={`flex items-center gap-1.5 ${statusColor}`}>
            <StatusIcon className="w-4 h-4" />
            <span className="text-sm font-medium">{statusLabel}</span>
          </div>
          {hasPending && (
            <span className="text-xs text-muted-foreground ml-2">
              ({pendingSubmissions.length} pending)
            </span>
          )}
        </div>
      </div>
    </motion.section>
  );
}
