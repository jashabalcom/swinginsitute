import { motion } from "framer-motion";
import { Users, MapPin, GraduationCap, Trophy } from "lucide-react";
import youthCampImage from "@/assets/coach-jasha-youth-camp.jpg";

const stats = [
  { icon: Users, value: "1,200+", label: "Players Trained" },
  { icon: MapPin, value: "15+", label: "States Reached" },
  { icon: GraduationCap, value: "50+", label: "College Commits" },
  { icon: Trophy, value: "MLB", label: "Pro Results" },
];

export function CommunityImpactSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-2xl blur-3xl opacity-50" />
            <div className="relative rounded-2xl overflow-hidden border border-border">
              <img
                src={youthCampImage}
                alt="Coach Jasha leading a youth baseball camp in Atlanta"
                className="w-full h-auto object-cover"
              />
            </div>
            <p className="text-center text-muted-foreground mt-3 text-sm">
              Coach Jasha leading a youth camp in Atlanta
            </p>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              1,200+ PLAYERS{" "}
              <span className="gradient-text-blue">DEVELOPED</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              From youth camps to the MLB, Coach Jasha has built a nationwide community 
              of serious players committed to elite development. The same system. 
              The same results. Available to you.
            </p>

            {/* Stats Grid - 2026 UPGRADED with better card depth */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card-premium p-5 text-center"
                >
                  <stat.icon className="w-6 h-6 text-secondary mx-auto mb-3" />
                  <div className="font-display text-2xl lg:text-3xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
