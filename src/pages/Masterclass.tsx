import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Play, Clock, Users } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const learnings = [
  { bold: "What most hitting lessons miss", rest: " (and why they rarely lead to long-term growth)" },
  { bold: "How to identify exactly", rest: " what's holding your swing back and fix it fast" },
  { bold: "The mindset shifts", rest: " players need to stand out in competitive environments" },
  { bold: "How to give your child a real path", rest: " to college or pro-level development" },
  { bold: "The system I've used to coach players", rest: " like MLB All-Star Cedric Mullins" },
];

export default function Masterclass() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Masterclass signup:", { name, email });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6"
              >
                <span className="text-sm text-primary font-medium">
                  A Free Web Masterclass with Coach Jasha Balcom
                </span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground mb-4"
              >
                Former Pro Player | Mentor to Hundreds | Founder of The Swing Institute
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              >
                BUILD A NEXT LEVEL SWING AND
                <br />
                <span className="gradient-text-red">UNSHAKEABLE CONFIDENCE</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-muted-foreground mb-8"
              >
                Without Wasting Time on Generic Lessons
              </motion.p>

              {/* Video Placeholder */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="relative rounded-2xl overflow-hidden border-2 border-primary/30 bg-card aspect-video max-w-3xl mx-auto mb-12"
              >
                <div className="absolute inset-0 flex items-center justify-center bg-card">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-primary/30 transition-colors">
                      <Play className="w-8 h-8 text-primary ml-1" />
                    </div>
                    <p className="text-muted-foreground">Click to Watch the Free Masterclass</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* What You'll Learn */}
        <section className="py-16 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10"
              >
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  THIS <span className="text-primary">FREE SESSION</span> IS FOR YOU
                </h2>
                <p className="text-muted-foreground">
                  If You're A Parent Of A Serious Ballplayer Or A Young
                  <br />
                  <span className="text-secondary">Athlete Who Wants To Compete At A High Level</span>
                </p>
              </motion.div>

              <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
                <div className="flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-4 py-2 w-fit mb-6">
                  <span className="text-sm font-semibold">YOU'LL LEARN:</span>
                </div>

                <ul className="space-y-4">
                  {learnings.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
                      <span className="text-foreground/90">
                        <strong>{item.bold}</strong>
                        {item.rest}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-xl mx-auto"
            >
              <div className="bg-card rounded-2xl border border-primary/30 p-6 md:p-8 glow-red">
                <h3 className="font-display text-2xl md:text-3xl font-bold text-center mb-4">
                  DON'T MISS THIS{" "}
                  <span className="text-primary">FREE WEB MASTERCLASS</span>
                </h3>
                <p className="text-muted-foreground text-center mb-8">
                  If your child has the talent and drive — they deserve the right coaching.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-background border-border h-12"
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background border-border h-12"
                    required
                  />
                  <Button type="submit" className="w-full btn-hero h-14 text-lg">
                    RESERVE YOUR FREE SPOT NOW
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  100% FREE. Spots are limited.
                </p>

                {/* Stats */}
                <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>45 min class</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>1,200+ trained</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
