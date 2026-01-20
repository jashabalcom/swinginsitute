import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GoHighLevelCalendar } from "@/components/booking/GoHighLevelCalendar";
import { Phone, Target, TrendingUp, MessageSquare } from "lucide-react";

const PARENT_CALL_CALENDAR_ID = "xxNZzagjCWL70aXHBopO";

const benefits = [
  {
    icon: Target,
    title: "Evaluate Current Level",
    description: "Get honest feedback on your player's swing mechanics and development stage"
  },
  {
    icon: TrendingUp,
    title: "Identify Key Gaps",
    description: "Pinpoint the specific areas holding your player back from the next level"
  },
  {
    icon: MessageSquare,
    title: "Get a Clear Path Forward",
    description: "Walk away with a personalized roadmap for improvement"
  }
];

export default function BookCall() {
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">FREE 30-Minute Strategy Call</span>
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 uppercase tracking-tight">
                Schedule Your Parent<br />
                <span className="text-primary">Game Plan Call</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                30 minutes with Coach Jasha to create a personalized development roadmap for your player. 
                No pressure, just real advice from someone who's developed MLB talent.
              </p>
            </motion.div>

            {/* Benefits Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12"
            >
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.title}
                  className="bg-card border border-border rounded-xl p-6 text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
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
                  calendarId={PARENT_CALL_CALENDAR_ID}
                  height="700px"
                  title="Schedule Parent Game Plan Call"
                />
              </div>
            </motion.div>

            {/* Trust Badge */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center text-sm text-muted-foreground mt-8"
            >
              Trained MLB All-Star Cedric Mullins • 15+ Years Experience • 100s of Players Developed
            </motion.p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
