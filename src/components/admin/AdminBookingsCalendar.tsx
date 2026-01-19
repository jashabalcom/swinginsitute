import { useState } from "react";
import { format, startOfWeek, addDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay, startOfDay, addWeeks, subWeeks, subMonths, addMonths } from "date-fns";
import { ChevronLeft, ChevronRight, User, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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

const statusDotColors: Record<Booking["status"], string> = {
  pending: "bg-yellow-500",
  confirmed: "bg-green-500",
  completed: "bg-blue-500",
  cancelled: "bg-red-500",
  no_show: "bg-gray-500",
};

export function AdminBookingsCalendar({
  bookings,
  onUpdateStatus,
}: AdminBookingsCalendarProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 0 })
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const today = startOfDay(new Date());
  const days = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const getBookingsForDay = (date: Date) =>
    bookings.filter((b) => isSameDay(new Date(b.start_time), date));

  const goToPreviousWeek = () => setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  const goToNextWeek = () => setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }));
    setCurrentMonth(new Date());
    setSelectedDay(null);
  };

  const getMonthDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    const startDayOfWeek = getDay(monthStart);
    const paddingDays = Array.from({ length: startDayOfWeek }, (_, i) => 
      addDays(monthStart, -(startDayOfWeek - i))
    );
    
    const endDayOfWeek = getDay(monthEnd);
    const endPaddingDays = Array.from({ length: 6 - endDayOfWeek }, (_, i) => 
      addDays(monthEnd, i + 1)
    );
    
    return [...paddingDays, ...allDays, ...endPaddingDays];
  };

  const monthDays = getMonthDays();

  const renderDayBookings = () => {
    if (!selectedDay) return null;
    const dayBookings = getBookingsForDay(selectedDay);

    return (
      <div className="mt-4 p-4 bg-muted/50 rounded-xl border border-border">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-foreground">
            {format(selectedDay, "EEEE, MMMM d, yyyy")}
          </h4>
          <Button variant="ghost" size="icon" onClick={() => setSelectedDay(null)} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        {dayBookings.length === 0 ? (
          <p className="text-muted-foreground text-sm">No bookings for this day</p>
        ) : (
          <div className="space-y-2">
            {dayBookings.map((booking) => (
              <button
                key={booking.id}
                onClick={() => setSelectedBooking(booking)}
                className={cn(
                  "w-full text-left p-3 rounded-lg border text-sm transition-colors",
                  "hover:ring-2 hover:ring-primary/20",
                  statusColors[booking.status]
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {format(new Date(booking.start_time), "h:mm a")} - {format(new Date(booking.end_time), "h:mm a")}
                  </span>
                  <Badge variant="outline" className={statusColors[booking.status]}>
                    {booking.status}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(value) => {
            if (value) {
              setViewMode(value as "week" | "month");
              setSelectedDay(null);
            }
          }}
          className="bg-muted rounded-lg p-1"
        >
          <ToggleGroupItem
            value="week"
            className="text-xs px-3 py-1.5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            Week
          </ToggleGroupItem>
          <ToggleGroupItem
            value="month"
            className="text-xs px-3 py-1.5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            Month
          </ToggleGroupItem>
        </ToggleGroup>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={viewMode === "week" ? goToPreviousWeek : goToPreviousMonth}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={viewMode === "week" ? goToNextWeek : goToNextMonth}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Title & Legend */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="font-display text-lg font-semibold text-foreground">
          {viewMode === "week" 
            ? format(currentWeekStart, "MMMM yyyy")
            : format(currentMonth, "MMMM yyyy")
          }
        </h3>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-muted-foreground">Pending</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-muted-foreground">Confirmed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-muted-foreground">Cancelled</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-gray-500" />
            <span className="text-muted-foreground">No Show</span>
          </div>
        </div>
      </div>

      {viewMode === "week" ? (
        /* Week View Grid */
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const dayBookings = getBookingsForDay(day);
            const isToday = isSameDay(day, today);

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
      ) : (
        <>
          {/* Month View Day Headers */}
          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Month View Grid */}
          <div className="grid grid-cols-7 gap-1">
            {monthDays.map((day, index) => {
              const dayBookings = getBookingsForDay(day);
              const isToday = isSameDay(day, today);
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
              const isSelected = selectedDay && isSameDay(day, selectedDay);

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "relative min-h-[70px] p-2 rounded-lg border transition-all text-left",
                    isCurrentMonth ? "bg-background" : "bg-muted/30",
                    isToday && "ring-2 ring-primary",
                    isSelected && "bg-primary/10 border-primary",
                    !isToday && !isSelected && "border-border",
                    "hover:bg-accent"
                  )}
                >
                  <span className={cn(
                    "text-sm font-medium",
                    isCurrentMonth ? "text-foreground" : "text-muted-foreground",
                    isToday && "text-primary"
                  )}>
                    {format(day, "d")}
                  </span>
                  {dayBookings.length > 0 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5">
                      {dayBookings.length <= 3 ? (
                        dayBookings.map((booking, i) => (
                          <div
                            key={i}
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              statusDotColors[booking.status]
                            )}
                          />
                        ))
                      ) : (
                        <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
                          {dayBookings.length}
                        </Badge>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Day Bookings */}
          {renderDayBookings()}
        </>
      )}

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
