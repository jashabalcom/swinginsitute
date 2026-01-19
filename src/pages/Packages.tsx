import { motion } from "framer-motion";
import { ArrowLeft, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useBooking } from "@/hooks/useBooking";
import { PackageCard } from "@/components/booking/PackageCard";
import { UserPackageCard } from "@/components/booking/UserPackageCard";
import { LESSON_PACKAGES } from "@/config/stripe";

export default function Packages() {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const { packages, createCheckout } = useBooking();

  const isMember = profile?.membership_tier && profile.membership_tier !== "starter";

  const handlePurchase = async (priceId: string) => {
    if (!user) {
      toast({ title: "Please sign in", description: "You need to be signed in to purchase." });
      return;
    }

    const { url, error } = await createCheckout(priceId, "payment");
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
      return;
    }
    if (url) window.location.href = url;
  };

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
              Save on private lessons with our packages. Credits never expire while your package is active.
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

          {/* Available Packages */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">
              Available Packages
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {LESSON_PACKAGES.map((pkg, index) => (
                <PackageCard
                  key={pkg.priceId}
                  name={pkg.name}
                  sessions={pkg.sessions}
                  basePrice={pkg.basePrice}
                  memberPrice={pkg.memberPrice}
                  savings={pkg.savings}
                  validityDays={pkg.validityDays}
                  isMember={isMember}
                  onPurchase={() => handlePurchase(pkg.priceId)}
                  popular={index === 1}
                />
              ))}
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
