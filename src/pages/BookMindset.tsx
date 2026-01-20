import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GoHighLevelCalendar } from "@/components/booking/GoHighLevelCalendar";
import { Brain, Focus, Zap, Shield } from "lucide-react";

const MINDSET_CALENDAR_ID = "gh6w28zo1gVh7KDUAYBX";

const topics = [
  {
    icon: Focus,
    title: "Pre-Game Routines",
    description: "Build consistent mental preparation that puts you in the zone"
  },
  {
    icon: Zap,
    title: "At-Bat Pressure",
    description: "Learn to thrive in high-pressure situations when it counts"
  },
  {
    icon: Shield,
    title: "Unshakeable Confidence",
    description: "Develop the mental edge that separates good from great"
  },
  {
    icon: Brain,
    title: "Slump Recovery",
    description: "Mental tools to break out of slumps faster than ever"
  }
];

export default function BookMindset() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
                <Brain className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">Mental Performance Coaching</span>
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 uppercase tracking-tight">
                Book Your<br />
                <span className="text-accent">Mindset Session</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                30-minute focused session on the mental game. Build the confidence and 
                focus that separates elite players from everyone else.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
                <span className="text-2xl font-bold text-foreground">$75</span>
                <span className="text-muted-foreground">per session</span>
              </div>
            </motion.div>

            {/* Topics Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-12"
            >
              {topics.map((topic) => (
                <div
                  key={topic.title}
                  className="bg-card border border-border rounded-xl p-5 text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                    <topic.icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-foreground mb-1">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {topic.description}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Calendar Embed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-card border border-border rounded-2xl p-2 md:p-4 shadow-xl">
                <GoHighLevelCalendar 
                  calendarId={MINDSET_CALENDAR_ID}
                  height="700px"
                  title="Book Mindset Coaching Session"
                />
              </div>
            </motion.div>

            {/* Note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center text-sm text-muted-foreground mt-8 max-w-xl mx-auto"
            >
              Mental game coaching is available for all members and non-members. 
              Sessions conducted via Zoom or in-person at our Atlanta facility.
            </motion.p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
