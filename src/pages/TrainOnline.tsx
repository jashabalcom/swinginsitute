import { motion } from "framer-motion";
import { ArrowRight, Globe, CheckCircle2, Video, Target, Users, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Starter",
    price: "$99",
    period: "/month",
    description: "For players ready to start their development journey",
    features: [
      "Phase-based training curriculum",
      "2 swing reviews per month",
      "Training Room community access",
      "Weekly action plans",
      "Mobile-friendly platform",
    ],
    cta: "Start Training",
    popular: false,
  },
  {
    name: "Pro",
    price: "$199",
    period: "/month",
    description: "For serious players committed to rapid improvement",
    features: [
      "Everything in Starter",
      "4 swing reviews per month",
      "Priority feedback (48hr)",
      "Inner Diamond mindset program",
      "Monthly live Q&A with Coach",
      "Discounted lesson rate ($115/hr)",
    ],
    cta: "Go Pro",
    popular: true,
  },
  {
    name: "Elite",
    price: "$299",
    period: "/month",
    description: "For players pursuing college or pro-level development",
    features: [
      "Everything in Pro",
      "Unlimited swing reviews",
      "24hr priority feedback",
      "1 monthly Zoom call with Coach",
      "Personalized phase progression",
      "College recruiting guidance",
    ],
    cta: "Go Elite",
    popular: false,
  },
];

const systemFeatures = [
  {
    icon: Target,
    title: "Phase-Based Progression",
    description: "Not a video library. A structured system that builds skill layer by layer.",
  },
  {
    icon: Video,
    title: "Personal Swing Reviews",
    description: "Submit your swing, receive detailed video feedback from Coach Jasha.",
  },
  {
    icon: Users,
    title: "Training Room Community",
    description: "Connect with serious players. Weekly focus, player wins, and Q&A.",
  },
  {
    icon: Brain,
    title: "Inner Diamond Mindset",
    description: "Mental training integrated into every phase. Build unshakeable confidence.",
  },
];

export default function TrainOnline() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero - SEO Optimized for Online Baseball Training */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <div className="flex items-center justify-center gap-2 text-secondary mb-4">
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wide">Online Baseball Training Program</span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                ONLINE BASEBALL
                <br />
                <span className="gradient-text-blue">HITTING TRAINING</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                The complete online baseball training system used to develop MLB All-Star Cedric Mullins. 
                Video swing analysis, personalized feedback, and proven hitting curriculum—from anywhere in the world.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/checkout?tier=pro">
                  <Button className="btn-hero group">
                    Start Training Online
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/masterclass">
                  <Button variant="outline" className="btn-secondary-outline">
                    Watch Free Masterclass
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The System */}
        <section className="py-16 bg-card/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                THE ONLINE TRAINING <span className="text-secondary">SYSTEM</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                This isn't another video course. It's a complete player development system.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {systemFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card-premium p-6 text-center"
                >
                  <feature.icon className="w-10 h-10 text-secondary mx-auto mb-4" />
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
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
                ONLINE MEMBERSHIP <span className="gradient-text-red">TIERS</span>
              </h2>
              <p className="text-muted-foreground">
                Monthly online baseball training memberships with video swing reviews and curriculum access
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
              {tiers.map((tier, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex flex-col rounded-2xl border p-6 lg:p-8 ${
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
                    <span className="font-display text-4xl font-bold text-foreground">
                      {tier.price}
                    </span>
                    <span className="text-muted-foreground">{tier.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">{tier.description}</p>

                  <ul className="space-y-3 mb-8 flex-grow">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${tier.popular ? 'text-primary' : 'text-accent'}`} />
                        <span className="text-foreground/80 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to={`/checkout?tier=${tier.name.toLowerCase()}`} className="w-full mt-auto block">
                    <Button
                      className={`w-full ${
                        tier.popular
                          ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                          : "bg-transparent border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                      }`}
                    >
                      {tier.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
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
                NOT SURE YET?
              </h2>
              <p className="text-muted-foreground mb-8">
                Start with our free masterclass to see if the Swing Institute 
                is right for your player.
              </p>
              <Link to="/masterclass">
                <Button className="btn-hero group">
                  Watch Free Masterclass
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
