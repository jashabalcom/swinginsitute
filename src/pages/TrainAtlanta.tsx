import { motion } from "framer-motion";
import { ArrowRight, MapPin, Clock, Star, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import coachJasha from "@/assets/coach-jasha-seated.jpg";

const sessionIncludes = [
  "Comprehensive swing analysis",
  "Hands-on mechanical corrections",
  "Video breakdown and recording",
  "Personalized drill assignment",
  "Take-home action plan",
];

const packages = [
  {
    name: "Single Session",
    price: "$145",
    perSession: "$145/session",
    sessions: "1 session",
    description: "Perfect for assessment or specific issue focus",
    popular: false,
  },
  {
    name: "3-Session Pack",
    price: "$400",
    perSession: "$133/session",
    sessions: "3 sessions",
    description: "Build momentum with consistent training",
    savings: "Save $35",
    popular: false,
  },
  {
    name: "6-Session Pack",
    price: "$725",
    perSession: "$121/session",
    sessions: "6 sessions",
    description: "Best value for serious development",
    savings: "Save $145",
    popular: true,
  },
];

export default function TrainAtlanta() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero - SEO Optimized for Atlanta Baseball Training */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center gap-2 text-secondary mb-4">
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm font-medium uppercase tracking-wide">Atlanta, Georgia</span>
                </div>

                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  ATLANTA BASEBALL
                  <br />
                  <span className="gradient-text-red">HITTING LESSONS</span>
                </h1>

                <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                  Private 1-on-1 hitting instruction with Coach Jasha Balcom—trainer of MLB All-Star Cedric Mullins. 
                  Perfect Game prep, travel ball development, and college showcase training in Atlanta, GA.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link to="/book">
                    <Button className="btn-hero group">
                      Book Your Session
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/masterclass">
                    <Button variant="outline" className="btn-secondary-outline">
                      Watch Free Masterclass First
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>60-min sessions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-gold" />
                    <span>1,200+ players trained</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <div className="rounded-2xl overflow-hidden border border-border">
                  <img
                    src={coachJasha}
                    alt="Coach Jasha Balcom - Atlanta baseball hitting coach and trainer of MLB All-Star Cedric Mullins"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-16 bg-card/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
                EVERY PRIVATE LESSON <span className="text-secondary">INCLUDES</span>
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {sessionIncludes.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border"
                  >
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Packages */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                ATLANTA LESSON <span className="gradient-text-red">PACKAGES</span>
              </h2>
              <p className="text-muted-foreground">
                In-person baseball training packages for youth, travel ball, and high school players in Atlanta, GA
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {packages.map((pkg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative rounded-2xl border p-6 ${
                    pkg.popular
                      ? "border-primary bg-card glow-red"
                      : "border-border bg-card/50"
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full">
                        Best Value
                      </span>
                    </div>
                  )}

                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    {pkg.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="font-display text-3xl font-bold text-foreground">
                      {pkg.price}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{pkg.perSession}</p>
                  <p className="text-sm text-muted-foreground mb-4">{pkg.sessions}</p>
                  {pkg.savings && (
                    <span className="inline-block bg-accent/20 text-accent text-xs font-semibold px-2 py-1 rounded mb-4">
                      {pkg.savings}
                    </span>
                  )}
                  <p className="text-sm text-muted-foreground mb-6">{pkg.description}</p>
                  <Link to="/book" className="w-full block">
                    <Button
                      className={`w-full ${
                        pkg.popular
                          ? "bg-primary hover:bg-primary/90"
                          : "bg-transparent border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                      }`}
                    >
                      Book Now
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
                READY TO <span className="text-primary">GET STARTED?</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Book a Parent Game Plan Call to discuss your player's goals and 
                see if training with Coach Jasha is the right fit.
              </p>
              <Link to="/masterclass">
                <Button className="btn-hero group">
                  Book Your Parent Call
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
