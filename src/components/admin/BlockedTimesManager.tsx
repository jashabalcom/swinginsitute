import { useState } from "react";
import { format } from "date-fns";
import { Plus, Trash2, CalendarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { BlockedTime } from "@/types/booking";

interface BlockedTimesManagerProps {
  blockedTimes: BlockedTime[];
  coachId: string;
  onAdd: (data: {
    coachId: string;
    startDatetime: string;
    endDatetime: string;
    reason?: string;
  }) => Promise<{ error: string | null }>;
  onDelete: (id: string) => Promise<{ error: string | null }>;
}

export function BlockedTimesManager({
  blockedTimes,
  coachId,
  onAdd,
  onDelete,
}: BlockedTimesManagerProps) {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("17:00");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!startDate || !endDate) {
      toast({
        title: "Missing dates",
        description: "Please select start and end dates",
        variant: "destructive",
      });
      return;
    }

    const startDatetime = new Date(`${startDate}T${startTime}`);
    const endDatetime = new Date(`${endDate}T${endTime}`);

    if (startDatetime >= endDatetime) {
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
      startDatetime: startDatetime.toISOString(),
      endDatetime: endDatetime.toISOString(),
      reason: reason || undefined,
    });
    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    } else {
      toast({ title: "Time blocked" });
      setStartDate("");
      setEndDate("");
      setReason("");
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await onDelete(id);
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    } else {
      toast({ title: "Block removed" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Block */}
      <div className="p-4 border border-border rounded-xl bg-card">
        <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Block Time
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Start</label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex-1"
              />
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-28"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">End</label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="flex-1"
              />
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-28"
              />
            </div>
          </div>
        </div>
        <Textarea
          placeholder="Reason (optional) - e.g., Vacation, Tournament, etc."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mb-4"
        />
        <Button onClick={handleAdd} disabled={loading} className="bg-primary">
          {loading ? "Blocking..." : "Block Time"}
        </Button>
      </div>

      {/* Current Blocked Times */}
      <div className="space-y-3">
        <h4 className="font-medium text-foreground">Upcoming Blocked Times</h4>
        {blockedTimes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No blocked times scheduled</p>
        ) : (
          blockedTimes.map((block) => (
            <div
              key={block.id}
              className="flex items-start justify-between p-4 border border-border rounded-xl"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <CalendarOff className="w-4 h-4 text-destructive" />
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    {format(new Date(block.start_datetime), "MMM d, yyyy")}
                    {format(new Date(block.start_datetime), "yyyy-MM-dd") !==
                      format(new Date(block.end_datetime), "yyyy-MM-dd") &&
                      ` - ${format(new Date(block.end_datetime), "MMM d, yyyy")}`}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(block.start_datetime), "h:mm a")} -{" "}
                    {format(new Date(block.end_datetime), "h:mm a")}
                  </div>
                  {block.reason && (
                    <div className="text-sm text-muted-foreground mt-1 italic">
                      {block.reason}
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(block.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
