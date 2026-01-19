import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AvailabilityRequest {
  coachId?: string;
  date: string; // YYYY-MM-DD format
  serviceTypeId?: string;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const { coachId, date, serviceTypeId }: AvailabilityRequest = await req.json();

    if (!date) throw new Error("Date is required");

    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay();

    // Get service duration (default 60 min)
    let duration = 60;
    if (serviceTypeId) {
      const { data: service } = await supabase
        .from("service_types")
        .select("duration_minutes")
        .eq("id", serviceTypeId)
        .maybeSingle();
      if (service) duration = service.duration_minutes;
    }

    // Get coach availability for this day of week
    let availabilityQuery = supabase
      .from("coach_availability")
      .select("*")
      .eq("day_of_week", dayOfWeek);

    if (coachId) {
      availabilityQuery = availabilityQuery.eq("coach_id", coachId);
    }

    const { data: availability, error: availError } = await availabilityQuery;

    if (availError) throw availError;

    // Get blocked times for this date
    const startOfDay = `${date}T00:00:00Z`;
    const endOfDay = `${date}T23:59:59Z`;

    let blockedQuery = supabase
      .from("blocked_times")
      .select("*")
      .gte("end_datetime", startOfDay)
      .lte("start_datetime", endOfDay);

    if (coachId) {
      blockedQuery = blockedQuery.eq("coach_id", coachId);
    }

    const { data: blockedTimes, error: blockedError } = await blockedQuery;

    if (blockedError) throw blockedError;

    // Get existing bookings for this date
    let bookingsQuery = supabase
      .from("bookings")
      .select("*")
      .gte("start_time", startOfDay)
      .lte("start_time", endOfDay)
      .neq("status", "cancelled");

    if (coachId) {
      bookingsQuery = bookingsQuery.eq("coach_id", coachId);
    }

    const { data: bookings, error: bookingsError } = await bookingsQuery;

    if (bookingsError) throw bookingsError;

    // Generate time slots based on availability
    const slots: TimeSlot[] = [];

    if (availability && availability.length > 0) {
      for (const avail of availability) {
        const [startHour, startMin] = avail.start_time.split(":").map(Number);
        const [endHour, endMin] = avail.end_time.split(":").map(Number);

        let currentHour = startHour;
        let currentMin = startMin;

        while (
          currentHour < endHour ||
          (currentHour === endHour && currentMin + duration <= endMin)
        ) {
          const slotStart = `${currentHour.toString().padStart(2, "0")}:${currentMin
            .toString()
            .padStart(2, "0")}`;
          const endSlotMin = currentMin + duration;
          const endSlotHour = currentHour + Math.floor(endSlotMin / 60);
          const slotEnd = `${endSlotHour.toString().padStart(2, "0")}:${(endSlotMin % 60)
            .toString()
            .padStart(2, "0")}`;

          const slotStartDateTime = new Date(`${date}T${slotStart}:00`);
          const slotEndDateTime = new Date(`${date}T${slotEnd}:00`);

          // Check if slot is blocked
          const isBlocked = blockedTimes?.some((block) => {
            const blockStart = new Date(block.start_datetime);
            const blockEnd = new Date(block.end_datetime);
            return slotStartDateTime < blockEnd && slotEndDateTime > blockStart;
          });

          // Check if slot is already booked
          const isBooked = bookings?.some((booking) => {
            const bookingStart = new Date(booking.start_time);
            const bookingEnd = new Date(booking.end_time);
            return slotStartDateTime < bookingEnd && slotEndDateTime > bookingStart;
          });

          // Check if slot is in the past
          const now = new Date();
          const isPast = slotStartDateTime < now;

          slots.push({
            startTime: slotStart,
            endTime: slotEnd,
            available: !isBlocked && !isBooked && !isPast,
          });

          currentMin += 30; // 30-minute intervals
          if (currentMin >= 60) {
            currentHour += 1;
            currentMin = currentMin % 60;
          }
        }
      }
    }

    return new Response(JSON.stringify({ slots, date }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in get-availability:", message);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
