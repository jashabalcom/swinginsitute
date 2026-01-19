import { format } from "date-fns";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Booking } from "@/types/booking";

interface BookingCardProps {
  booking: Booking;
  onCancel?: (id: string) => void;
  showCancelButton?: boolean;
}

const statusConfig: Record<Booking["status"], { label: string; color: string; icon: React.ReactNode }> = {
  pending: {
    label: "Pending",
    color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    icon: <Clock className="w-3 h-3" />,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-green-500/10 text-green-600 border-green-500/20",
    icon: <CheckCircle className="w-3 h-3" />,
  },
  completed: {
    label: "Completed",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    icon: <CheckCircle className="w-3 h-3" />,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-500/10 text-red-600 border-red-500/20",
    icon: <X className="w-3 h-3" />,
  },
  no_show: {
    label: "No Show",
    color: "bg-gray-500/10 text-gray-600 border-gray-500/20",
    icon: <AlertCircle className="w-3 h-3" />,
  },
};

export function BookingCard({ booking, onCancel, showCancelButton = true }: BookingCardProps) {
  const startDate = new Date(booking.start_time);
  const endDate = new Date(booking.end_time);
  const status = statusConfig[booking.status];
  const isPast = startDate < new Date();
  const canCancel = !isPast && booking.status === "confirmed" && showCancelButton;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl border p-4 transition-all",
        isPast ? "border-border/50 bg-muted/30" : "border-border bg-card"
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Date Badge */}
        <div className="flex-shrink-0 text-center px-4 py-3 bg-primary/10 rounded-lg min-w-[80px]">
          <div className="text-2xl font-bold text-primary">{format(startDate, "d")}</div>
          <div className="text-xs text-muted-foreground uppercase">
            {format(startDate, "MMM")}
          </div>
        </div>

        {/* Details */}
        <div className="flex-grow space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-foreground">
              {booking.service_type?.name || "Private Lesson"}
            </h4>
            <Badge
              variant="outline"
              className={cn("flex items-center gap-1", status.color)}
            >
              {status.icon}
              {status.label}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {format(startDate, "EEEE, MMMM d, yyyy")}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {format(startDate, "h:mm a")} - {format(endDate, "h:mm a")}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Atlanta, GA
            </span>
          </div>

          {booking.notes && (
            <p className="text-sm text-muted-foreground italic">"{booking.notes}"</p>
          )}
        </div>

        {/* Actions */}
        {canCancel && onCancel && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCancel(booking.id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
        )}
      </div>
    </motion.div>
  );
}
