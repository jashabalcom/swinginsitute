import { motion } from "framer-motion";
import { Lock, Bell, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface AcademyComingSoonProps {
  releaseDate?: string;
  title?: string;
  description?: string;
}

export function AcademyComingSoon({ 
  releaseDate,
  title = "Academy Coming Soon",
  description = "We're putting the finishing touches on our comprehensive training curriculum. The full Academy experience will be available soon."
}: AcademyComingSoonProps) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNotifyMe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // In a real implementation, this would save to database or email service
      setIsSubscribed(true);
      toast.success("You'll be notified when the Academy launches!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[60vh] flex items-center justify-center"
    >
      <div className="max-w-lg mx-auto text-center px-4">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
        >
          <Lock className="w-10 h-10 text-primary" />
        </motion.div>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
          {title}
        </h1>

        <p className="text-muted-foreground mb-6">
          {description}
        </p>

        {releaseDate && (
          <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 mb-8">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">
              Expected Launch: <span className="text-primary">{releaseDate}</span>
            </span>
          </div>
        )}

        {/* What's Coming */}
        <div className="bg-card rounded-xl border border-border p-6 mb-8 text-left">
          <h3 className="font-display text-lg font-bold mb-4">What's Coming</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <span>Level 1: Inner Diamond – Mental mastery and mindset training</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <span>Level 2: Swing Mechanics Mastery – Complete hitting fundamentals</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <span>Level 3: Phase-Based Drill Library – Progressive training system</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <span>Level 4: Baseball IQ & Pro Track – Elite development (Pro/Elite only)</span>
            </li>
          </ul>
        </div>

        {/* Notify Form */}
        {!isSubscribed ? (
          <form onSubmit={handleNotifyMe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <Button type="submit" className="gap-2">
              <Bell className="w-4 h-4" />
              Notify Me
            </Button>
          </form>
        ) : (
          <div className="bg-accent/10 text-accent rounded-lg px-4 py-3 mb-6 inline-flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="text-sm font-medium">You'll be notified when we launch!</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/training-room">
            <Button variant="outline" className="gap-2">
              Explore Community
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost" className="gap-2">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
