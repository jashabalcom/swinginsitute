import { motion } from "framer-motion";
import { CheckCircle2, Target, TrendingUp, Users, Video } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Phase-Based System",
    description: "Not a video library. A structured development path with clear phases and checkpoints.",
  },
  {
    icon: Video,
    title: "Personal Swing Reviews",
    description: "Submit your swing, get detailed feedback from Coach Jasha. No guesswork.",
  },
  {
    icon: TrendingUp,
    title: "Progressive Training",
    description: "Each phase builds on the last. Master the fundamentals before advancing.",
  },
  {
    icon: Users,
    title: "Training Room Community",
    description: "Connect with serious players. Weekly focus topics, player wins, and Q&A.",
  },
];

const differentiators = [
  "Former pro player who understands what it takes",
  "Trained MLB All-Star Cedric Mullins",
  "Over 1,200 players developed across the U.S.",
  "The same system whether online or in-person",
  "Mindset training integrated into every phase",
];

export function SolutionSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            WHAT MAKES THE SWING INSTITUTE{" "}
            <span className="gradient-text-blue">DIFFERENT</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            This isn't another hitting program. It's a complete player development system
            built by someone who's been there.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card-accent-blue p-6"
            >
              <feature.icon className="w-10 h-10 text-secondary mb-4" />
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Why Coach Jasha */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-premium p-8 md:p-12 max-w-3xl mx-auto"
        >
          <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
            WHY COACH JASHA?
          </h3>
          <div className="space-y-4">
            {differentiators.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-foreground/90">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
