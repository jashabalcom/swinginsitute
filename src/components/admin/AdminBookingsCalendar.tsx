import { useState } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Booking } from "@/types/booking";

interface AdminBookingsCalendarProps {
  bookings: Booking[];
  onUpdateStatus: (id: string, status: Booking["status"]) => Promise<{ error: string | null }>;
}

const statusColors: Record<Booking["status"], string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  confirmed: "bg-green-500/10 text-green-600 border-green-500/20",
  completed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
  no_show: "bg-gray-500/10 text-gray-600 border-gray-500/20",
};

export function AdminBookingsCalendar({
  bookings,
  onUpdateStatus,
}: AdminBookingsCalendarProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 0 })
  );
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const days = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const getBookingsForDay = (date: Date) =>
    bookings.filter((b) => isSameDay(new Date(b.start_time), date));

  const goToPreviousWeek = () => setCurrentWeekStart(addDays(currentWeekStart, -7));
  const goToNextWeek = () => setCurrentWeekStart(addDays(currentWeekStart, 7));
  const goToToday = () => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-foreground">
          {format(currentWeekStart, "MMMM yyyy")}
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={goToPreviousWeek} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goToNextWeek} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dayBookings = getBookingsForDay(day);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "min-h-[120px] p-2 border rounded-xl",
                isToday ? "border-primary bg-primary/5" : "border-border"
              )}
            >
              <div className="text-center mb-2">
                <div className="text-xs text-muted-foreground uppercase">
                  {format(day, "EEE")}
                </div>
                <div
                  className={cn(
                    "text-lg font-semibold",
                    isToday ? "text-primary" : "text-foreground"
                  )}
                >
                  {format(day, "d")}
                </div>
              </div>

              <div className="space-y-1">
                {dayBookings.slice(0, 3).map((booking) => (
                  <button
                    key={booking.id}
                    onClick={() => setSelectedBooking(booking)}
                    className={cn(
                      "w-full text-left p-1.5 rounded text-xs transition-colors",
                      "hover:ring-2 hover:ring-primary/20",
                      booking.status === "cancelled"
                        ? "bg-muted/50 text-muted-foreground line-through"
                        : "bg-primary/10 text-foreground"
                    )}
                  >
                    <div className="font-medium truncate">
                      {format(new Date(booking.start_time), "h:mm a")}
                    </div>
                  </button>
                ))}
                {dayBookings.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center">
                    +{dayBookings.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full">
            <h3 className="font-display text-xl font-bold text-foreground mb-4">
              Booking Details
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="w-4 h-4" />
                <span>Client ID: {selectedBooking.user_id.slice(0, 8)}...</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>
                  {format(new Date(selectedBooking.start_time), "EEEE, MMMM d, yyyy")}
                  <br />
                  {format(new Date(selectedBooking.start_time), "h:mm a")} -{" "}
                  {format(new Date(selectedBooking.end_time), "h:mm a")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="outline" className={statusColors[selectedBooking.status]}>
                  {selectedBooking.status}
                </Badge>
              </div>
              {selectedBooking.notes && (
                <div className="text-sm text-muted-foreground italic">
                  Notes: {selectedBooking.notes}
                </div>
              )}
            </div>

            {/* Status Actions */}
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedBooking.status !== "confirmed" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onUpdateStatus(selectedBooking.id, "confirmed");
                    setSelectedBooking({ ...selectedBooking, status: "confirmed" });
                  }}
                >
                  Confirm
                </Button>
              )}
              {selectedBooking.status !== "completed" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onUpdateStatus(selectedBooking.id, "completed");
                    setSelectedBooking({ ...selectedBooking, status: "completed" });
                  }}
                >
                  Complete
                </Button>
              )}
              {selectedBooking.status !== "cancelled" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive border-destructive hover:bg-destructive/10"
                  onClick={() => {
                    onUpdateStatus(selectedBooking.id, "cancelled");
                    setSelectedBooking({ ...selectedBooking, status: "cancelled" });
                  }}
                >
                  Cancel
                </Button>
              )}
              {selectedBooking.status !== "no_show" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onUpdateStatus(selectedBooking.id, "no_show");
                    setSelectedBooking({ ...selectedBooking, status: "no_show" });
                  }}
                >
                  No Show
                </Button>
              )}
            </div>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setSelectedBooking(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
