import { motion } from "framer-motion";
import { ArrowLeft, Package, Sparkles, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useBooking } from "@/hooks/useBooking";
import { UserPackageCard } from "@/components/booking/UserPackageCard";
import { LESSON_PACKAGES, STRIPE_PRICES } from "@/config/stripe";
import { Button } from "@/components/ui/button";

export default function Packages() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { packages, createCheckout } = useBooking();

  const isMember = profile?.membership_tier && profile.membership_tier !== "starter";

  const handlePurchase = async (priceId: string) => {
    if (!user) {
      // Redirect to login with return URL
      navigate(`/login?redirect=${encodeURIComponent('/packages')}`);
      return;
    }

    const { url, error } = await createCheckout(priceId, "payment");
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
      return;
    }
    if (url) window.location.href = url;
  };

  // All packages including single
  const allPackages = [
    {
      ...STRIPE_PRICES.SINGLE_LESSON,
      savings: 0,
      validityDays: 30,
      perSession: STRIPE_PRICES.SINGLE_LESSON.basePrice,
      popular: false,
      isSingle: true,
    },
    {
      ...STRIPE_PRICES.PACKAGE_3,
      perSession: Math.round(STRIPE_PRICES.PACKAGE_3.basePrice / 3),
      popular: false,
      isSingle: false,
    },
    {
      ...STRIPE_PRICES.PACKAGE_6,
      perSession: Math.round(STRIPE_PRICES.PACKAGE_6.basePrice / 6),
      popular: true,
      isSingle: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link to="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">
              Lesson Packages
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Save on private lessons with our packages. The more you commit, the more you save.
            </p>
          </motion.div>

          {/* User's Current Packages */}
          {packages.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Package className="w-6 h-6 text-primary" />
                Your Active Packages
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {packages.map((pkg) => (
                  <UserPackageCard key={pkg.id} pkg={pkg} onUseCredits={() => window.location.href = "/book"} />
                ))}
              </div>
            </motion.section>
          )}

          {/* Comparison Table */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">
              Choose Your Package
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {allPackages.map((pkg, index) => {
                const price = isMember ? pkg.memberPrice : pkg.basePrice;
                const perSession = isMember 
                  ? Math.round(pkg.memberPrice / pkg.sessions)
                  : pkg.perSession;
                
                return (
                  <motion.div
                    key={pkg.priceId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative rounded-2xl border p-6 flex flex-col ${
                      pkg.popular
                        ? "border-primary bg-card glow-red"
                        : "border-border bg-card/50"
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Best Value
                        </span>
                      </div>
                    )}

                    <div className="mb-4">
                      <h3 className="font-display text-xl font-bold text-foreground mb-1">
                        {pkg.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {pkg.sessions} {pkg.sessions === 1 ? "session" : "sessions"}
                      </p>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="font-display text-3xl font-bold text-foreground">
                          ${price}
                        </span>
                        {isMember && !pkg.isSingle && (
                          <span className="text-sm text-muted-foreground line-through ml-2">
                            ${pkg.basePrice}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        ${perSession}/session
                      </p>
                    </div>

                    {pkg.savings > 0 && (
                      <div className="mb-4">
                        <span className="inline-block bg-accent/20 text-accent text-sm font-semibold px-3 py-1 rounded-full">
                          Save ${pkg.savings}
                        </span>
                      </div>
                    )}

                    <ul className="space-y-2 mb-6 flex-1">
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-accent flex-shrink-0" />
                        <span>Valid for {pkg.validityDays} days</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-accent flex-shrink-0" />
                        <span>60-min private sessions</span>
                      </li>
                      {pkg.sessions >= 3 && (
                        <li className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-accent flex-shrink-0" />
                          <span>Priority booking</span>
                        </li>
                      )}
                      {pkg.sessions >= 6 && (
                        <li className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-accent flex-shrink-0" />
                          <span>Progress tracking</span>
                        </li>
                      )}
                    </ul>

                    <Button
                      onClick={() => handlePurchase(pkg.priceId)}
                      className={`w-full ${
                        pkg.popular
                          ? "bg-primary hover:bg-primary/90"
                          : "bg-transparent border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                      }`}
                    >
                      {pkg.sessions === 1 ? "Book Session" : "Buy Package"}
                    </Button>
                  </motion.div>
                );
              })}
            </div>

            {/* Member discount note */}
            {!isMember && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 text-center"
              >
                <p className="text-sm text-muted-foreground">
                  <Link to="/upgrade" className="text-primary hover:underline font-medium">
                    Become a member
                  </Link>
                  {" "}to unlock discounted rates on all packages
                </p>
              </motion.div>
            )}
          </motion.section>
        </div>
      </main>
    </div>
  );
}
