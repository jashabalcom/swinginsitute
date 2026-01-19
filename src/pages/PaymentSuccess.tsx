import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Mail, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [isNewUser, setIsNewUser] = useState(false);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Check if user needs to set up their account
    if (!user) {
      setIsNewUser(true);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-10 h-10 text-accent" />
              </motion.div>

              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Welcome to <span className="gradient-text-red">The Swing Institute!</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8">
                Your payment was successful. You're now part of an elite training program 
                that has developed MLB All-Stars.
              </p>

              {isNewUser ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-card border border-border rounded-2xl p-8 mb-8"
                >
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Mail className="w-5 h-5 text-secondary" />
                    <h2 className="font-display text-xl font-bold">Check Your Email</h2>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    We've sent you an email to set up your account password. 
                    Click the link in the email to complete your account setup and access your training.
                  </p>

                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                    <p className="text-sm text-accent">
                      <strong>Tip:</strong> Check your spam folder if you don't see the email within a few minutes.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-card border border-border rounded-2xl p-8 mb-8"
                >
                  <h2 className="font-display text-xl font-bold mb-4">What's Next?</h2>
                  
                  <div className="grid sm:grid-cols-2 gap-4 text-left">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold">1</span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Complete Onboarding</p>
                        <p className="text-sm text-muted-foreground">Tell us about your player</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold">2</span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Start Phase 1</p>
                        <p className="text-sm text-muted-foreground">Begin your training journey</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold">3</span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Submit Your First Swing</p>
                        <p className="text-sm text-muted-foreground">Get personalized feedback</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold">4</span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Join the Community</p>
                        <p className="text-sm text-muted-foreground">Connect with other players</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <>
                    <Link to="/onboarding">
                      <Button className="btn-hero group">
                        Start Onboarding
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <Link to="/dashboard">
                      <Button variant="outline" className="btn-secondary-outline">
                        Go to Dashboard
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link to="/login">
                    <Button className="btn-hero group">
                      Sign In to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                )}
              </div>

              <p className="text-sm text-muted-foreground mt-8">
                Questions? Email us at{" "}
                <a href="mailto:support@swinginsitute.com" className="text-secondary hover:underline">
                  support@swinginsitute.com
                </a>
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
