import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function MobileCTABar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero section (approx 600px)
      setIsVisible(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
        >
          <div className="bg-card/95 backdrop-blur-lg border-t border-border/60 px-4 py-3 pb-safe shadow-2xl shadow-black/50">
            <div className="flex items-center gap-3 max-w-lg mx-auto">
              {/* Phone Button */}
              <a
                href="tel:7707620990"
                className="flex items-center justify-center gap-2 flex-1 h-12 rounded-xl bg-card border border-border/60 text-foreground font-medium hover:bg-muted transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>Call</span>
              </a>

              {/* Book a Call Button */}
              <Link to="/book-call" className="flex-[2]">
                <Button className="w-full h-12 btn-hero text-base">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book a Parent Call
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
