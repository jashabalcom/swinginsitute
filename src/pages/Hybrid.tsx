import { motion } from "framer-motion";
import { ArrowRight, Zap, CheckCircle2, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

const hybridTiers = [
  {
    name: "Hybrid Core",
    price: "$279",
    period: "/month",
    description: "Online training + monthly in-person credits",
    features: [
      "Full Pro online membership",
      "1 in-person credit per month",
      "Discounted rate ($115/hr)",
      "Priority booking",
      "Training Room community",
    ],
    credits: 1,
    popular: false,
  },
  {
    name: "Hybrid Pro",
    price: "$449",
    period: "/month",
    description: "Maximum development with more in-person time",
    features: [
      "Full Elite online membership",
      "2 in-person credits per month",
      "Discounted rate ($115/hr)",
      "VIP priority booking",
      "Quarterly progress assessment",
      "Direct messaging with Coach",
    ],
    credits: 2,
    popular: true,
  },
];

const benefits = [
  {
    title: "Best of Both Worlds",
    description: "Combine the convenience of online training with hands-on in-person coaching.",
  },
  {
    title: "Discounted Sessions",
    description: "Pay $115/hr instead of $145/hr for all in-person sessions.",
  },
  {
    title: "Priority Booking",
    description: "Get first access to Coach Jasha's calendar before non-members.",
  },
  {
    title: "Continuous Progress",
    description: "Stay on track between sessions with the full online system.",
  },
];

export default function Hybrid() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <div className="flex items-center justify-center gap-2 text-primary mb-4">
                <Zap className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wide">Best Value</span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                HYBRID TRAINING
                <br />
                <span className="gradient-text-red">THE COMPLETE PACKAGE</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Full online membership plus in-person credits.
                The most effective way to develop your player.
              </p>

              <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-8">
                <Star className="w-4 h-4 text-accent" />
                <span className="text-sm text-accent font-medium">Save up to $60/session with member pricing</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-card/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                WHY <span className="text-secondary">HYBRID?</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card-accent-blue p-6"
                >
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                HYBRID <span className="gradient-text-red">PLANS</span>
              </h2>
              <p className="text-muted-foreground">
                Credits renew monthly. Unused credits do not roll over.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {hybridTiers.map((tier, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex flex-col rounded-2xl border p-8 ${
                    tier.popular
                      ? "border-primary bg-card glow-red"
                      : "border-border bg-card/50"
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                    {tier.name}
                  </h3>
                  
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="font-display text-5xl font-bold text-foreground">
                      {tier.price}
                    </span>
                    <span className="text-muted-foreground">{tier.period}</span>
                  </div>
                  
                  <p className="text-muted-foreground mb-2">{tier.description}</p>
                  
                  <div className="inline-flex items-center gap-2 bg-secondary/10 rounded-lg px-3 py-2 w-fit mb-6">
                    <span className="text-secondary font-semibold">
                      {tier.credits} in-person credit{tier.credits > 1 ? 's' : ''}/month
                    </span>
                  </div>

                  <ul className="space-y-3 mb-8 flex-grow">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${tier.popular ? 'text-primary' : 'text-accent'}`} />
                        <span className="text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full mt-auto ${
                      tier.popular
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                        : "bg-transparent border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                    }`}
                    size="lg"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-card/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                HAVE QUESTIONS?
              </h2>
              <p className="text-muted-foreground mb-8">
                Book a Parent Game Plan Call to discuss your player's goals and 
                find the right plan for your family.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="btn-hero group">
                  Book a Parent Call
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Link to="/masterclass">
                  <Button variant="outline" className="btn-secondary-outline">
                    Watch Free Masterclass
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
