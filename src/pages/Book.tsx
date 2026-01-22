import { useState, useEffect } from "react";
import { format, addMinutes } from "date-fns";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Package, CreditCard, Brain, Sparkles, Zap, Mail } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useBooking } from "@/hooks/useBooking";
import { useHybridCredits } from "@/hooks/useHybridCredits";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { TimeSlotPicker } from "@/components/booking/TimeSlotPicker";
import { ServiceCard } from "@/components/booking/ServiceCard";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { STRIPE_PRICES } from "@/config/stripe";
import { supabase } from "@/integrations/supabase/client";
import { trackSchedule, trackViewContent } from "@/lib/tracking";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { TimeSlot } from "@/types/booking";

type BookingType = "lesson" | "mindset";
type PaymentMethod = "hybrid_credit" | "package" | "direct_pay";

// Map booking type to actual service_type UUIDs from the database
const SERVICE_TYPE_IDS: Record<BookingType, string> = {
  lesson: "d7affa87-8c8b-43ca-a78a-f0dff75c4f0a",
  mindset: "047d0ee4-fba5-43d5-bc1a-8d317d3da99c",
};

const BOOKING_OPTIONS = {
  lesson: {
    name: "Private Lesson",
    duration: 60,
    basePrice: 145,
    memberPrice: 115,
    description: "60-minute swing session with video analysis and personalized drills",
  },
  mindset: {
    name: "Mindset Coaching",
    duration: 30,
    basePrice: 75,
    memberPrice: 75,
    description: "30-minute mental game session focusing on confidence and focus",
  },
};

