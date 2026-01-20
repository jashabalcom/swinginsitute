import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, Phone, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationBell } from "@/components/community/NotificationBell";
import swingInstituteLogo from "@/assets/swing-institute-logo.png";

const navLinks = [
  { name: "Train Online", href: "/train-online" },
  { name: "Train in Atlanta", href: "/train-atlanta" },
  { name: "Hybrid", href: "/hybrid" },
  { name: "About", href: "/about" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Utility Bar */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-9 text-sm">
            {/* Phone & Location */}
            <div className="flex items-center gap-4">
              <a 
                href="tel:7707620990" 
                className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">(770) 762-0990</span>
              </a>
              <div className="hidden md:flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span>Atlanta, GA</span>
              </div>
            </div>
            
            {/* Book a Call CTA */}
            <Link 
              to="/book-call" 
              className="flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors px-3 py-1 rounded-full"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Book a Parent Call</span>
              <span className="sm:hidden">Book Call</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <div className="bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={swingInstituteLogo}
              alt="Swing Institute"
              className="h-10 md:h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.href} className="nav-link">
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                <NotificationBell />
                <Link to="/dashboard">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-foreground hover:text-primary">
                    Login
                  </Button>
                </Link>
                <Link to="/masterclass">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                    Watch Masterclass
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-card border-t border-border"
          >
            <nav className="container mx-auto px-6 py-6 flex flex-col space-y-4">
              {/* Phone Number Row */}
              <a 
                href="tel:7707620990" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                <Phone className="w-4 h-4" />
                <span>(770) 762-0990</span>
              </a>
              
              {/* Book a Call CTA */}
              <Link 
                to="/book-call" 
                className="flex items-center justify-center gap-2 bg-primary/10 text-primary font-medium py-3 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                <Calendar className="w-4 h-4" />
                <span>Book a Parent Call</span>
              </Link>
              
              <div className="border-t border-border/50 pt-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="nav-link py-3 block"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              
              <div className="pt-4 border-t border-border flex flex-col space-y-3">
                {user ? (
                  <>
                    <div className="flex justify-center">
                      <NotificationBell />
                    </div>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link to="/masterclass" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        Watch Masterclass
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
