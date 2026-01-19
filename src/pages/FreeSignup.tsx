import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, User, Lock, Mail, Loader2, Gift, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import swingInstituteLogo from "@/assets/swing-institute-logo.png";

export default function FreeSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Sign up with is_free_tier = true
    const { error } = await signUp(email, password, fullName, true);

    if (error) {
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome to the Community!",
        description: "Your free account has been created. Explore the Training Room!",
      });
      navigate("/training-room");
    }

    setIsLoading(false);
  };

  const freeFeatures = [
    "Browse the community feed",
    "See what members are sharing",
    "View upcoming events",
    "Preview the Academy curriculum",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 min-h-screen flex items-center">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="text-center mb-8">
              <Link to="/" className="inline-block mb-6">
                <img 
                  src={swingInstituteLogo}
                  alt="Swing Institute"
                  className="h-16 w-auto mx-auto object-contain"
                />
              </Link>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                <Gift className="w-4 h-4" />
                <span className="text-sm font-medium">Free Access</span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                JOIN THE <span className="text-primary">COMMUNITY</span>
              </h1>
              <p className="text-muted-foreground">
                Get a taste of the Training Room — free forever
              </p>
            </div>

            {/* Free Features */}
            <div className="bg-card/50 border border-border rounded-xl p-4 mb-6">
              <p className="text-sm font-medium text-foreground mb-3">What you get for free:</p>
              <ul className="space-y-2">
                {freeFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-premium p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 bg-background border-border h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-background border-border h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-background border-border h-12"
                      required
                      minLength={6}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Must be at least 6 characters
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full btn-hero h-12"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Get Free Access
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-border text-center">
                <p className="text-muted-foreground text-sm">
                  Already a member?{" "}
                  <Link to="/login" className="text-primary hover:text-primary/80 font-medium">
                    Sign in
                  </Link>
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  Ready for full access?{" "}
                  <Link to="/checkout" className="text-secondary hover:text-secondary/80 font-medium">
                    View plans
                  </Link>
                </p>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-6">
              By creating an account, you agree to our{" "}
              <Link to="/terms" className="text-secondary">Terms of Service</Link>
              {" "}and{" "}
              <Link to="/privacy" className="text-secondary">Privacy Policy</Link>
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
