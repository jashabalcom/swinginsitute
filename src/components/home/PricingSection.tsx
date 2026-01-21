import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, MapPin, Globe, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    id: "atlanta",
    name: "Train in Atlanta",
    icon: MapPin,
    subtitle: "In-Person Excellence",
    price: "$145",
    unit: "per session",
    description: "Private 1-on-1 sessions at our Atlanta facility with Coach Jasha.",
    features: [
      "In-person swing analysis",
      "Hands-on mechanical corrections",
      "Real-time feedback",
      "Access to training facility",
      "Video recordings of sessions",
    ],
    cta: "Book Your Session",
    href: "/train-atlanta",
    popular: false,
    accent: "blue",
  },
  {
    id: "hybrid",
    name: "Hybrid Training",
    icon: Zap,
    subtitle: "Best Value",
    price: "From $279",
    unit: "per month",
    description: "Online membership + in-person credits. The complete package.",
    features: [
      "Everything in online membership",
      "Monthly in-person credits",
      "Priority booking access",
      "Discounted session rate ($115/hr)",
      "Quarterly progress assessments",
    ],
    cta: "Get Started",
    href: "/hybrid",
    popular: true,
    accent: "red",
  },
  {
    id: "online",
    name: "Train Online",
    icon: Globe,
    subtitle: "From Anywhere",
    price: "From $99",
    unit: "per month",
    description: "Full access to the Swing Institute system from anywhere in the world.",
    features: [
      "Phase-based training curriculum",
      "Swing review submissions",
      "Training Room community",
      "Weekly action plans",
      "Inner Diamond mindset training",
    ],
    cta: "Join Now",
    href: "/train-online",
    popular: false,
    accent: "blue",
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-card/30 scroll-mt-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            BUILD A PRO-GRADE HITTER.{" "}
            <span className="gradient-text-red">YOUR WAY.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the path that fits your player's schedule, location, and goals.
            Every path leads to the same elite system.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              whileHover={{ 
                y: -8,
                transition: { type: "spring", stiffness: 400, damping: 17 }
              }}
              className={`relative flex flex-col rounded-2xl border p-6 lg:p-8 transition-shadow duration-300 ${
                tier.popular
                  ? "border-primary bg-card glow-red hover:shadow-2xl hover:shadow-primary/20"
                  : "border-border bg-card/50 hover:shadow-xl hover:shadow-black/20 hover:border-border/80"
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 500, damping: 25 }}
                  className="absolute -top-3 left-1/2 -translate-x-1/2"
                >
                  <span className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </motion.div>
              )}

              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <motion.div
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <tier.icon className={`w-6 h-6 ${tier.popular ? 'text-primary' : 'text-secondary'}`} />
                  </motion.div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {tier.subtitle}
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground">
                  {tier.name}
                </h3>
              </div>

              {/* Price with hover effect */}
              <motion.div 
                className="mb-6"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl font-bold text-foreground">
                    {tier.price}
                  </span>
                  <span className="text-muted-foreground text-sm">{tier.unit}</span>
                </div>
                <p className="text-muted-foreground text-sm mt-2">{tier.description}</p>
              </motion.div>

              {/* Features with staggered animation */}
              <ul className="space-y-3 mb-8 flex-grow">
                {tier.features.map((feature, i) => (
                  <motion.li 
                    key={i} 
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + i * 0.05 + 0.2 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${tier.popular ? 'text-primary' : 'text-accent'}`} />
                    </motion.div>
                    <span className="text-foreground/80 text-sm">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              {/* CTA */}
              <Link to={tier.href} className="mt-auto">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    className={`w-full group ${
                      tier.popular
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                        : "bg-transparent border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                    }`}
                  >
                    {tier.cta}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            Not sure which is right for you?
          </p>
          <Link to="/masterclass">
            <Button variant="link" className="text-primary hover:text-primary/80 font-semibold">
              Start with our Free Masterclass →
            </Button>
          </Link>
          
          <div className="mt-8 pt-8 border-t border-border/50">
            <p className="text-muted-foreground mb-4">
              Want to explore the community first?
            </p>
            <Link to="/free-signup">
              <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
                Join the Community Free →
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
