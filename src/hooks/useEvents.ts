import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Event {
  id: string;
  title: string;
  description: string | null;
  event_type: string;
  start_time: string;
  end_time: string;
  zoom_link: string | null;
  replay_url: string | null;
  thumbnail_url: string | null;
  is_public: boolean;
  required_tiers: string[];
  max_attendees: number | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  registered_at: string;
  attended: boolean;
  reminder_sent: boolean;
}

export const EVENT_TYPES = {
  skills: { label: "Skills Workshop", color: "bg-primary" },
  mindset: { label: "Mindset Coaching", color: "bg-purple-500" },
  parent: { label: "Parent Coaching", color: "bg-blue-500" },
  pro_track: { label: "Pro Track", color: "bg-amber-500" },
} as const;

export function useEvents() {
  const { user, profile } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  const userTier = profile?.membership_tier || "starter";

  const fetchEvents = useCallback(async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("start_time", { ascending: true });

    if (error) {
      console.error("Error fetching events:", error);
      return;
    }

    setEvents(data || []);
  }, []);

  const fetchRegistrations = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("event_registrations")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching registrations:", error);
      return;
    }

    setRegistrations(data || []);
  }, [user]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchEvents(), fetchRegistrations()]);
      setLoading(false);
    };
    load();

    // Subscribe to realtime updates
    const eventsChannel = supabase
      .channel("events-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        () => fetchEvents()
      )
      .subscribe();

    const registrationsChannel = supabase
      .channel("registrations-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "event_registrations" },
        () => fetchRegistrations()
      )
      .subscribe();

    return () => {
      eventsChannel.unsubscribe();
      registrationsChannel.unsubscribe();
    };
  }, [fetchEvents, fetchRegistrations]);

  const canAccessEvent = useCallback(
    (event: Event) => {
      if (!event.required_tiers || event.required_tiers.length === 0) return true;
      return event.required_tiers.includes(userTier);
    },
    [userTier]
  );

  const isRegistered = useCallback(
    (eventId: string) => {
      return registrations.some((r) => r.event_id === eventId);
    },
    [registrations]
  );

  const registerForEvent = useCallback(
    async (eventId: string) => {
      if (!user) return { success: false, error: "Not logged in" };

      const { data, error } = await supabase
        .from("event_registrations")
        .insert({
          event_id: eventId,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error("Error registering:", error);
        return { success: false, error: error.message };
      }

      setRegistrations((prev) => [...prev, data]);
      return { success: true };
    },
    [user]
  );

  const unregisterFromEvent = useCallback(
    async (eventId: string) => {
      if (!user) return { success: false, error: "Not logged in" };

      const { error } = await supabase
        .from("event_registrations")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error unregistering:", error);
        return { success: false, error: error.message };
      }

      setRegistrations((prev) => prev.filter((r) => r.event_id !== eventId));
      return { success: true };
    },
    [user]
  );

  const getUpcomingEvents = useCallback(() => {
    const now = new Date();
    return events.filter((e) => new Date(e.start_time) > now && canAccessEvent(e));
  }, [events, canAccessEvent]);

  const getPastEvents = useCallback(() => {
    const now = new Date();
    return events.filter((e) => new Date(e.end_time) < now && canAccessEvent(e));
  }, [events, canAccessEvent]);

  const getMyRegisteredEvents = useCallback(() => {
    return events.filter((e) => isRegistered(e.id));
  }, [events, isRegistered]);

  const getEventsWithReplays = useCallback(() => {
    return events.filter((e) => e.replay_url && canAccessEvent(e));
  }, [events, canAccessEvent]);

  return {
    events,
    registrations,
    loading,
    canAccessEvent,
    isRegistered,
    registerForEvent,
    unregisterFromEvent,
    getUpcomingEvents,
    getPastEvents,
    getMyRegisteredEvents,
    getEventsWithReplays,
    refetch: () => Promise.all([fetchEvents(), fetchRegistrations()]),
  };
}
