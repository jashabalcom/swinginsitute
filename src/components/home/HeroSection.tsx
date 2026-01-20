import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import coachJasha from "@/assets/coach-jasha-hero.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-12 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6"
            >
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
              <span className="text-sm text-primary font-medium">Limited Spots Available</span>
            </motion.div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[0.95] mb-6">
              TURNING BACKYARD
              <br />
              SWINGS INTO
              <br />
              <span className="gradient-text-red">D1 DREAMS</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              The same system used to develop MLB All-Star Cedric Mullins.
              Pro-level coaching for serious players ready to compete.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link to="/masterclass">
                <Button className="btn-hero group w-full sm:w-auto">
                  Watch Free Masterclass
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/train-atlanta">
                <Button variant="outline" className="btn-secondary-outline w-full sm:w-auto">
                  <Play className="mr-2 h-4 w-4" />
                  Train in Atlanta
                </Button>
              </Link>
            </div>

            {/* Social Proof - 2026 UPGRADED with micro-animations */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-6 sm:gap-8 pt-8 border-t border-border/50"
            >
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="cursor-default"
              >
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="font-display text-3xl sm:text-4xl font-bold text-foreground"
                >
                  1,200+
                </motion.div>
                <div className="text-sm text-muted-foreground">Players Trained</div>
              </motion.div>
              <div className="h-12 w-px bg-border/60" />
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="cursor-default"
              >
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="font-display text-3xl sm:text-4xl font-bold text-foreground"
                >
                  50+
                </motion.div>
                <div className="text-sm text-muted-foreground">College Commits</div>
              </motion.div>
              <div className="h-12 w-px bg-border/60" />
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="cursor-default"
              >
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="font-display text-3xl sm:text-4xl font-bold text-primary"
                >
                  MLB
                </motion.div>
                <div className="text-sm text-muted-foreground">Proven System</div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right - Coach Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="relative">
              {/* Glow effect behind image */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-3xl opacity-50" />
              
              {/* Main image */}
              <div className="relative rounded-2xl overflow-hidden border border-border/50">
                <img
                  src={coachJasha}
                  alt="Coach Jasha Balcom - Former Pro Player & Elite Hitting Coach"
                  className="w-full h-auto object-cover"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                
                {/* Coach info overlay - 2026 UPGRADED with better legibility */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/90 via-background/60 to-transparent">
                  <p className="font-display text-xl font-bold text-foreground text-shadow">Coach Jasha Balcom</p>
                  <p className="text-sm text-foreground/80 text-shadow">Former Pro Player • Mentor to Hundreds • Founder</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
