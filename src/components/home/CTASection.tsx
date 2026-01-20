import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-card/50 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Urgency Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Limited Enrollment Open</span>
          </div>

          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            THIS WINDOW WON'T
            <br />
            <span className="gradient-text-red">STAY OPEN FOREVER</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
            If your child has the talent and drive — they deserve the right coaching.
            Don't let another season pass without a real plan.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/masterclass">
              <Button className="btn-hero group w-full sm:w-auto text-lg px-10 py-6">
                Watch Free Masterclass
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/book-call">
              <Button variant="outline" className="btn-secondary-outline w-full sm:w-auto text-lg px-10 py-6">
                Book a Parent Call
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            100% Free. No obligation. See if the Swing Institute is right for your player.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
