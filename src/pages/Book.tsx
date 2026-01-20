import { useState, useEffect } from "react";
import { format, addMinutes } from "date-fns";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Package, CreditCard, Brain, Sparkles } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useBooking } from "@/hooks/useBooking";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { TimeSlotPicker } from "@/components/booking/TimeSlotPicker";
import { ServiceCard } from "@/components/booking/ServiceCard";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { STRIPE_PRICES } from "@/config/stripe";
import { supabase } from "@/integrations/supabase/client";
import type { TimeSlot } from "@/types/booking";

type BookingType = "lesson" | "mindset";

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

  const [bookingType, setBookingType] = useState<BookingType>("lesson");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"package" | "direct_pay">("direct_pay");
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [coachId, setCoachId] = useState<string | undefined>(undefined);

  const isMember = profile?.membership_tier && profile.membership_tier !== "starter";
  const currentOption = BOOKING_OPTIONS[bookingType];
  const price = isMember ? currentOption.memberPrice : currentOption.basePrice;

  // Get total package credits
  const totalCredits = packages.reduce((sum, pkg) => sum + pkg.sessions_remaining, 0);

  // Auto-select package payment if user has credits
  useEffect(() => {
    if (packages.length > 0 && !selectedPackageId) {
      const firstPackage = packages[0];
      setPaymentMethod("package");
      setSelectedPackageId(firstPackage.id);
    }
  }, [packages, selectedPackageId]);

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

  const handleBookSession = async () => {
    if (!selectedDate || !selectedSlot || !user) return;

    setBookingLoading(true);

    try {
      const startTime = new Date(`${format(selectedDate, "yyyy-MM-dd")}T${selectedSlot.startTime}:00`);
      const endTime = addMinutes(startTime, currentOption.duration);

      if (paymentMethod === "package" && selectedPackageId && coachId) {
        // Book using package credits
        const { error } = await createBooking({
          serviceTypeId: bookingType,
          coachId: coachId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          paymentMethod: "package",
          purchasedPackageId: selectedPackageId,
        });

        if (error) throw new Error(error);

        toast({ title: "Session booked!", description: `1 credit has been used from your package for ${currentOption.name}.` });
        navigate("/my-bookings?success=true");
      } else {
        // Pay directly via Stripe
        const { url, error } = await createCheckout(STRIPE_PRICES.SINGLE_LESSON.priceId, "payment");
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

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-12 container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Sign in to book a session</h1>
          <Link to="/login">
            <Button>Sign In</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link to="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Book a Session
            </h1>
            <p className="text-muted-foreground">
              Choose your session type and schedule time with Coach Jasha
            </p>
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
                    memberPrice={BOOKING_OPTIONS.lesson.memberPrice}
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
                            <div className="p-2 rounded-lg bg-accent/20">
                              <Package className="w-5 h-5 text-accent" />
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
                          <span className="font-display text-xl font-bold text-accent">
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
                          <div className="p-2 rounded-lg bg-primary/20">
                            <CreditCard className="w-5 h-5 text-primary" />
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
                        <span className="font-display text-xl font-bold text-foreground">
                          ${price}
                        </span>
                      </div>
                    </button>

                    {/* Upsell to packages */}
                    {packages.length === 0 && (
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
                  price={price}
                  selectedDate={selectedDate}
                  selectedSlot={selectedSlot}
                  paymentMethod={paymentMethod}
                  packageCredits={totalCredits}
                  onConfirm={handleBookSession}
                  loading={bookingLoading}
                  disabled={!selectedDate || !selectedSlot}
                />

                {/* Quick package purchase */}
                {packages.length === 0 && (
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
    </div>
  );
}
