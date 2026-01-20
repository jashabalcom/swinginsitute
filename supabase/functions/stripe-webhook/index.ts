import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper to sync with GoHighLevel
async function syncToGHL(action: string, payload: Record<string, any>) {
  try {
    const ghlApiKey = Deno.env.get("GHL_API_KEY");
    if (!ghlApiKey) {
      console.log("[GHL] API key not configured, skipping sync");
      return;
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const response = await fetch(`${supabaseUrl}/functions/v1/ghl-sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      },
      body: JSON.stringify({ action, ...payload }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.log(`[GHL] Sync failed: ${error}`);
    } else {
      console.log(`[GHL] Sync successful: ${action}`);
    }
  } catch (error) {
    console.log(`[GHL] Sync error: ${error instanceof Error ? error.message : "Unknown"}`);
  }
}

// Mapping of Stripe product IDs to membership tiers
const PRODUCT_TO_TIER: Record<string, string> = {
  "prod_TpAynmYe2OSTKN": "community",
  "prod_Tp4siVSGD0PG7k": "starter",
  "prod_Tp4sKzTi2pyda4": "pro",
  "prod_Tp4sXGo0L4c2bn": "elite",
  "prod_Tp4s6jRZcg949u": "hybrid-core",
  "prod_Tp4t69jx1LlFu7": "hybrid-pro",
};

const TIER_CONFIG: Record<string, { 
  lessonRate: number; 
  monthlyCredits: number; 
  feedbackFrequency: string;
  hybridCredits: number;
}> = {
  "community": { lessonRate: 145, monthlyCredits: 0, feedbackFrequency: "none", hybridCredits: 0 },
  "starter": { lessonRate: 145, monthlyCredits: 2, feedbackFrequency: "weekly", hybridCredits: 0 },
  "pro": { lessonRate: 115, monthlyCredits: 4, feedbackFrequency: "priority", hybridCredits: 0 },
  "elite": { lessonRate: 115, monthlyCredits: -1, feedbackFrequency: "priority", hybridCredits: 0 },
  "hybrid-core": { lessonRate: 115, monthlyCredits: 4, feedbackFrequency: "priority", hybridCredits: 1 },
  "hybrid-pro": { lessonRate: 115, monthlyCredits: -1, feedbackFrequency: "priority", hybridCredits: 2 },
};

const PACKAGE_MAPPING: Record<string, { sessions: number; validityDays: number }> = {
  "prod_Tp2pZybeOOoEhq": { sessions: 3, validityDays: 90 },
  "prod_Tp2pE7QdK9VryM": { sessions: 6, validityDays: 180 },
  "prod_Tp2pUYu4EmGjeu": { sessions: 12, validityDays: 365 },
};

const logStep = (step: string, details?: any) => {
  console.log(`[STRIPE-WEBHOOK] ${step}${details ? ` - ${JSON.stringify(details)}` : ''}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { apiVersion: "2025-08-27.basil" });
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get the raw body for signature verification
    const body = await req.text();
    
    // Verify webhook signature
    const signature = req.headers.get("stripe-signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    let event: Stripe.Event;
    
    if (webhookSecret && signature) {
      try {
        event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
        logStep("Webhook signature verified");
      } catch (err) {
        logStep("Webhook signature verification failed", { error: err instanceof Error ? err.message : "Unknown" });
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }
    } else {
      // Fallback for development/testing (not recommended for production)
      logStep("WARNING: No webhook secret or signature - skipping verification");
      event = JSON.parse(body);
    }
    
    logStep("Event received", { type: event.type, id: event.id });

    // Handle checkout.session.completed
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_email || session.customer_details?.email;
      const userId = session.metadata?.user_id;
      const customerId = session.customer as string;

      logStep("Checkout completed", { mode: session.mode, email: customerEmail, userId });

      if (session.mode === "subscription" && customerEmail) {
        const subscriptionId = session.subscription as string;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const productId = subscription.items.data[0]?.price.product as string;
        const tier = PRODUCT_TO_TIER[productId];

        logStep("Subscription details", { subscriptionId, productId, tier });

        if (tier) {
          let existingUserId = userId;
          
          if (!existingUserId) {
            const { data: users } = await supabaseAdmin.auth.admin.listUsers();
            const existingUser = users.users.find(u => u.email === customerEmail);
            existingUserId = existingUser?.id;
          }

          if (!existingUserId) {
            const { data: newUser } = await supabaseAdmin.auth.admin.createUser({
              email: customerEmail,
              email_confirm: true,
              user_metadata: { needs_password_setup: true, membership_tier: tier },
            });
            existingUserId = newUser.user?.id;
            logStep("New user created", { userId: existingUserId });
          }

          if (existingUserId) {
            const tierConfig = TIER_CONFIG[tier];
            const now = new Date();
            const { error } = await supabaseAdmin.from("profiles").upsert({
              user_id: existingUserId,
              membership_tier: tier,
              subscription_status: "active",
              subscription_start_date: new Date(subscription.current_period_start * 1000).toISOString(),
              subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              lesson_rate: tierConfig.lessonRate,
              monthly_credits: tierConfig.monthlyCredits,
              feedback_frequency: tierConfig.feedbackFrequency,
              credits_remaining: tierConfig.monthlyCredits === -1 ? 999 : tierConfig.monthlyCredits,
              hybrid_credits_remaining: tierConfig.hybridCredits,
              hybrid_credits_reset_date: now.toISOString(),
              is_free_tier: false,
            }, { onConflict: "user_id" });
            
            if (error) {
              logStep("Profile update error", { error: error.message });
            } else {
              logStep("Profile updated for subscription", { tier, userId: existingUserId, hybridCredits: tierConfig.hybridCredits });
            }

            // Sync to GoHighLevel
            const priceAmount = subscription.items.data[0]?.price?.unit_amount;
            await syncToGHL("sync_purchase", {
              email: customerEmail,
              tier,
              amount: priceAmount ? priceAmount / 100 : 0,
              paymentType: "subscription",
            });
          }
        }
      }

      if (session.mode === "payment" && userId) {
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        for (const item of lineItems.data) {
          const productId = item.price?.product as string;
          const packageInfo = PACKAGE_MAPPING[productId];
          if (packageInfo) {
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + packageInfo.validityDays);
            const { error } = await supabaseAdmin.from("purchased_packages").insert({
              user_id: userId,
              sessions_total: packageInfo.sessions,
              sessions_remaining: packageInfo.sessions,
              expires_at: expiresAt.toISOString(),
              stripe_payment_id: session.payment_intent as string,
              status: "active",
            });
            if (error) {
              logStep("Package insert error", { error: error.message });
            } else {
              logStep("Package purchased", { userId, sessions: packageInfo.sessions });

              // Sync package purchase to GoHighLevel
              await syncToGHL("sync_purchase", {
                email: customerEmail,
                tier: `${packageInfo.sessions}-Pack`,
                amount: item.amount_total ? item.amount_total / 100 : 0,
                paymentType: "package",
              });
            }
          }
        }
      }
    }

    // Handle subscription created
    if (event.type === "customer.subscription.created") {
      const subscription = event.data.object as Stripe.Subscription;
      logStep("Subscription created", { subscriptionId: subscription.id, status: subscription.status });
      // Most logic is handled in checkout.session.completed, but we log this for tracking
    }

    // Handle subscription updated (plan changes, renewals)
    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const productId = subscription.items.data[0]?.price.product as string;
      const tier = PRODUCT_TO_TIER[productId];

      logStep("Subscription updated", { subscriptionId: subscription.id, status: subscription.status, tier });

      // Find user by stripe_customer_id
      const { data: profiles } = await supabaseAdmin
        .from("profiles")
        .select("user_id, hybrid_credits_reset_date")
        .eq("stripe_customer_id", customerId)
        .limit(1);

      if (profiles && profiles.length > 0 && tier) {
        const tierConfig = TIER_CONFIG[tier];
        const profile = profiles[0];
        const now = new Date();
        
        const updateData: Record<string, any> = {
          membership_tier: tier,
          subscription_status: subscription.status === "active" ? "active" : subscription.status,
          subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
          lesson_rate: tierConfig.lessonRate,
          monthly_credits: tierConfig.monthlyCredits,
          feedback_frequency: tierConfig.feedbackFrequency,
        };

        // Reset credits on renewal (new billing period)
        if (subscription.status === "active") {
          updateData.credits_remaining = tierConfig.monthlyCredits === -1 ? 999 : tierConfig.monthlyCredits;
          
          // Reset hybrid credits if it's a new billing period (more than 25 days since last reset)
          const lastReset = profile.hybrid_credits_reset_date ? new Date(profile.hybrid_credits_reset_date) : null;
          const daysSinceReset = lastReset ? (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24) : 999;
          
          if (daysSinceReset > 25) {
            updateData.hybrid_credits_remaining = tierConfig.hybridCredits;
            updateData.hybrid_credits_reset_date = now.toISOString();
            logStep("Hybrid credits reset", { userId: profile.user_id, credits: tierConfig.hybridCredits });
          }
        }

        const { error } = await supabaseAdmin
          .from("profiles")
          .update(updateData)
          .eq("user_id", profile.user_id);

        if (error) {
          logStep("Subscription update error", { error: error.message });
        } else {
          logStep("Profile updated for subscription change", { userId: profile.user_id, tier });
        }
      }
    }

    // Handle subscription deleted (cancellation)
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      logStep("Subscription cancelled", { subscriptionId: subscription.id });

      const { data: profiles } = await supabaseAdmin
        .from("profiles")
        .select("user_id")
        .eq("stripe_customer_id", customerId)
        .limit(1);

      if (profiles && profiles.length > 0) {
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            subscription_status: "cancelled",
            membership_tier: null,
            stripe_subscription_id: null,
            monthly_credits: 0,
            credits_remaining: 0,
            hybrid_credits_remaining: 0,
            is_free_tier: true,
          })
          .eq("user_id", profiles[0].user_id);

        if (error) {
          logStep("Subscription cancellation error", { error: error.message });
        } else {
          logStep("Profile updated for cancellation", { userId: profiles[0].user_id });
        }
      }
    }

    // Handle successful invoice payment
    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice;
      logStep("Invoice payment succeeded", { 
        invoiceId: invoice.id, 
        customerId: invoice.customer,
        amountPaid: invoice.amount_paid / 100,
        currency: invoice.currency
      });

      // If this is a subscription invoice, credits might need to be reset
      if (invoice.subscription) {
        const customerId = invoice.customer as string;
        const { data: profiles } = await supabaseAdmin
          .from("profiles")
          .select("user_id, membership_tier, monthly_credits, hybrid_credits_reset_date")
          .eq("stripe_customer_id", customerId)
          .limit(1);

        if (profiles && profiles.length > 0) {
          const profile = profiles[0];
          if (profile.membership_tier && TIER_CONFIG[profile.membership_tier]) {
            const tierConfig = TIER_CONFIG[profile.membership_tier];
            const now = new Date();
            
            const updateData: Record<string, any> = {
              subscription_status: "active",
              credits_remaining: tierConfig.monthlyCredits === -1 ? 999 : tierConfig.monthlyCredits,
            };
            
            // Reset hybrid credits on invoice payment (monthly renewal)
            const lastReset = profile.hybrid_credits_reset_date ? new Date(profile.hybrid_credits_reset_date) : null;
            const daysSinceReset = lastReset ? (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24) : 999;
            
            if (daysSinceReset > 25 && tierConfig.hybridCredits > 0) {
              updateData.hybrid_credits_remaining = tierConfig.hybridCredits;
              updateData.hybrid_credits_reset_date = now.toISOString();
              logStep("Hybrid credits reset on invoice", { userId: profile.user_id, credits: tierConfig.hybridCredits });
            }
            
            const { error } = await supabaseAdmin
              .from("profiles")
              .update(updateData)
              .eq("user_id", profile.user_id);

            if (error) {
              logStep("Credits reset error", { error: error.message });
            } else {
              logStep("Credits reset on invoice payment", { userId: profile.user_id });
            }
          }
        }
      }
    }

    // Handle failed invoice payment
    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      logStep("Invoice payment failed", { 
        invoiceId: invoice.id, 
        customerId,
        attemptCount: invoice.attempt_count
      });

      const { data: profiles } = await supabaseAdmin
        .from("profiles")
        .select("user_id")
        .eq("stripe_customer_id", customerId)
        .limit(1);

      if (profiles && profiles.length > 0) {
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({ subscription_status: "past_due" })
          .eq("user_id", profiles[0].user_id);

        if (error) {
          logStep("Payment failed update error", { error: error.message });
        } else {
          logStep("Profile updated for payment failure", { userId: profiles[0].user_id });
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    logStep("ERROR", { message: error instanceof Error ? error.message : "Unknown" });
    return new Response(JSON.stringify({ error: "Webhook error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});