import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CheckoutRequest {
  priceId: string;
  mode: "payment" | "subscription";
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, string>;
  customerEmail?: string; // For guest checkout
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");
    
    const { priceId, mode, successUrl, cancelUrl, metadata, customerEmail }: CheckoutRequest = await req.json();

    if (!priceId) throw new Error("Price ID is required");
    logStep("Received request", { priceId, mode, customerEmail: customerEmail ? "provided" : "not provided" });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const origin = req.headers.get("origin") || "https://lovable.app";
    let customerId: string | undefined;
    let email: string | undefined;
    let userId: string | undefined;

    // Try to get authenticated user (optional - supports guest checkout)
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      if (data.user?.email) {
        email = data.user.email;
        userId = data.user.id;
        logStep("Authenticated user found", { userId, email });
      }
    }

    // Fall back to provided email for guest checkout
    if (!email && customerEmail) {
      email = customerEmail;
      logStep("Using guest email", { email });
    }

    if (!email) {
      throw new Error("Email is required - please provide customerEmail for guest checkout");
    }

    // Check if customer exists in Stripe
    const customers = await stripe.customers.list({ email, limit: 1 });
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing Stripe customer found", { customerId });
    }

    // Build checkout session
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode || "subscription",
      success_url: successUrl || `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${origin}/checkout?canceled=true`,
      metadata: {
        ...(userId && { user_id: userId }),
        customer_email: email,
        ...metadata,
      },
      allow_promotion_codes: true,
    };

    // For subscriptions, add subscription metadata
    if (mode === "subscription") {
      sessionConfig.subscription_data = {
        metadata: {
          ...(userId && { user_id: userId }),
          customer_email: email,
          ...metadata,
        },
      };
    }

    logStep("Creating checkout session", { mode, email });
    const session = await stripe.checkout.sessions.create(sessionConfig);
    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
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
