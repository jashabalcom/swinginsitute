import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Video, Filter } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCard } from "@/components/events/EventCard";
import { useEvents, EVENT_TYPES } from "@/hooks/useEvents";
import { toast } from "sonner";

export default function Events() {
  const {
    loading,
    getUpcomingEvents,
    getPastEvents,
    getMyRegisteredEvents,
    getEventsWithReplays,
    isRegistered,
    canAccessEvent,
    registerForEvent,
    unregisterFromEvent,
  } = useEvents();

  const [activeTab, setActiveTab] = useState("upcoming");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const handleRegister = async (eventId: string) => {
    const result = await registerForEvent(eventId);
    if (result.success) {
      toast.success("Registered successfully!");
    } else {
      toast.error(result.error || "Failed to register");
    }
  };

  const handleUnregister = async (eventId: string) => {
    const result = await unregisterFromEvent(eventId);
    if (result.success) {
      toast.success("Registration cancelled");
    } else {
      toast.error(result.error || "Failed to cancel registration");
    }
  };

  const filterEvents = (events: ReturnType<typeof getUpcomingEvents>) => {
    if (!typeFilter) return events;
    return events.filter((e) => e.event_type === typeFilter);
  };

  const upcomingEvents = filterEvents(getUpcomingEvents());
  const pastEvents = filterEvents(getPastEvents());
  const myEvents = filterEvents(getMyRegisteredEvents());
  const replays = getEventsWithReplays();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 flex items-center justify-center min-h-[60vh]">
            <div className="text-muted-foreground">Loading Events...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-8 md:py-12 border-b border-border mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Live Events
              </h1>
            </div>
            <p className="text-muted-foreground max-w-xl">
              Join live workshops, coaching calls, and exclusive Pro Track sessions.
              Can't make it? Watch the replay anytime.
            </p>
          </motion.div>

          {/* Type Filter */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Button
              variant={typeFilter === null ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setTypeFilter(null)}
            >
              All
            </Button>
            {Object.entries(EVENT_TYPES).map(([key, { label }]) => (
              <Button
                key={key}
                variant={typeFilter === key ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setTypeFilter(key)}
              >
                {label}
              </Button>
            ))}
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingEvents.length})
              </TabsTrigger>
              <TabsTrigger value="registered">
                My Events ({myEvents.length})
              </TabsTrigger>
              <TabsTrigger value="replays">
                <Video className="w-4 h-4 mr-1" />
                Replays ({replays.length})
              </TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event, index) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isRegistered={isRegistered(event.id)}
                    canAccess={canAccessEvent(event)}
                    onRegister={() => handleRegister(event.id)}
                    onUnregister={() => handleUnregister(event.id)}
                    index={index}
                  />
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No upcoming events scheduled.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="registered" className="space-y-4">
              {myEvents.length > 0 ? (
                myEvents.map((event, index) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isRegistered={true}
                    canAccess={canAccessEvent(event)}
                    onRegister={() => handleRegister(event.id)}
                    onUnregister={() => handleUnregister(event.id)}
                    index={index}
                  />
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>You haven't registered for any events yet.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="replays" className="space-y-4">
              {replays.length > 0 ? (
                replays.map((event, index) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isRegistered={isRegistered(event.id)}
                    canAccess={canAccessEvent(event)}
                    onRegister={() => handleRegister(event.id)}
                    onUnregister={() => handleUnregister(event.id)}
                    index={index}
                  />
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No replays available yet.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {pastEvents.length > 0 ? (
                pastEvents.slice(0, 20).map((event, index) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isRegistered={isRegistered(event.id)}
                    canAccess={canAccessEvent(event)}
                    onRegister={() => handleRegister(event.id)}
                    onUnregister={() => handleUnregister(event.id)}
                    index={index}
                  />
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No past events.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
