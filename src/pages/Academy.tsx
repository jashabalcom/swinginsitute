import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GraduationCap, Trophy, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { LevelCard } from "@/components/academy/LevelCard";
import { useCurriculum } from "@/hooks/useCurriculum";
import { useEvents } from "@/hooks/useEvents";
import { format } from "date-fns";

export default function Academy() {
  const { levels, loading, getLevelProgress, canAccessLevel, getTotalProgress } = useCurriculum();
  const { getUpcomingEvents } = useEvents();

  const totalProgress = getTotalProgress();
  const upcomingEvents = getUpcomingEvents().slice(0, 3);

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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                    The Academy
                  </h1>
                </div>
                <p className="text-muted-foreground max-w-xl">
                  Master the mental game, perfect your mechanics, and develop pro-level baseball IQ
                  through our structured training program.
                </p>
              </div>

              {/* Overall Progress */}
              <div className="bg-card rounded-xl p-5 border border-border min-w-[240px]">
                <div className="flex items-center gap-3 mb-3">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span className="font-medium text-foreground">Overall Progress</span>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={totalProgress} className="flex-1 h-3" />
                  <span className="text-lg font-bold text-foreground">{totalProgress}%</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content - Levels */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                Training Levels
              </h2>
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