export default function Book() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const { packages, getAvailability, createBooking, createCheckout, loading } = useBooking();
  const { hybridCreditsRemaining, isHybridMember, hasHybridCredits, maxHybridCredits } = useHybridCredits();

  const [bookingType, setBookingType] = useState<BookingType>("lesson");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("direct_pay");
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [coachId, setCoachId] = useState<string | undefined>(undefined);
  const [guestEmail, setGuestEmail] = useState("");
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailError, setEmailError] = useState("");

  const isMember = profile?.membership_tier && !["starter", "community", null].includes(profile.membership_tier);
  const currentOption = BOOKING_OPTIONS[bookingType];
  const price = isMember ? currentOption.memberPrice : currentOption.basePrice;
  const lessonRate = profile?.lesson_rate ?? 145;

  // Get total package credits
  const totalCredits = packages.reduce((sum, pkg) => sum + pkg.sessions_remaining, 0);

  // Auto-select best payment method: hybrid credits first, then packages, then direct pay
  useEffect(() => {
    if (hasHybridCredits && bookingType === "lesson") {
      setPaymentMethod("hybrid_credit");
      setSelectedPackageId(null);
    } else if (packages.length > 0) {
      setPaymentMethod("package");
      setSelectedPackageId(packages[0].id);
    } else {
      setPaymentMethod("direct_pay");
      setSelectedPackageId(null);
    }
  }, [packages, hasHybridCredits, bookingType]);

  // Fetch the coach ID from user_roles table
  useEffect(() => {
    const fetchCoach = async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("user_id")
        .in("role", ["admin", "coach"])
        .limit(1)
        .maybeSingle();
      
      if (data?.user_id) {
        setCoachId(data.user_id);
      }
    };
    fetchCoach();
  }, []);

  // Check for success param
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast({ title: "Booking confirmed!", description: "Your session has been booked." });
    }
  }, [searchParams, toast]);

  // Fetch availability when date changes
  useEffect(() => {
    if (selectedDate) {
      setLoadingSlots(true);
      setSelectedSlot(null);
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      getAvailability(dateStr, coachId)
        .then(setSlots)
        .finally(() => setLoadingSlots(false));
    }
  }, [selectedDate, coachId, getAvailability]);

  // Reset slot when booking type changes
  useEffect(() => {
    setSelectedSlot(null);
  }, [bookingType]);

  const handleBookSession = async (emailOverride?: string) => {
    if (!selectedDate || !selectedSlot) return;

    // For credit-based payments, require login
    if ((paymentMethod === "hybrid_credit" || paymentMethod === "package") && !user) {
      navigate(`/login?redirect=${encodeURIComponent('/book')}`);
      return;
    }

    // For guest direct pay, require email
    if (paymentMethod === "direct_pay" && !user) {
      const emailToUse = emailOverride || guestEmail;
      if (!emailToUse) {
        setShowEmailDialog(true);
        return;
      }
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailToUse)) {
        setEmailError("Please enter a valid email address");
        setShowEmailDialog(true);
        return;
      }
    }

    setBookingLoading(true);

    try {
      const startTime = new Date(`${format(selectedDate, "yyyy-MM-dd")}T${selectedSlot.startTime}:00`);
      const endTime = addMinutes(startTime, currentOption.duration);

      if (paymentMethod === "hybrid_credit" && coachId && user) {
        // Book using hybrid membership credits
        const { error } = await createBooking({
          serviceTypeId: SERVICE_TYPE_IDS[bookingType],
          coachId: coachId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          paymentMethod: "hybrid_credit",
        });

        if (error) throw new Error(error);

        // Track Schedule event for Meta Pixel
        trackSchedule(currentOption.name, currentOption.memberPrice);

        toast({ 
          title: "Session booked!", 
          description: `Membership credit used (${hybridCreditsRemaining - 1} remaining this month).` 
        });
        navigate("/my-bookings?success=true");
      } else if (paymentMethod === "package" && selectedPackageId && coachId && user) {
        // Book using package credits
        const { error } = await createBooking({
          serviceTypeId: SERVICE_TYPE_IDS[bookingType],
          coachId: coachId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          paymentMethod: "package",
          purchasedPackageId: selectedPackageId,
        });

        if (error) throw new Error(error);

        // Track Schedule event for Meta Pixel
        trackSchedule(currentOption.name, currentOption.memberPrice);

        toast({ title: "Session booked!", description: `1 credit has been used from your package for ${currentOption.name}.` });
        navigate("/my-bookings?success=true");
      } else {
        // Pay directly via Stripe (works for guests and logged-in users)
        const customerEmail = user?.email || guestEmail || emailOverride;
        const { url, error } = await createCheckout(STRIPE_PRICES.SINGLE_LESSON.priceId, "payment", customerEmail);
        if (error) throw new Error(error);
        if (url) window.location.href = url;
      }
    } catch (err) {
      toast({
        title: "Booking failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const handleEmailSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!guestEmail || !emailRegex.test(guestEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError("");
    setShowEmailDialog(false);
    handleBookSession(guestEmail);
  };

  // Guest mode: Allow viewing but redirect credit-based payments to login
  const isGuest = !user;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link 
            to={user ? "/dashboard" : "/train-atlanta"} 
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {user ? "Back to Dashboard" : "Back to Train Atlanta"}
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Book a Session
            </h1>
            <p className="text-muted-foreground">
              Choose your session type and schedule time with Coach Jasha
            </p>
            
            {/* Member Rate Badge */}
            {isMember && (
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 border border-accent/30">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">
                  Member Rate: ${lessonRate}/hr (Save ${145 - lessonRate})
                </span>
              </div>
            )}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Service Selection */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                  1. Choose Your Session
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <ServiceCard
                    name={BOOKING_OPTIONS.lesson.name}
                    description={BOOKING_OPTIONS.lesson.description}
                    duration={BOOKING_OPTIONS.lesson.duration}
                    price={BOOKING_OPTIONS.lesson.basePrice}
                    memberPrice={isMember ? lessonRate : BOOKING_OPTIONS.lesson.memberPrice}
                    isMember={isMember}
                    icon={Calendar}
                    iconColor="text-primary"
                    selected={bookingType === "lesson"}
                    onClick={() => setBookingType("lesson")}
                  />
                  <ServiceCard
                    name={BOOKING_OPTIONS.mindset.name}
                    description={BOOKING_OPTIONS.mindset.description}
                    duration={BOOKING_OPTIONS.mindset.duration}
                    price={BOOKING_OPTIONS.mindset.basePrice}
                    memberPrice={BOOKING_OPTIONS.mindset.memberPrice}
                    isMember={isMember}
                    icon={Brain}
                    iconColor="text-secondary"
                    selected={bookingType === "mindset"}
                    onClick={() => setBookingType("mindset")}
                  />
                </div>
              </motion.section>

              {/* Calendar Selection */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                  2. Select Date
                </h2>
                <div className="card-premium p-6">
                  <BookingCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
                </div>
              </motion.section>

              {/* Time Selection */}
              {selectedDate && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                    3. Pick a Time
                  </h2>
                  <div className="card-premium p-6">
                    <TimeSlotPicker
                      slots={slots}
                      selectedSlot={selectedSlot}
                      onSelectSlot={setSelectedSlot}
                      loading={loadingSlots}
                    />
                  </div>
                </motion.section>
              )}

              {/* Payment Method (only show when date and slot selected) */}
              {selectedDate && selectedSlot && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                    4. Payment Method
                  </h2>
                  <div className="card-premium p-6 space-y-4">
                    {/* Hybrid Credits Option - Only for lessons */}
                    {isHybridMember && bookingType === "lesson" && (
                      <button
                        onClick={() => {
                          setPaymentMethod("hybrid_credit");
                          setSelectedPackageId(null);
                        }}
                        disabled={!hasHybridCredits}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          paymentMethod === "hybrid_credit"
                            ? "border-accent bg-accent/10"
                            : hasHybridCredits 
                              ? "border-border hover:border-accent/50"
                              : "border-border opacity-50 cursor-not-allowed"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-accent/20">
                              <Zap className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                              <div className="font-semibold text-foreground flex items-center gap-2">
                                Use Membership Credit
                                {hasHybridCredits && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent">
                                    Recommended
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {hybridCreditsRemaining} of {maxHybridCredits} credits remaining this month
                              </div>
                            </div>
                          </div>
                          <span className="font-display text-xl font-bold text-accent">
                            Included
                          </span>
                        </div>
                      </button>
                    )}

                    {/* Package Credits Option */}
                    {packages.length > 0 && (
                      <button
                        onClick={() => {
                          setPaymentMethod("package");
                          setSelectedPackageId(packages[0].id);
                        }}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          paymentMethod === "package"
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/20">
                              <Package className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-semibold text-foreground">
                                Use Package Credit
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {totalCredits} credit{totalCredits !== 1 ? "s" : ""} available
                              </div>
                            </div>
                          </div>
                          <span className="font-display text-xl font-bold text-primary">
                            1 Credit
                          </span>
                        </div>
                      </button>
                    )}

                    {/* Direct Pay Option */}
                    <button
                      onClick={() => {
                        setPaymentMethod("direct_pay");
                        setSelectedPackageId(null);
                      }}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === "direct_pay"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-muted">
                            <CreditCard className="w-5 h-5 text-foreground" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">
                              Pay Now
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {currentOption.name} - {currentOption.duration} min
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {isMember && bookingType === "lesson" ? (
                            <div>
                              <span className="text-sm text-muted-foreground line-through">${BOOKING_OPTIONS.lesson.basePrice}</span>
                              <span className="font-display text-xl font-bold text-foreground ml-2">
                                ${lessonRate}
                              </span>
                            </div>
                          ) : (
                            <span className="font-display text-xl font-bold text-foreground">
                              ${price}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Upsell to packages */}
                    {packages.length === 0 && !isHybridMember && (
                      <div className="mt-4 p-4 rounded-xl bg-accent/10 border border-accent/20">
                        <div className="flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              Save up to $145 with a package
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Get our 6-Session Pack for just $121/lesson
                            </p>
                            <Link
                              to="/packages"
                              className="text-xs text-primary font-medium hover:underline mt-2 inline-block"
                            >
                              View Packages →
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Upsell to Hybrid for frequent bookers */}
                    {!isHybridMember && packages.length > 0 && (
                      <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20">
                        <div className="flex items-start gap-3">
                          <Zap className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              Upgrade to Hybrid for included sessions
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Get 1-2 in-person sessions per month included with your membership
                            </p>
                            <Link
                              to="/upgrade"
                              className="text-xs text-accent font-medium hover:underline mt-2 inline-block"
                            >
                              View Hybrid Plans →
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.section>
              )}
            </div>

            {/* Sidebar - Booking Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <BookingSummary
                  serviceName={currentOption.name}
                  duration={currentOption.duration}
                  price={paymentMethod === "hybrid_credit" ? 0 : (paymentMethod === "package" ? 0 : price)}
                  selectedDate={selectedDate}
                  selectedSlot={selectedSlot}
                  paymentMethod={paymentMethod === "hybrid_credit" ? "package" : paymentMethod}
                  packageCredits={paymentMethod === "hybrid_credit" ? hybridCreditsRemaining : totalCredits}
                  onConfirm={handleBookSession}
                  loading={bookingLoading}
                  disabled={!selectedDate || !selectedSlot}
                />

                {/* Credits Summary */}
                {(isHybridMember || packages.length > 0) && (
                  <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border">
                    <h4 className="font-semibold text-foreground mb-3">Your Credits</h4>
                    <div className="space-y-2 text-sm">
                      {isHybridMember && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Membership Credits</span>
                          <span className="font-medium text-accent">{hybridCreditsRemaining}/{maxHybridCredits}</span>
                        </div>
                      )}
                      {packages.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Package Credits</span>
                          <span className="font-medium text-primary">{totalCredits}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Quick package purchase */}
                {packages.length === 0 && !isHybridMember && (
                  <div className="mt-6 text-center">
                    <Link
                      to="/packages"
                      className="text-sm text-primary hover:underline font-medium"
                    >
                      Buy a package and save →
                    </Link>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Guest Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Enter Your Email
            </DialogTitle>
            <DialogDescription>
              We'll send your booking confirmation and receipt to this email address.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="guest-email">Email Address</Label>
              <Input
                id="guest-email"
                type="email"
                placeholder="you@example.com"
                value={guestEmail}
                onChange={(e) => {
                  setGuestEmail(e.target.value);
                  setEmailError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleEmailSubmit();
                  }
                }}
                className={emailError ? "border-destructive" : ""}
              />
              {emailError && (
                <p className="text-sm text-destructive">{emailError}</p>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowEmailDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEmailSubmit}
                disabled={bookingLoading}
                className="flex-1"
              >
                {bookingLoading ? "Processing..." : "Continue to Payment"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Already have an account?{" "}
              <Link to={`/login?redirect=${encodeURIComponent('/book')}`} className="text-primary hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}