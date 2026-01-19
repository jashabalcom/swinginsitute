import { format } from "date-fns";
import { motion } from "framer-motion";
import { Calendar, Clock, Video, Users, Lock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Event, EVENT_TYPES } from "@/hooks/useEvents";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  isRegistered: boolean;
  canAccess: boolean;
  onRegister: () => void;
  onUnregister: () => void;
  index: number;
}

export function EventCard({
  event,
  isRegistered,
  canAccess,
  onRegister,
  onUnregister,
  index,
}: EventCardProps) {
  const eventTypeInfo = EVENT_TYPES[event.event_type as keyof typeof EVENT_TYPES] || {
    label: event.event_type,
    color: "bg-gray-500",
  };

  const startDate = new Date(event.start_time);
  const endDate = new Date(event.end_time);
  const isPast = endDate < new Date();
  const isLive = startDate <= new Date() && endDate >= new Date();

  const showZoomLink = isRegistered && event.zoom_link && !isPast && 
    (isLive || startDate.getTime() - Date.now() < 15 * 60 * 1000); // 15 min before

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "p-5 rounded-xl border transition-all",
        isPast ? "bg-muted/30 border-border/50" : "bg-card border-border hover:border-primary/50"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "px-2 py-1 rounded-md text-xs font-medium text-white",
              eventTypeInfo.color
            )}
          >
            {eventTypeInfo.label}
          </span>
          {isLive && (
            <span className="px-2 py-1 rounded-md text-xs font-medium bg-red-500 text-white animate-pulse">
              LIVE
            </span>
          )}
          {!canAccess && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-amber-500/20 text-amber-500">
              <Lock className="w-3 h-3" />
              PRO
            </span>
          )}
        </div>
        {isPast && event.replay_url && (
          <a
            href={event.replay_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            <Video className="w-3 h-3" />
            Watch Replay
          </a>
        )}
      </div>

      {/* Title & Description */}
      <h3 className="font-display text-lg font-bold text-foreground mb-1">
        {event.title}
      </h3>
      {event.description && (
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {event.description}
        </p>
      )}

      {/* Date & Time */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          {format(startDate, "EEE, MMM d, yyyy")}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          {format(startDate, "h:mm a")} - {format(endDate, "h:mm a")}
        </span>
        {event.max_attendees && (
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            Max {event.max_attendees} attendees
          </span>
        )}
      </div>

      {/* Actions */}
      {!isPast && canAccess && (
        <div className="flex items-center gap-3">
          {isRegistered ? (
            <>
              {showZoomLink ? (
                <a href={event.zoom_link!} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-green-600 hover:bg-green-500">
                    <Video className="w-4 h-4 mr-2" />
                    Join Now
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                </a>
              ) : (
                <Button disabled className="bg-green-600/50">
                  <Video className="w-4 h-4 mr-2" />
                  Registered
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onUnregister}>
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={onRegister}>
              Register
            </Button>
          )}
        </div>
      )}

      {!canAccess && !isPast && (
        <Button variant="outline" disabled className="opacity-60">
          <Lock className="w-4 h-4 mr-2" />
          Upgrade to Register
        </Button>
      )}
    </motion.div>
  );
}
