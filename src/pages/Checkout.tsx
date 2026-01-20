import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, CreditCard, Loader2, Shield } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { MEMBERSHIP_TIERS, type MembershipTier } from "@/config/stripe";
import { toast } from "sonner";
import { trackInitiateCheckout } from "@/lib/tracking";

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [canceled, setCanceled] = useState(false);

  const tierParam = searchParams.get("tier") as MembershipTier | null;
  const tier = tierParam && MEMBERSHIP_TIERS[tierParam] ? tierParam : "pro";
  const selectedTier = MEMBERSHIP_TIERS[tier];

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
    if (searchParams.get("canceled") === "true") {
      setCanceled(true);
      toast.error("Checkout was canceled. Please try again.");
    }
    
    // Track checkout initiation
    trackInitiateCheckout(selectedTier.name, selectedTier.price);
  }, [user, searchParams, selectedTier.name, selectedTier.price]);

  const handleCheckout = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceId: selectedTier.priceId,
          mode: "subscription",
          customerEmail: email,
          metadata: {
            tier,
          },
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Link 
                to="/train-online" 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to plans
              </Link>

              {canceled && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6"
                >
                  <p className="text-destructive text-sm">
                    Your checkout was canceled. You can try again below.
                  </p>
                </motion.div>
              )}

              <div className="grid lg:grid-cols-2 gap-12">
                {/* Order Summary */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                    Complete Your Order
                  </h1>
                  <p className="text-muted-foreground mb-8">
                    Join The Swing Institute and start your player's development journey.
                  </p>

                  <div className="bg-card border border-border rounded-2xl p-6 mb-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-display text-xl font-bold text-foreground">
                          {selectedTier.name} Membership
                        </h3>
                        <p className="text-sm text-muted-foreground">Monthly subscription</p>
                      </div>
                      <div className="text-right">
                        <span className="font-display text-2xl font-bold text-foreground">
                          ${selectedTier.price}
                        </span>
                        <span className="text-muted-foreground">/mo</span>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4">
                      <h4 className="text-sm font-semibold text-foreground mb-3">What's included:</h4>
                      <ul className="space-y-2">
                        {selectedTier.features.slice(0, 4).map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Other tier options */}
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Want a different plan?</p>
                    <div className="flex gap-2 justify-center flex-wrap">
                      {(Object.keys(MEMBERSHIP_TIERS) as MembershipTier[])
                        .filter(t => !t.includes("hybrid") && t !== tier)
                        .map((t) => (
                          <Link
                            key={t}
                            to={`/checkout?tier=${t}`}
                            className="text-sm text-secondary hover:underline"
                          >
                            {MEMBERSHIP_TIERS[t].name} (${MEMBERSHIP_TIERS[t].price}/mo)
                          </Link>
                        ))}
                    </div>
                  </div>
                </motion.div>

                {/* Checkout Form */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="bg-card border border-border rounded-2xl p-8">
                    <div className="flex items-center gap-2 mb-6">
                      <CreditCard className="w-5 h-5 text-secondary" />
                      <h2 className="font-display text-xl font-bold">Payment Details</h2>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="mt-1"
                          disabled={!!user?.email}
                        />
                        {user?.email && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Using your account email
                          </p>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={handleCheckout}
                      disabled={isLoading || !email}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Continue to Payment
                          <CreditCard className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                      <Shield className="w-4 h-4" />
                      <span>Secure checkout powered by Stripe</span>
                    </div>

                    <p className="text-xs text-center text-muted-foreground mt-4">
                      By continuing, you agree to our{" "}
                      <Link to="/terms" className="underline hover:text-foreground">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="underline hover:text-foreground">
                        Privacy Policy
                      </Link>
                    </p>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Questions? <Link to="/masterclass" className="text-secondary hover:underline">Book a Parent Call</Link>
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
