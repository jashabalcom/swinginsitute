import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { email });
  };

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
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                MEMBER <span className="text-primary">LOGIN</span>
              </h1>
              <p className="text-muted-foreground">
                Access your training dashboard
              </p>
            </div>

            <div className="card-premium p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-muted-foreground">
                    <input type="checkbox" className="rounded border-border" />
                    Remember me
                  </label>
                  <a href="#" className="text-secondary hover:text-secondary/80">
                    Forgot password?
                  </a>
                </div>

                <Button type="submit" className="w-full btn-hero h-12">
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-border text-center">
                <p className="text-muted-foreground text-sm">
                  Not a member yet?{" "}
                  <Link to="/train-online" className="text-primary hover:text-primary/80 font-medium">
                    Join the Swing Institute
                  </Link>
                </p>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Having trouble? Contact{" "}
              <a href="mailto:support@swinginstitutebaseball.com" className="text-secondary">
                support@swinginstitutebaseball.com
              </a>
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
