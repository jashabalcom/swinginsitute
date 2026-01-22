import { motion } from "framer-motion";
import { ArrowRight, Award, Users, Target, CheckCircle2, TrendingUp, Eye, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import coachJasha from "@/assets/coach-jasha-seated.jpg";

const achievements = [
  "Drafted by Pittsburgh Pirates (High School)",
  "Perfect Game All-American & MVP (Wood Bat Showcase)",
  "#1 High School Player in Georgia (Class of 2000)",
  "University of Georgia Baseball Alum",
  "Signed with Chicago Cubs Organization",
  "Pro Scout & Agent – Knows What Scouts Actually Look For",
  "Trained MLB All-Star Cedric Mullins",
];

const stats = [
  { number: "20+", label: "Years Experience" },
  { number: "1,200+", label: "Players Trained" },
  { number: "MLB", label: "Pro System" },
  { number: "50+", label: "College Commits" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center gap-2 text-secondary mb-4">
                  <Award className="w-5 h-5" />
                  <span className="text-sm font-medium uppercase tracking-wide">Meet Your Coach</span>
                </div>

                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  COACH
                  <br />
                  <span className="gradient-text-red">JASHA BALCOM</span>
                </h1>

                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Drafted by the Pittsburgh Pirates out of high school. Perfect Game All-American. 
                  #1 player in Georgia. UGA alum. Chicago Cubs signee. Pro scout and agent. 
                  And the coach behind MLB All-Star Cedric Mullins. Coach Jasha has lived every 
                  level of baseball—and now dedicates 20+ years of experience to building 
                  championship-level hitters.
                </p>

                <div className="space-y-3 mb-8">
                  {achievements.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                      <span className="text-foreground/90">{item}</span>
                    </motion.div>
                  ))}
                </div>

                <Link to="/masterclass">
                  <Button className="btn-hero group">
                    Watch Free Masterclass
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-3xl opacity-50" />
                <div className="relative rounded-2xl overflow-hidden border border-border">
                  <img
                    src={coachJasha}
                    alt="Coach Jasha Balcom - Perfect Game All-American, UGA Baseball, Pittsburgh Pirates draft pick"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="font-display text-4xl md:text-5xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wide">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-12">
                <Target className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                  THE <span className="gradient-text-blue">PHILOSOPHY</span>
                </h2>
              </div>

              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  "I'm not just building swings — <span className="text-primary font-semibold">I'm building champions.</span>"
                </p>
                <p>
                  Every player who walks through my doors or joins the online program gets 
                  the same thing: a clear path, a proven system, and my full commitment to 
                  their development.
                </p>
                <p>
                  I don't believe in random drills or one-size-fits-all approaches. 
                  The Swing Institute is built on phases — each one designed to build on 
                  the last, creating lasting mechanical changes and unshakeable confidence.
                </p>
                <p>
                  Whether you're training in Atlanta or from across the country, you get 
                  the same system. The same attention. The same results-driven approach 
                  that's developed players at every level — from travel ball to the MLB.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The Journey - Personal Story */}
        <section className="py-16 md:py-24 bg-card/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-12">
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                  THE <span className="gradient-text-red">JOURNEY</span>
                </h2>
              </div>
              
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  In 2005, during Spring Training, I lost my father. It changed everything.
                </p>
                <p>
                  I stepped away from professional baseball—not because I had to, 
                  but because I realized the game had become my identity, not my purpose.
                </p>
                <p>
                  That experience shaped everything I teach today: mental resilience, 
                  emotional regulation, identity beyond the game, and long-term athlete 
                  development. I train players not just to hit at a high level—but to 
                  handle the pressure, the failures, and the journey that comes with it.
                </p>
                <p className="text-primary font-semibold italic text-xl">
                  "I don't just build swings. I build players who can handle anything."
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The Edge - Scouting & Agent Experience */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                THE <span className="gradient-text-blue">EDGE</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-10">
                Most coaches teach hitting. I teach players how to get noticed.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="card-premium p-6"
                >
                  <Eye className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-bold text-foreground mb-2 text-lg">Scout's Eye</h3>
                  <p className="text-sm text-muted-foreground">
                    Years as a pro scout taught me exactly what evaluators look for—
                    and what separates "good" from "projectable."
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="card-premium p-6"
                >
                  <Award className="w-10 h-10 text-secondary mx-auto mb-4" />
                  <h3 className="font-bold text-foreground mb-2 text-lg">Agent Experience</h3>
                  <p className="text-sm text-muted-foreground">
                    I've sat at the negotiating table. I understand draft dynamics, 
                    projection vs. present tools, and the business side of baseball.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="card-premium p-6"
                >
                  <Brain className="w-10 h-10 text-accent mx-auto mb-4" />
                  <h3 className="font-bold text-foreground mb-2 text-lg">Mindset Mastery</h3>
                  <p className="text-sm text-muted-foreground">
                    NLP-trained. I help players build unshakeable confidence and 
                    identity-based performance habits that last.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* MLB Credibility */}
        <section className="py-16 bg-card/50 scroll-mt-24" id="success">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-8">
                MLB ALL-STAR <span className="text-primary">CEDRIC MULLINS</span>
              </h2>
              
              <div className="card-accent-red p-8">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <blockquote className="text-xl text-foreground/90 italic mb-4">
                  "Cedric Mullins, one of the league's top hitters, publicly credited 
                  Coach Jasha Balcom with teaching him how to hit at the pro level."
                </blockquote>
                <p className="text-muted-foreground">
                  This is the same system now available to serious players everywhere.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                READY TO <span className="gradient-text-red">GET STARTED?</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                See the system in action. Watch the free masterclass and discover 
                if the Swing Institute is right for your player.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/masterclass">
                  <Button className="btn-hero group">
                    Watch Free Masterclass
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/train-atlanta">
                  <Button variant="outline" className="btn-secondary-outline">
                    Book a Session
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