import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, CreditCard, Loader2, Shield, Crown } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { MEMBERSHIP_TIERS, type MembershipTier } from "@/config/stripe";
import { toast } from "sonner";

export default function Upgrade() {
  const [searchParams] = useSearchParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<MembershipTier>(
    (searchParams.get("tier") as MembershipTier) || "starter"
  );
  const [isLoading, setIsLoading] = useState(false);

  // Order tiers for display: community, starter, pro, elite
  const tierOrder: MembershipTier[] = ["community", "starter", "pro", "elite"];

  const handleUpgrade = async () => {
    if (!user) {
      toast.error("Please log in to upgrade");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      const tier = MEMBERSHIP_TIERS[selectedTier];
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceId: tier.priceId,
          mode: "subscription",
          customerEmail: user.email,
          successUrl: `${window.location.origin}/payment-success?upgraded=true`,
          cancelUrl: `${window.location.origin}/upgrade?canceled=true`,
          metadata: {
            tier: selectedTier,
            upgrade: "true",
          },
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      toast.error("Failed to start upgrade. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const tiers = tierOrder.filter(
    (t) => !t.includes("hybrid") && MEMBERSHIP_TIERS[t]
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Link 
                to="/dashboard" 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-4">
                  <Crown className="w-4 h-4" />
                  <span className="text-sm font-medium">Unlock Full Access</span>
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  Upgrade Your Membership
                </h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Get full access to the community, personalized coaching feedback, 
                  and exclusive training content.
                </p>
              </motion.div>

              {/* Tier Selection */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {tiers.map((tier, index) => {
                  const tierData = MEMBERSHIP_TIERS[tier];
                  const isSelected = selectedTier === tier;
                  const isCommunity = tier === "community";
                  
                  return (
                    <motion.button
                      key={tier}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedTier(tier)}
                      className={`relative p-5 rounded-2xl border-2 text-left transition-all ${
                        isSelected
                          ? "border-secondary bg-secondary/5"
                          : "border-border hover:border-muted-foreground/50"
                      }`}
                    >
                      {tier === "pro" && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                          Most Popular
                        </span>
                      )}
                      {isCommunity && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-muted text-muted-foreground text-xs font-semibold px-3 py-1 rounded-full">
                          Entry Level
                        </span>
                      )}
                      
                      <h3 className="font-display text-lg font-bold mb-1">
                        {tierData.name}
                      </h3>
                      <div className="flex items-baseline gap-1 mb-3">
                        <span className="font-display text-2xl font-bold">
                          ${tierData.price}
                        </span>
                        <span className="text-muted-foreground text-sm">/mo</span>
                      </div>
                      
                      <ul className="space-y-1.5">
                        {tierData.features.slice(0, isCommunity ? 4 : 3).map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs">
                            <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${
                              isSelected ? "text-secondary" : "text-muted-foreground"
                            }`} />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle2 className="w-5 h-5 text-secondary" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Upgrade Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card border border-border rounded-2xl p-8 text-center"
              >
                <h2 className="font-display text-xl font-bold mb-2">
                  {MEMBERSHIP_TIERS[selectedTier].name} Membership
                </h2>
                <p className="text-muted-foreground mb-6">
                  ${MEMBERSHIP_TIERS[selectedTier].price}/month • Cancel anytime
                </p>

                <Button
                  onClick={handleUpgrade}
                  disabled={isLoading}
                  size="lg"
                  className="w-full max-w-md bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Upgrade Now
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Secure checkout powered by Stripe</span>
                </div>

                <p className="text-xs text-muted-foreground mt-4">
                  By upgrading, you agree to our{" "}
                  <Link to="/terms" className="underline hover:text-foreground">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="underline hover:text-foreground">
                    Privacy Policy
                  </Link>
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
