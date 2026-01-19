import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Video,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Circle,
  MessageSquare,
  Crown,
  CreditCard,
  LogOut,
  User,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";

const weeklyTasks = [
  { id: 1, title: "Submit swing video for review", completed: false, priority: true },
  { id: 2, title: "Complete Drill A: Load Sequence", completed: true },
  { id: 3, title: "Complete Drill B: Hip Rotation", completed: false },
  { id: 4, title: "Watch coaching video: The Power Position", completed: true },
  { id: 5, title: "Optional: Mindset rep - Visualization", completed: false },
];

const tierBadgeColors: Record<string, string> = {
  starter: "tier-starter",
  pro: "tier-pro",
  elite: "tier-elite",
  hybrid: "tier-hybrid",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, signOut, isOnboardingComplete, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && !isOnboardingComplete) {
      navigate("/onboarding");
    }
  }, [loading, isOnboardingComplete, navigate]);

  const completedTasks = weeklyTasks.filter(t => t.completed).length;
  const progressPercent = (completedTasks / weeklyTasks.length) * 100;

  const memberName = profile?.player_name || profile?.full_name || user?.email?.split('@')[0] || "Member";
  const tier = profile?.membership_tier || "starter";
  const creditsRemaining = profile?.credits_remaining || 0;
  const lessonRate = profile?.lesson_rate || 145;
  const currentPhase = profile?.current_phase || "Phase 1: Foundation";
  const currentWeek = profile?.current_week || 1;

  if (loading || !isOnboardingComplete) {
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
                <div className="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center">
                  <User className="w-7 h-7 text-muted-foreground" />
                </div>
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
                <Button className="bg-primary hover:bg-primary/90">
                  <Video className="w-4 h-4 mr-2" />
                  Submit Swing
                </Button>
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
              {/* Current Training Focus */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card-accent-red p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
                      Current Training Focus
                    </p>
                    <h2 className="font-display text-2xl font-bold text-foreground">
                      {currentPhase}
                    </h2>
                    <p className="text-muted-foreground">Week {currentWeek} of 3</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                  <p className="text-foreground font-medium">
                    This is your <span className="text-primary">ONLY</span> focus right now.
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Master this phase before moving to the next. Trust the process.
                  </p>
                </div>
              </motion.section>

              {/* Weekly Action Plan */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card-premium p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-bold text-foreground">
                    This Week's Action Plan
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {completedTasks}/{weeklyTasks.length} completed
                  </span>
                </div>

                <Progress 
                  value={progressPercent} 
                  className="h-2 mb-6" 
                />

                <ul className="space-y-3">
                  {weeklyTasks.map((task) => (
                    <li 
                      key={task.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        task.completed 
                          ? 'bg-accent/10 border-accent/20' 
                          : task.priority 
                            ? 'bg-primary/5 border-primary/20'
                            : 'bg-card border-border/50'
                      }`}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                      ) : (
                        <Circle className={`w-5 h-5 flex-shrink-0 ${task.priority ? 'text-primary' : 'text-muted-foreground'}`} />
                      )}
                      <span className={`${task.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                        {task.title}
                      </span>
                      {task.priority && !task.completed && (
                        <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                          Priority
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.section>

              {/* Coach Feedback Status */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card-accent-blue p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-display text-xl font-bold text-foreground mb-4">
                      Coach Feedback Status
                    </h2>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">
                        <span className="text-foreground font-medium">Last Review:</span> January 15, 2026
                      </p>
                      <p className="text-muted-foreground">
                        <span className="text-foreground font-medium">Next Review Window:</span> January 20-22
                      </p>
                    </div>
                    <div className="mt-4 p-3 bg-background/50 rounded-lg border border-border/50">
                      <p className="text-sm text-foreground">
                        <span className="text-secondary font-medium">Focus Note:</span> "Work on keeping your back elbow slot consistent through the load. Great progress on hip rotation."
                      </p>
                    </div>
                  </div>
                  <MessageSquare className="w-8 h-8 text-secondary" />
                </div>
              </motion.section>
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
