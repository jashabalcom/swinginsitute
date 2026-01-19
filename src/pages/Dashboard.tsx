import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  MessageSquare,
  Crown,
  CreditCard,
  LogOut,
  User,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useProgressTracking } from "@/hooks/useProgressTracking";
import { PhaseProgressCard } from "@/components/dashboard/PhaseProgressCard";
import { WeeklyDrillsCard } from "@/components/dashboard/WeeklyDrillsCard";
import { VideoSubmissionCard } from "@/components/dashboard/VideoSubmissionCard";

const tierBadgeColors: Record<string, string> = {
  starter: "tier-starter",
  pro: "tier-pro",
  elite: "tier-elite",
  hybrid: "tier-hybrid",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, signOut, isOnboardingComplete, loading } = useAuth();
  const {
    drills,
    submissions,
    phaseProgress,
    loading: progressLoading,
    currentPhase,
    currentWeek,
    isDrillCompleted,
    toggleDrillCompletion,
    getWeeklyProgress,
    canAdvance,
    advanceProgress,
    submitVideo,
    PHASES,
    WEEKS_PER_PHASE,
  } = useProgressTracking();

  useEffect(() => {
    if (!loading && !isOnboardingComplete) {
      navigate("/onboarding");
    }
  }, [loading, isOnboardingComplete, navigate]);

  const memberName = profile?.player_name || profile?.full_name || user?.email?.split('@')[0] || "Member";
  const tier = profile?.membership_tier || "starter";
  const creditsRemaining = profile?.credits_remaining || 0;
  const lessonRate = profile?.lesson_rate || 145;

  if (loading || progressLoading || !isOnboardingComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Dashboard Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-8 border-b border-border mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Link to="/">
                  <img 
                    src="https://assets.cdn.filesafe.space/zwZcjJjCjMcDGRS6V7qs/media/683fafe628def090f992833c.png"
                    alt="Swing Institute"
                    className="h-12 w-auto object-contain"
                  />
                </Link>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                      Welcome, {memberName}
                    </h1>
                    <span className={`tier-badge ${tierBadgeColors[tier]}`}>
                      {tier.toUpperCase()}
                    </span>
                  </div>
                  {tier === "hybrid" && creditsRemaining > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      <CreditCard className="w-4 h-4 inline mr-1" />
                      {creditsRemaining} credit{creditsRemaining !== 1 ? 's' : ''} remaining this month
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Link to="/training-room">
                  <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Training Room
                  </Button>
                </Link>
                <Link to="/train-atlanta">
                  <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Session
                  </Button>
                </Link>
                <Button variant="ghost" onClick={signOut} className="text-muted-foreground hover:text-foreground">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Phase Progress */}
              <PhaseProgressCard
                currentPhase={currentPhase}
                currentWeek={currentWeek}
                phaseProgress={phaseProgress}
                phases={PHASES}
                weeksPerPhase={WEEKS_PER_PHASE}
              />

              {/* Weekly Drills */}
              <WeeklyDrillsCard
                drills={drills}
                isDrillCompleted={isDrillCompleted}
                onToggleDrill={toggleDrillCompletion}
                progressPercent={getWeeklyProgress()}
                canAdvance={canAdvance()}
                onAdvance={advanceProgress}
                currentWeek={currentWeek}
                weeksPerPhase={WEEKS_PER_PHASE}
              />

              {/* Video Submissions */}
              <VideoSubmissionCard
                submissions={submissions}
                onSubmit={submitVideo}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Your Benefits */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card-premium p-6"
              >
                <h2 className="font-display text-xl font-bold text-foreground mb-4">
                  Your Benefits
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Membership</span>
                    <span className={`tier-badge ${tierBadgeColors[tier]}`}>
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
                  <div className="mt-6 pt-6 border-t border-border">
                    <Link to="/train-online">
                      <Button className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white">
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade for More Access
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
                <h2 className="font-display text-xl font-bold text-foreground mb-4">
                  Training Room
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect with other players and get answers.
                </p>
                <ul className="space-y-2">
                  {["Announcements", "Weekly Focus", "Player Wins", "Q&A with Coach", "Parents Room"].map((channel) => (
                    <li key={channel}>
                      <Link to="/training-room">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-card"
                        >
                          <span className="w-2 h-2 rounded-full bg-secondary mr-3" />
                          {channel}
                        </Button>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link to="/training-room" className="block mt-4">
                  <Button className="w-full bg-secondary hover:bg-secondary/90">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Enter Training Room
                  </Button>
                </Link>
              </motion.section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}