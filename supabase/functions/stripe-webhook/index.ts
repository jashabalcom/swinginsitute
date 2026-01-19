import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Package mapping - maps Stripe product IDs to session counts and validity
const PACKAGE_MAPPING: Record<string, { sessions: number; validityDays: number }> = {
  "prod_Tp2pZybeOOoEhq": { sessions: 3, validityDays: 90 }, // 3-Lesson Package
  "prod_Tp2pE7QdK9VryM": { sessions: 6, validityDays: 180 }, // 6-Lesson Package
  "prod_Tp2pUYu4EmGjeu": { sessions: 12, validityDays: 365 }, // 12-Lesson Package
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2025-08-27.basil",
  });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    
    // If no webhook secret, just parse the body directly for testing
    let event: Stripe.Event;
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
    }

    console.log(`Processing webhook event: ${event.type}`);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      
      if (!userId) {
        console.log("No user_id in metadata, skipping");
        return new Response(JSON.stringify({ received: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get the line items to determine what was purchased
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      
      for (const item of lineItems.data) {
        const price = await stripe.prices.retrieve(item.price?.id || "");
        const productId = price.product as string;
        
        // Check if it's a lesson package
        const packageInfo = PACKAGE_MAPPING[productId];
        
        if (packageInfo) {
          // Get or create package record
          const { data: existingPackage } = await supabase
            .from("packages")
            .select("id")
            .eq("name", item.description || "Lesson Package")
            .maybeSingle();

          let packageId = existingPackage?.id;
          
          if (!packageId) {
            // Create package if not exists
            const { data: newPackage } = await supabase
              .from("packages")
              .insert({
                name: item.description || "Lesson Package",
                session_count: packageInfo.sessions,
                base_price: (price.unit_amount || 0) / 100,
                member_price: (price.unit_amount || 0) / 100,
                validity_days: packageInfo.validityDays,
              })
              .select()
              .single();
            packageId = newPackage?.id;
          }

          // Calculate expiration date
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + packageInfo.validityDays);

          // Create purchased package record
          const { error: purchaseError } = await supabase
            .from("purchased_packages")
            .insert({
              user_id: userId,
              package_id: packageId,
              sessions_remaining: packageInfo.sessions,
              sessions_total: packageInfo.sessions,
              expires_at: expiresAt.toISOString(),
              status: "active",
              stripe_payment_id: session.payment_intent as string,
            });

          if (purchaseError) {
            console.error("Error creating purchased package:", purchaseError);
          } else {
            console.log(`Created purchased package for user ${userId}`);
          }
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Webhook error:", message);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
