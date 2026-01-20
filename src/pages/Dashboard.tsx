import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  MessageSquare,
  Crown,
  CreditCard,
  LogOut,
  Settings,
  Video,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useProgressTracking } from "@/hooks/useProgressTracking";
import { useCurriculum } from "@/hooks/useCurriculum";
import { useAdminSchedule } from "@/hooks/useAdminSchedule";
import { TrainingHeroSection } from "@/components/dashboard/TrainingHeroSection";
import { WeeklyTrainingCard } from "@/components/dashboard/WeeklyTrainingCard";
import { TrainingProgressHub } from "@/components/dashboard/TrainingProgressHub";
import { VideoSubmissionCard } from "@/components/dashboard/VideoSubmissionCard";
import { OnFormCard } from "@/components/dashboard/OnFormCard";
import { CoachFeedbackCard } from "@/components/dashboard/CoachFeedbackCard";
import { NotificationBell } from "@/components/community/NotificationBell";
import { MemberNavigation } from "@/components/dashboard/MemberNavigation";
import { ContinueWatchingWidget } from "@/components/dashboard/ContinueWatchingWidget";

const tierBadgeColors: Record<string, string> = {
  starter: "tier-starter",
  pro: "tier-pro",
  elite: "tier-elite",
  hybrid: "tier-hybrid",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, signOut, isOnboardingComplete, loading, profileLoading, isFreeTier } = useAuth();
  const {
    drills,
    completions,
    submissions,
    phaseProgress,
    phaseAcademyLinks,
    loading: progressLoading,
    currentPhase,
    currentWeek,
    isDrillCompleted,
    toggleDrillCompletion,
    getWeeklyProgress,
    canAdvance,
    getAdvancementStatus,
    advanceProgress,
    submitVideo,
    getCurrentPhaseAcademyLinks,
    PHASES,
    PHASE_INFO,
    WEEKS_PER_PHASE,
  } = useProgressTracking();
  const { isAdmin } = useAdminSchedule();

  const advancementStatus = getAdvancementStatus();
  const currentPhaseAcademyLinks = getCurrentPhaseAcademyLinks();

  const { getLastWatchedLesson, getLessonProgress, getTotalProgress } = useCurriculum();
  const lastWatchedLesson = getLastWatchedLesson();
  const lastWatchedProgress = lastWatchedLesson ? getLessonProgress(lastWatchedLesson.id) : 0;
  const academyProgress = getTotalProgress();

  useEffect(() => {
    if (!loading && !profileLoading && profile !== null && !profile.onboarding_completed) {
      navigate("/onboarding");
    }
  }, [loading, profileLoading, profile, navigate]);

  const memberName = profile?.player_name || profile?.full_name || user?.email?.split('@')[0] || "Member";
  const tier = profile?.membership_tier || "starter";
  const creditsRemaining = profile?.credits_remaining || 0;
  const lessonRate = profile?.lesson_rate || 145;

  const scrollToVideoSubmission = () => {
    const videoCard = document.querySelector('[data-video-submission]');
    videoCard?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading || progressLoading || !isOnboardingComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Free Tier Upgrade Banner */}
          {isFreeTier && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-secondary/10 via-primary/5 to-secondary/10 border border-secondary/20 rounded-xl p-4 mb-6"
            >
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/20 rounded-lg">
                    <Crown className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">You're on the Free Plan</p>
                    <p className="text-sm text-muted-foreground">Upgrade to unlock full community access, coaching feedback, and exclusive content.</p>
                  </div>
                </div>
                <Link to="/upgrade">
                  <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}

          {/* Compact Header Row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
          >
            <div className="flex items-center gap-4">
              <Link to="/settings" className="flex-shrink-0">
                <Avatar className="w-10 h-10 border-2 border-border hover:border-primary transition-colors cursor-pointer">
                  <AvatarImage src={profile?.avatar_url || undefined} alt={memberName} />
                  <AvatarFallback className="bg-muted text-muted-foreground font-display font-bold text-sm">
                    {memberName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-xl md:text-2xl font-bold text-foreground">
                    Welcome, {memberName}
                  </h1>
                  <span className={`tier-badge ${tierBadgeColors[tier]} text-xs`}>
                    {tier.toUpperCase()}
                  </span>
                </div>
                {tier === "hybrid" && creditsRemaining > 0 && (
                  <p className="text-xs text-muted-foreground">
                    <CreditCard className="w-3 h-3 inline mr-1" />
                    {creditsRemaining} credit{creditsRemaining !== 1 ? 's' : ''} remaining
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Link to="/book">
                <Button variant="outline" size="sm" className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  Book
                </Button>
              </Link>
              <Link to="/training-room">
                <Button variant="outline" size="sm" className="border-muted-foreground/30 text-muted-foreground hover:bg-muted">
                  <MessageSquare className="w-4 h-4 mr-1.5" />
                  Community
                </Button>
              </Link>
              <NotificationBell />
              <Link to="/settings">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground hover:text-foreground">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>

          {/* Member Navigation */}
          <MemberNavigation />

          {/* Training Hero Section */}
          <div className="mb-6">
            <TrainingHeroSection
              currentPhase={currentPhase}
              currentWeek={currentWeek}
              phaseInfo={PHASE_INFO}
              weeksPerPhase={WEEKS_PER_PHASE}
              phases={PHASES}
              academyLinks={currentPhaseAcademyLinks}
              onSubmitSwing={scrollToVideoSubmission}
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* OnForm - Primary Video Tool */}
              <OnFormCard />

              {/* Weekly Training */}
              <WeeklyTrainingCard
                drills={drills}
                isDrillCompleted={isDrillCompleted}
                onToggleDrill={toggleDrillCompletion}
                progressPercent={getWeeklyProgress()}
                canAdvance={canAdvance()}
                onAdvance={advanceProgress}
                currentWeek={currentWeek}
                weeksPerPhase={WEEKS_PER_PHASE}
                advancementStatus={advancementStatus}
                academyLinks={currentPhaseAcademyLinks}
                onSubmitPhaseVideo={scrollToVideoSubmission}
                isAdminView={isAdmin}
              />

              {/* Coach Feedback Status */}
              <CoachFeedbackCard
                submissions={submissions}
                feedbackFrequency={profile?.feedback_frequency || "weekly"}
              />

              {/* Video Submissions - Alternative Option */}
              <VideoSubmissionCard
                submissions={submissions}
                onSubmit={submitVideo}
                isAlternative
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Training Progress Hub */}
              <TrainingProgressHub
                currentPhase={currentPhase}
                currentWeek={currentWeek}
                phaseProgress={phaseProgress}
                phases={PHASES}
                weeksPerPhase={WEEKS_PER_PHASE}
                phaseInfo={PHASE_INFO}
                academyProgress={academyProgress}
                drillsCompleted={completions.length}
                isAdminView={isAdmin}
              />

              {/* Your Benefits */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card-premium p-6"
              >
                <h2 className="font-display text-lg font-bold text-foreground mb-4">
                  Your Benefits
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Membership</span>
                    <span className={`tier-badge ${tierBadgeColors[tier]} text-xs`}>
                      {tier.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Lesson Rate</span>
                    <span className="text-foreground font-semibold">${lessonRate}/hr</span>
                  </div>
                  {tier === "hybrid" && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Credits</span>
                      <span className="text-foreground font-semibold">{creditsRemaining} remaining</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Feedback</span>
                    <span className="text-foreground font-semibold capitalize">
                      {profile?.feedback_frequency || "Weekly"}
                    </span>
                  </div>
                </div>

                {tier !== "elite" && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <Link to="/train-online">
                      <Button size="sm" className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white">
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                )}
              </motion.section>

              {/* Training Room Quick Access */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="card-premium p-6"
              >
                <h2 className="font-display text-lg font-bold text-foreground mb-3">
                  Training Room
                </h2>
                <p className="text-xs text-muted-foreground mb-4">
                  Connect with other players and get answers.
                </p>
                <ul className="space-y-1">
                  {["Announcements", "Weekly Focus", "Player Wins", "Q&A with Coach"].map((channel) => (
                    <li key={channel}>
                      <Link to="/training-room">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-card py-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-2" />
                          {channel}
                        </Button>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link to="/training-room" className="block mt-3">
                  <Button size="sm" className="w-full bg-secondary hover:bg-secondary/90">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Enter Training Room
                  </Button>
                </Link>
              </motion.section>
            </div>
          </div>
        </div>
      </main>

      {/* Continue Watching Widget */}
      <ContinueWatchingWidget 
        lesson={lastWatchedLesson} 
        progress={lastWatchedProgress} 
      />
    </div>
  );
}
