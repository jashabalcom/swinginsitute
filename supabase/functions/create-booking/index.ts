import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingRequest {
  serviceTypeId: string;
  coachId: string;
  startTime: string; // ISO datetime string
  endTime: string;
  paymentMethod: "credits" | "package" | "direct_pay";
  purchasedPackageId?: string;
  amountPaid?: number;
  stripePaymentId?: string;
  notes?: string;
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
    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: authError } = await supabase.auth.getUser(token);
    if (authError) throw authError;
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    const {
      serviceTypeId,
      coachId,
      startTime,
      endTime,
      paymentMethod,
      purchasedPackageId,
      amountPaid,
      stripePaymentId,
      notes,
    }: BookingRequest = await req.json();

    // Validate required fields
    if (!serviceTypeId || !coachId || !startTime || !endTime) {
      throw new Error("Missing required booking fields");
    }

    // Check for conflicts
    const { data: conflicts } = await supabase
      .from("bookings")
      .select("id")
      .eq("coach_id", coachId)
      .neq("status", "cancelled")
      .lt("start_time", endTime)
      .gt("end_time", startTime);

    if (conflicts && conflicts.length > 0) {
      throw new Error("This time slot is no longer available");
    }

    // If using package credits, validate and decrement
    if (paymentMethod === "package" && purchasedPackageId) {
      const { data: pkg, error: pkgError } = await supabase
        .from("purchased_packages")
        .select("*")
        .eq("id", purchasedPackageId)
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      if (pkgError) throw pkgError;
      if (!pkg) throw new Error("Package not found or not active");
      if (pkg.sessions_remaining <= 0) throw new Error("No sessions remaining in package");

      // Check expiration
      if (new Date(pkg.expires_at) < new Date()) {
        throw new Error("Package has expired");
      }

      // Decrement sessions
      const newRemaining = pkg.sessions_remaining - 1;
      const newStatus = newRemaining <= 0 ? "depleted" : "active";

      const { error: updateError } = await supabase
        .from("purchased_packages")
        .update({
          sessions_remaining: newRemaining,
          status: newStatus,
        })
        .eq("id", purchasedPackageId);

      if (updateError) throw updateError;
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        service_type_id: serviceTypeId,
        coach_id: coachId,
        start_time: startTime,
        end_time: endTime,
        status: "confirmed",
        payment_method: paymentMethod,
        purchased_package_id: purchasedPackageId || null,
        amount_paid: amountPaid || 0,
        stripe_payment_id: stripePaymentId || null,
        notes: notes || null,
      })
      .select()
      .single();

    if (bookingError) throw bookingError;

    return new Response(JSON.stringify({ booking }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in create-booking:", message);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
