import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TimeSlot } from "@/types/booking";

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
  loading?: boolean;
}

export function TimeSlotPicker({
  slots,
  selectedSlot,
  onSelectSlot,
  loading = false,
}: TimeSlotPickerProps) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Available Times
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-10 rounded-lg bg-muted animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  const availableSlots = slots.filter((s) => s.available);
  const unavailableSlots = slots.filter((s) => !s.available);

  if (slots.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Available Times
        </h3>
        <p className="text-muted-foreground text-sm">
          No availability for this date. Please select another day.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Available Times
        <span className="text-sm font-normal text-muted-foreground">
          ({availableSlots.length} available)
        </span>
      </h3>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {slots.map((slot) => {
          const isSelected =
            selectedSlot?.startTime === slot.startTime &&
            selectedSlot?.endTime === slot.endTime;

          return (
            <Button
              key={`${slot.startTime}-${slot.endTime}`}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              disabled={!slot.available}
              onClick={() => slot.available && onSelectSlot(slot)}
              className={cn(
                "h-10 text-sm",
                isSelected && "bg-primary text-primary-foreground",
                !slot.available && "opacity-40 line-through"
              )}
            >
              {formatTime(slot.startTime)}
            </Button>
          );
        })}
      </div>

      {availableSlots.length === 0 && unavailableSlots.length > 0 && (
        <p className="text-sm text-muted-foreground">
          All times are booked. Please select another date.
        </p>
      )}
    </div>
  );
}
