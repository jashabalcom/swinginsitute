import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GraduationCap, Trophy, ArrowRight, Play, BookOpen, Clock } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { LevelCard } from "@/components/academy/LevelCard";
import { AcademyComingSoon } from "@/components/academy/AcademyComingSoon";
import { useCurriculum } from "@/hooks/useCurriculum";
import { useEvents } from "@/hooks/useEvents";
import { format } from "date-fns";

// Toggle this to show/hide the Coming Soon state
// Set to true when you're ready to launch the Academy content
const ACADEMY_CONTENT_LIVE = false;

export default function Academy() {
  const { levels, loading, getLevelProgress, canAccessLevel, getTotalProgress, getLastWatchedLesson } = useCurriculum();
  const { getUpcomingEvents } = useEvents();

  const totalProgress = getTotalProgress();
  const upcomingEvents = getUpcomingEvents().slice(0, 3);
  const lastWatchedLesson = getLastWatchedLesson?.();

  // Calculate total stats
  const totalLessons = levels.reduce((acc, level) => 
    acc + (level.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0)
  , 0);
  
  const totalMinutes = levels.reduce((acc, level) => 
    acc + (level.modules?.reduce((sum, m) => 
      sum + (m.lessons?.reduce((lSum, l) => lSum + ((l.video_duration_seconds || 0) / 60), 0) || 0)
    , 0) || 0)
  , 0);
  const totalHours = Math.floor(totalMinutes / 60);

  // Show Coming Soon state if Academy content is not live
  if (!ACADEMY_CONTENT_LIVE) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <AcademyComingSoon 
              releaseDate="February 2026"
              title="Academy Launching Soon"
              description="We're putting the finishing touches on our comprehensive 4-level training curriculum. Get ready for the complete baseball development system."
            />
          </div>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 flex items-center justify-center min-h-[60vh]">
            <div className="text-muted-foreground">Loading Academy...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-8 md:py-12 border-b border-border mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                    The Academy
                  </h1>
                </div>
                <p className="text-muted-foreground max-w-xl mb-4">
                  Master the mental game, perfect your mechanics, and develop pro-level baseball IQ
                  through our structured training program.
                </p>
                
                {/* Stats Row */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    {totalLessons} lessons
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {totalHours}+ hours
                  </span>
                  <span className="flex items-center gap-1.5">
                    {levels.length} levels
                  </span>
                </div>
              </div>

              {/* Overall Progress */}
              <div className="bg-card rounded-xl p-5 border border-border min-w-[280px]">
                <div className="flex items-center gap-3 mb-3">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span className="font-medium text-foreground">Your Progress</span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <Progress value={totalProgress} className="flex-1 h-3" />
                  <span className="text-lg font-bold text-foreground">{totalProgress}%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {totalProgress === 0 
                    ? "Start your journey today" 
                    : totalProgress === 100 
                    ? "Congratulations! You've completed the Academy"
                    : "Keep going, you're making great progress!"
                  }
                </p>
              </div>
            </div>
          </motion.div>

          {/* Continue Learning Section */}
          {lastWatchedLesson && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <Link 
                to={`/academy/lesson/${lastWatchedLesson.id}`}
                className="block p-6 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Play className="w-8 h-8 text-primary fill-primary/30" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-primary font-medium mb-1">Continue Learning</p>
                    <h3 className="font-display text-lg font-bold text-foreground truncate">
                      {lastWatchedLesson.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Pick up where you left off
                    </p>
                  </div>
                  <Button className="flex-shrink-0 gap-2">
                    <Play className="w-4 h-4" />
                    Resume
                  </Button>
                </div>
              </Link>
            </motion.section>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content - Levels */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold text-foreground">
                  Training Levels
                </h2>
                <span className="text-sm text-muted-foreground">
                  {levels.filter(l => getLevelProgress(l) === 100).length} of {levels.length} complete
                </span>
              </div>
              {levels.map((level, index) => (
                <LevelCard
                  key={level.id}
                  level={level}
                  progress={getLevelProgress(level)}
                  canAccess={canAccessLevel(level)}
                  index={index}
                />
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Start / Featured */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card-premium p-6"
              >
                <h3 className="font-display text-lg font-bold text-foreground mb-4">
                  Start Here
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  New to the Academy? Begin with Level 1 to build a solid mental foundation for your hitting.
                </p>
                <Link to={`/academy/level/${levels[0]?.slug || 'inner-diamond'}`}>
                  <Button className="w-full gap-2">
                    <Play className="w-4 h-4" />
                    Start Level 1
                  </Button>
                </Link>
              </motion.section>

              {/* Upcoming Events */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card-premium p-6"
              >
                <h3 className="font-display text-lg font-bold text-foreground mb-4">
                  Upcoming Events
                </h3>
                {upcomingEvents.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingEvents.map((event) => (
                      <Link
                        key={event.id}
                        to="/events"
                        className="block p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <p className="font-medium text-foreground text-sm truncate">
                          {event.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(event.start_time), "EEE, MMM d 'at' h:mm a")}
                        </p>
                      </Link>
                    ))}
                    <Link to="/events">
                      <Button variant="outline" className="w-full mt-2" size="sm">
                        View All Events
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No upcoming events scheduled.
                  </p>
                )}
              </motion.section>

              {/* Quick Links */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card-premium p-6"
              >
                <h3 className="font-display text-lg font-bold text-foreground mb-4">
                  Quick Links
                </h3>
                <div className="space-y-2">
                  <Link to="/training-room">
                    <Button variant="ghost" className="w-full justify-start">
                      Community
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button variant="ghost" className="w-full justify-start">
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/book">
                    <Button variant="ghost" className="w-full justify-start">
                      Book a Session
                    </Button>
                  </Link>
                </div>
              </motion.section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
