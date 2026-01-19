import { useState } from "react";
import { format, addDays, startOfWeek, isSameDay, isBefore, startOfDay, addWeeks, subWeeks } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const today = startOfDay(new Date());
  const days = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const goToPreviousWeek = () => {
    const newStart = subWeeks(currentWeekStart, 1);
    if (!isBefore(newStart, startOfWeek(today, { weekStartsOn: 0 }))) {
      setCurrentWeekStart(newStart);
    }
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  const goToToday = () => {
    setCurrentWeekStart(startOfWeek(today, { weekStartsOn: 0 }));
    setCurrentMonth(today);
    onSelectDate(today);
  };

  const isDateDisabled = (date: Date) => {
    if (isBefore(startOfDay(date), today)) return true;
    return disabledDates.some((d) => isSameDay(d, date));
  };

  const canGoPrevious = !isBefore(
    subWeeks(currentWeekStart, 1),
    startOfWeek(today, { weekStartsOn: 0 })
  );

  const handleMonthSelect = (date: Date | undefined) => {
    if (date && !isDateDisabled(date)) {
      onSelectDate(date);
    }
  };

  return (
    <div className="space-y-4">
      {/* View Toggle & Today Button */}
      <div className="flex items-center justify-between">
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(value) => value && setViewMode(value as "week" | "month")}
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
        <Button
          variant="ghost"
          size="sm"
          onClick={goToToday}
          className="text-sm text-muted-foreground"
        >
          Today
        </Button>
      </div>

      {viewMode === "week" ? (
        <>
          {/* Week View Header */}
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

          {/* Week View Grid */}
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
        </>
      ) : (
        /* Month View */
        <Calendar
          mode="single"
          selected={selectedDate || undefined}
          onSelect={handleMonthSelect}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          disabled={(date) => isDateDisabled(date)}
          className="rounded-md w-full"
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4 w-full",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md border border-input hover:bg-accent",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex w-full",
            head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem] flex-1 text-center",
            row: "flex w-full mt-2",
            cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 flex-1 h-9",
            day: "h-9 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent rounded-md inline-flex items-center justify-center",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "ring-2 ring-primary ring-offset-2",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
            day_hidden: "invisible",
          }}
        />
      )}
    </div>
  );
}
