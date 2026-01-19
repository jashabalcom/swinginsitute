import { motion } from "framer-motion";
import { XCircle } from "lucide-react";

const problems = [
  "Generic hitting lessons that don't stick",
  "No clear plan or progression",
  "Coaches who never played at a high level",
  "Scattered drills from YouTube with no system",
  "Players who work hard but plateau",
];

export function ProblemSection() {
  return (
    <section className="py-20 md:py-28 bg-card/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            THE <span className="text-primary">PROBLEM</span> WITH MOST BASEBALL TRAINING
          </h2>
          <p className="text-lg text-muted-foreground">
            If your player is putting in the work but still struggling to see results,
            it's not their effort — it's the system.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 py-4 border-b border-border/50 last:border-0"
            >
              <XCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-lg text-foreground/90">{problem}</span>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-xl md:text-2xl font-display font-semibold text-foreground mt-12"
        >
          "I'M NOT JUST BUILDING SWINGS —{" "}
          <span className="text-primary">I'M BUILDING CHAMPIONS</span>"
        </motion.p>
      </div>
    </section>
  );
}
