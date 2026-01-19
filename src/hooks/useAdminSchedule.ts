import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { CoachAvailability, BlockedTime, Booking } from "@/types/booking";

export function useAdminSchedule() {
  const { user } = useAuth();
  const [availability, setAvailability] = useState<CoachAvailability[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      setIsAdmin(!!data);
    };

    checkAdmin();
  }, [user]);

  const fetchAvailability = useCallback(async () => {
    const { data, error } = await supabase
      .from("coach_availability")
      .select("*")
      .order("day_of_week", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) {
      console.error("Error fetching availability:", error);
    } else {
      setAvailability((data as unknown as CoachAvailability[]) || []);
    }
  }, []);

  const fetchBlockedTimes = useCallback(async () => {
    const { data, error } = await supabase
      .from("blocked_times")
      .select("*")
      .gte("end_datetime", new Date().toISOString())
      .order("start_datetime", { ascending: true });

    if (error) {
      console.error("Error fetching blocked times:", error);
    } else {
      setBlockedTimes((data as unknown as BlockedTime[]) || []);
    }
  }, []);

  const fetchAllBookings = useCallback(async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*, service_type:service_types(*)")
      .order("start_time", { ascending: true });

    if (error) {
      console.error("Error fetching bookings:", error);
    } else {
      setAllBookings((data as unknown as Booking[]) || []);
    }
  }, []);

  const addAvailability = useCallback(
    async (data: {
      coachId: string;
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      isRecurring?: boolean;
      specificDate?: string;
    }) => {
      const { error } = await supabase.from("coach_availability").insert({
        coach_id: data.coachId,
        day_of_week: data.dayOfWeek,
        start_time: data.startTime,
        end_time: data.endTime,
        is_recurring: data.isRecurring ?? true,
        specific_date: data.specificDate || null,
      });

      if (error) {
        console.error("Error adding availability:", error);
        return { error: error.message };
      }

      await fetchAvailability();
      return { error: null };
    },
    [fetchAvailability]
  );

  const deleteAvailability = useCallback(
    async (id: string) => {
      const { error } = await supabase
        .from("coach_availability")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting availability:", error);
        return { error: error.message };
      }

      await fetchAvailability();
      return { error: null };
    },
    [fetchAvailability]
  );

  const addBlockedTime = useCallback(
    async (data: {
      coachId: string;
      startDatetime: string;
      endDatetime: string;
      reason?: string;
    }) => {
      const { error } = await supabase.from("blocked_times").insert({
        coach_id: data.coachId,
        start_datetime: data.startDatetime,
        end_datetime: data.endDatetime,
        reason: data.reason || null,
      });

      if (error) {
        console.error("Error adding blocked time:", error);
        return { error: error.message };
      }

      await fetchBlockedTimes();
      return { error: null };
    },
    [fetchBlockedTimes]
  );

  const deleteBlockedTime = useCallback(
    async (id: string) => {
      const { error } = await supabase
        .from("blocked_times")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting blocked time:", error);
        return { error: error.message };
      }

      await fetchBlockedTimes();
      return { error: null };
    },
    [fetchBlockedTimes]
  );

  const updateBookingStatus = useCallback(
    async (bookingId: string, status: Booking["status"]) => {
      const updateData: Record<string, unknown> = { status };
      if (status === "cancelled") {
        updateData.cancelled_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("bookings")
        .update(updateData)
        .eq("id", bookingId);

      if (error) {
        console.error("Error updating booking:", error);
        return { error: error.message };
      }

      await fetchAllBookings();
      return { error: null };
    },
    [fetchAllBookings]
  );

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchAvailability(),
        fetchBlockedTimes(),
        fetchAllBookings(),
      ]);
      setLoading(false);
    };

    if (user && isAdmin) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [user, isAdmin, fetchAvailability, fetchBlockedTimes, fetchAllBookings]);

  const upcomingBookings = allBookings.filter(
    (b) => new Date(b.start_time) > new Date() && b.status !== "cancelled"
  );

  const todaysBookings = allBookings.filter((b) => {
    const bookingDate = new Date(b.start_time);
    const today = new Date();
    return (
      bookingDate.toDateString() === today.toDateString() &&
      b.status !== "cancelled"
    );
  });

  return {
    availability,
    blockedTimes,
    allBookings,
    upcomingBookings,
    todaysBookings,
    loading,
    isAdmin,
    addAvailability,
    deleteAvailability,
    addBlockedTime,
    deleteBlockedTime,
    updateBookingStatus,
    refreshAvailability: fetchAvailability,
    refreshBlockedTimes: fetchBlockedTimes,
    refreshBookings: fetchAllBookings,
  };
}
