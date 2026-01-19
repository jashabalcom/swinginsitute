import { useState, useEffect } from "react";
import { format, addMinutes } from "date-fns";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Package, CreditCard } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useBooking } from "@/hooks/useBooking";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { TimeSlotPicker } from "@/components/booking/TimeSlotPicker";
import { UserPackageCard } from "@/components/booking/UserPackageCard";
import { STRIPE_PRICES } from "@/config/stripe";
import type { TimeSlot } from "@/types/booking";

// Placeholder coach ID - in production, fetch from database
const DEFAULT_COACH_ID = "00000000-0000-0000-0000-000000000001";
const LESSON_DURATION = 60;

export default function Book() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const { packages, getAvailability, createBooking, createCheckout, loading } = useBooking();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"package" | "direct_pay">("direct_pay");
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);

  const isMember = profile?.membership_tier && profile.membership_tier !== "starter";
  const lessonPrice = isMember ? 115 : 145;

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
      getAvailability(dateStr, DEFAULT_COACH_ID)
        .then(setSlots)
        .finally(() => setLoadingSlots(false));
    }
  }, [selectedDate, getAvailability]);

  const handleBookSession = async () => {
    if (!selectedDate || !selectedSlot || !user) return;

    setBookingLoading(true);

    try {
      const startTime = new Date(`${format(selectedDate, "yyyy-MM-dd")}T${selectedSlot.startTime}:00`);
      const endTime = addMinutes(startTime, LESSON_DURATION);

      if (paymentMethod === "package" && selectedPackageId) {
        // Book using package credits
        const { error } = await createBooking({
          serviceTypeId: "lesson",
          coachId: DEFAULT_COACH_ID,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          paymentMethod: "package",
          purchasedPackageId: selectedPackageId,
        });

        if (error) throw new Error(error);

        toast({ title: "Session booked!", description: "1 credit has been used from your package." });
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
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Book a Private Lesson
            </h1>
            <p className="text-muted-foreground mb-8">
              60-minute session with Coach Jasha • ${lessonPrice}
              {isMember && <span className="text-primary ml-2">(Member rate)</span>}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Calendar & Time Selection */}
            <div className="lg:col-span-2 space-y-8">
              <div className="card-premium p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-xl font-semibold">Select Date</h2>
                </div>
                <BookingCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
              </div>

              {selectedDate && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-premium p-6">
                  <TimeSlotPicker
                    slots={slots}
                    selectedSlot={selectedSlot}
                    onSelectSlot={setSelectedSlot}
                    loading={loadingSlots}
                  />
                </motion.div>
              )}
            </div>

            {/* Payment Options */}
            <div className="space-y-6">
              {packages.length > 0 && (
                <div className="card-premium p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Package className="w-5 h-5 text-primary" />
                    <h2 className="font-display text-lg font-semibold">Your Packages</h2>
                  </div>
                  <div className="space-y-4">
                    {packages.map((pkg) => (
                      <button
                        key={pkg.id}
                        onClick={() => {
                          setPaymentMethod("package");
                          setSelectedPackageId(pkg.id);
                        }}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          selectedPackageId === pkg.id
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="font-medium">{pkg.sessions_remaining} credits</div>
                        <div className="text-sm text-muted-foreground">
                          Expires {format(new Date(pkg.expires_at), "MMM d")}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="card-premium p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-lg font-semibold">Payment</h2>
                </div>

                <button
                  onClick={() => {
                    setPaymentMethod("direct_pay");
                    setSelectedPackageId(null);
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-all mb-4 ${
                    paymentMethod === "direct_pay"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="font-medium">Pay ${lessonPrice}</div>
                  <div className="text-sm text-muted-foreground">Single session</div>
                </button>

                <Button
                  onClick={handleBookSession}
                  disabled={!selectedDate || !selectedSlot || bookingLoading}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {bookingLoading ? "Processing..." : "Confirm Booking"}
                </Button>

                <Link to="/packages" className="block mt-4 text-center text-sm text-primary hover:underline">
                  Buy a package and save →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
