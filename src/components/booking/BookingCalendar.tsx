import { useState } from "react";
import { format, addDays, startOfWeek, isSameDay, isBefore, startOfDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BookingCalendarProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  disabledDates?: Date[];
}

export function BookingCalendar({
  selectedDate,
  onSelectDate,
  disabledDates = [],
}: BookingCalendarProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 0 })
  );

  const today = startOfDay(new Date());
  const days = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const goToPreviousWeek = () => {
    const newStart = addDays(currentWeekStart, -7);
    if (!isBefore(newStart, startOfWeek(today, { weekStartsOn: 0 }))) {
      setCurrentWeekStart(newStart);
    }
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const isDateDisabled = (date: Date) => {
    if (isBefore(startOfDay(date), today)) return true;
    return disabledDates.some((d) => isSameDay(d, date));
  };

  const canGoPrevious = !isBefore(
    addDays(currentWeekStart, -7),
    startOfWeek(today, { weekStartsOn: 0 })
  );

  return (
    <div className="space-y-4">
      {/* Month/Year Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-foreground">
          {format(currentWeekStart, "MMMM yyyy")}
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousWeek}
            disabled={!canGoPrevious}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextWeek}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const disabled = isDateDisabled(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isToday = isSameDay(day, today);

          return (
            <button
              key={day.toISOString()}
              onClick={() => !disabled && onSelectDate(day)}
              disabled={disabled}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-xl border transition-all",
                "hover:border-primary hover:bg-primary/5",
                disabled && "opacity-40 cursor-not-allowed hover:border-border hover:bg-transparent",
                isSelected && "border-primary bg-primary/10 ring-2 ring-primary/20",
                isToday && !isSelected && "border-secondary",
                !isSelected && !isToday && "border-border"
              )}
            >
              <span className="text-xs text-muted-foreground uppercase">
                {format(day, "EEE")}
              </span>
              <span
                className={cn(
                  "text-xl font-semibold",
                  isSelected ? "text-primary" : "text-foreground"
                )}
              >
                {format(day, "d")}
              </span>
            </button>
          );
        })}
      </div>

      {/* Today Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setCurrentWeekStart(startOfWeek(today, { weekStartsOn: 0 }));
          onSelectDate(today);
        }}
        className="text-sm text-muted-foreground"
      >
        Today
      </Button>
    </div>
  );
}
