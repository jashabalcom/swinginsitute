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
  paymentMethod: "credits" | "package" | "direct_pay" | "hybrid_credit";
  purchasedPackageId?: string;
  amountPaid?: number;
  stripePaymentId?: string;
  notes?: string;
}

const logStep = (step: string, details?: any) => {
  console.log(`[CREATE-BOOKING] ${step}${details ? ` - ${JSON.stringify(details)}` : ''}`);
};

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

    logStep("Booking request received", { userId: user.id, paymentMethod, serviceTypeId });

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

    // Handle hybrid credit payment
    if (paymentMethod === "hybrid_credit") {
      // Get user profile to check hybrid credits
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("hybrid_credits_remaining, membership_tier")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) throw new Error("Profile not found");
      
      const hybridCredits = profile.hybrid_credits_remaining || 0;
      logStep("Checking hybrid credits", { available: hybridCredits, tier: profile.membership_tier });
      
      if (hybridCredits <= 0) {
        throw new Error("No hybrid credits available. Please use a package or pay directly.");
      }

      // Deduct hybrid credit
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          hybrid_credits_remaining: hybridCredits - 1,
        })
        .eq("user_id", user.id);

      if (updateError) throw updateError;
      logStep("Hybrid credit deducted", { remaining: hybridCredits - 1 });
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
      logStep("Package credit deducted", { packageId: purchasedPackageId, remaining: newRemaining });
    }

    // Create booking - store the actual payment method used
    const bookingPaymentMethod = paymentMethod === "hybrid_credit" ? "credits" : paymentMethod;
    
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        service_type_id: serviceTypeId,
        coach_id: coachId,
        start_time: startTime,
        end_time: endTime,
        status: "confirmed",
        payment_method: bookingPaymentMethod,
        purchased_package_id: purchasedPackageId || null,
        amount_paid: amountPaid || 0,
        stripe_payment_id: stripePaymentId || null,
        notes: notes ? `${notes}${paymentMethod === "hybrid_credit" ? " [Hybrid Credit]" : ""}` : (paymentMethod === "hybrid_credit" ? "[Hybrid Credit]" : null),
      })
      .select()
      .single();

    if (bookingError) throw bookingError;

    logStep("Booking created successfully", { bookingId: booking.id, paymentMethod });

    return new Response(JSON.stringify({ booking }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logStep("ERROR", { message });
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});