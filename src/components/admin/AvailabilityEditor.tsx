import { useState } from "react";
import { Plus, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { CoachAvailability } from "@/types/booking";

const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

const TIME_OPTIONS = Array.from({ length: 28 }, (_, i) => {
  const hour = Math.floor(i / 2) + 6; // Start at 6 AM
  const minute = (i % 2) * 30;
  const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  const hour12 = hour % 12 || 12;
  const ampm = hour >= 12 ? "PM" : "AM";
  const label = `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
  return { value: time, label };
});

interface AvailabilityEditorProps {
  availability: CoachAvailability[];
  coachId: string;
  onAdd: (data: {
    coachId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }) => Promise<{ error: string | null }>;
  onDelete: (id: string) => Promise<{ error: string | null }>;
}

export function AvailabilityEditor({
  availability,
  coachId,
  onAdd,
  onDelete,
}: AvailabilityEditorProps) {
  const { toast } = useToast();
  const [newDay, setNewDay] = useState<number>(1);
  const [newStart, setNewStart] = useState("09:00");
  const [newEnd, setNewEnd] = useState("17:00");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (newStart >= newEnd) {
      toast({
        title: "Invalid times",
        description: "End time must be after start time",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await onAdd({
      coachId,
      dayOfWeek: newDay,
      startTime: newStart,
      endTime: newEnd,
    });
    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    } else {
      toast({ title: "Availability added" });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await onDelete(id);
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    } else {
      toast({ title: "Availability removed" });
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const hour12 = hour % 12 || 12;
    const ampm = hour >= 12 ? "PM" : "AM";
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Group by day
  const byDay = DAYS_OF_WEEK.map((day) => ({
    ...day,
    slots: availability.filter((a) => a.day_of_week === day.value),
  }));

  return (
    <div className="space-y-6">
      {/* Add New */}
      <div className="p-4 border border-border rounded-xl bg-card">
        <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Availability
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <Select value={newDay.toString()} onValueChange={(v) => setNewDay(parseInt(v))}>
            <SelectTrigger>
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent>
              {DAYS_OF_WEEK.map((day) => (
                <SelectItem key={day.value} value={day.value.toString()}>
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={newStart} onValueChange={setNewStart}>
            <SelectTrigger>
              <SelectValue placeholder="Start" />
            </SelectTrigger>
            <SelectContent>
              {TIME_OPTIONS.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={newEnd} onValueChange={setNewEnd}>
            <SelectTrigger>
              <SelectValue placeholder="End" />
            </SelectTrigger>
            <SelectContent>
              {TIME_OPTIONS.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleAdd} disabled={loading} className="bg-primary">
            {loading ? "Adding..." : "Add"}
          </Button>
        </div>
      </div>

      {/* Current Schedule */}
      <div className="space-y-4">
        {byDay.map((day) => (
          <div key={day.value} className="p-4 border border-border rounded-xl">
            <h4 className="font-medium text-foreground mb-3">{day.label}</h4>
            {day.slots.length === 0 ? (
              <p className="text-sm text-muted-foreground">No availability set</p>
            ) : (
              <div className="space-y-2">
                {day.slots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                  >
                    <span className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(slot.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
