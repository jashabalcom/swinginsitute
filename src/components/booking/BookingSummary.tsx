import { format } from "date-fns";
import { Calendar, Clock, CreditCard, Package, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TimeSlot } from "@/types/booking";

interface BookingSummaryProps {
  serviceName: string;
  duration: number;
  price: number;
  selectedDate: Date | null;
  selectedSlot: TimeSlot | null;
  paymentMethod: "package" | "direct_pay";
  packageCredits?: number;
  onConfirm: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function BookingSummary({
  serviceName,
  duration,
  price,
  selectedDate,
  selectedSlot,
  paymentMethod,
  packageCredits,
  onConfirm,
  loading,
  disabled,
}: BookingSummaryProps) {
  const isComplete = selectedDate && selectedSlot;

  // Format time to 12-hour format
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  return (
    <div className="card-premium p-6 sticky top-24">
      <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-primary" />
        Booking Summary
      </h3>

      <div className="space-y-4 mb-6">
        {/* Service */}
        <div className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="font-medium text-foreground">{serviceName}</div>
            <div className="text-muted-foreground">{duration} minutes</div>
          </div>
        </div>

        {/* Date & Time */}
        {selectedDate && (
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <div className="font-medium text-foreground">
                {format(selectedDate, "EEEE, MMMM d")}
              </div>
              <div className="text-muted-foreground">
                {selectedSlot ? formatTime(selectedSlot.startTime) : "Select a time"}
              </div>
            </div>
          </div>
        )}

        {/* Payment Method */}
        <div className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            {paymentMethod === "package" ? (
              <Package className="w-4 h-4 text-accent" />
            ) : (
              <CreditCard className="w-4 h-4 text-accent" />
            )}
          </div>
          <div>
            <div className="font-medium text-foreground">
              {paymentMethod === "package" ? "Using Package Credit" : "Pay Now"}
            </div>
            <div className="text-muted-foreground">
              {paymentMethod === "package"
                ? `${packageCredits} credits remaining`
                : `$${price}`}
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border my-4" />

      {/* Total */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-muted-foreground">Total</span>
        <span className="font-display text-2xl font-bold text-foreground">
          {paymentMethod === "package" ? "1 Credit" : `$${price}`}
        </span>
      </div>

      {/* Confirm Button */}
      <Button
        onClick={onConfirm}
        disabled={disabled || !isComplete}
        className="w-full bg-primary hover:bg-primary/90 h-12 text-base font-semibold"
      >
        {loading ? "Processing..." : isComplete ? "Confirm Booking" : "Select Date & Time"}
      </Button>

      {!isComplete && (
        <p className="text-xs text-muted-foreground text-center mt-3">
          Choose a date and time slot to continue
        </p>
      )}
    </div>
  );
}
