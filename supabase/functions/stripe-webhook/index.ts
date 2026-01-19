import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Mapping of Stripe product IDs to membership tiers
const PRODUCT_TO_TIER: Record<string, string> = {
  "prod_Tp4siVSGD0PG7k": "starter",
  "prod_Tp4sKzTi2pyda4": "pro",
  "prod_Tp4sXGo0L4c2bn": "elite",
  "prod_Tp4s6jRZcg949u": "hybrid-core",
  "prod_Tp4t69jx1LlFu7": "hybrid-pro",
};

const TIER_CONFIG: Record<string, { lessonRate: number; monthlyCredits: number; feedbackFrequency: string }> = {
  "starter": { lessonRate: 145, monthlyCredits: 2, feedbackFrequency: "weekly" },
  "pro": { lessonRate: 115, monthlyCredits: 4, feedbackFrequency: "priority" },
  "elite": { lessonRate: 115, monthlyCredits: -1, feedbackFrequency: "priority" },
  "hybrid-core": { lessonRate: 115, monthlyCredits: 4, feedbackFrequency: "priority" },
  "hybrid-pro": { lessonRate: 115, monthlyCredits: -1, feedbackFrequency: "priority" },
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

    const body = await req.text();
    const event: Stripe.Event = JSON.parse(body);
    logStep("Event received", { type: event.type });

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_email || session.customer_details?.email;
      const userId = session.metadata?.user_id;
      const customerId = session.customer as string;

      if (session.mode === "subscription" && customerEmail) {
        const subscriptionId = session.subscription as string;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const productId = subscription.items.data[0]?.price.product as string;
        const tier = PRODUCT_TO_TIER[productId];

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
            await supabaseAdmin.from("profiles").upsert({
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
            }, { onConflict: "user_id" });
            logStep("Profile updated", { tier, userId: existingUserId });
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
            await supabaseAdmin.from("purchased_packages").insert({
              user_id: userId,
              sessions_total: packageInfo.sessions,
              sessions_remaining: packageInfo.sessions,
              expires_at: expiresAt.toISOString(),
              stripe_payment_id: session.payment_intent as string,
              status: "active",
            });
          }
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
