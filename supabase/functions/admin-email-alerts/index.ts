import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AlertRequest {
  alertType: "new_registration" | "flagged_content" | "important_activity";
  data: {
    email?: string;
    fullName?: string;
    userId?: string;
    details?: string;
  };
}

const getEmailTemplate = (alertType: string, data: AlertRequest["data"]) => {
  switch (alertType) {
    case "new_registration":
      return {
        subject: "🎉 New Member Registration - Swing Institute",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #111111; border-radius: 12px; overflow: hidden; border: 1px solid #222;">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #C8A97E 0%, #8B7355 100%); padding: 32px; text-align: center;">
                <h1 style="margin: 0; color: #000; font-size: 24px; font-weight: 700;">
                  New Member Alert
                </h1>
              </div>
              
              <!-- Content -->
              <div style="padding: 32px;">
                <div style="background-color: #1a1a1a; border-radius: 8px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #C8A97E;">
                  <h2 style="margin: 0 0 16px 0; color: #fff; font-size: 18px;">
                    A new member just signed up!
                  </h2>
                  <div style="color: #888; font-size: 14px; line-height: 1.6;">
                    <p style="margin: 8px 0;"><strong style="color: #C8A97E;">Name:</strong> <span style="color: #fff;">${data.fullName || "Not provided"}</span></p>
                    <p style="margin: 8px 0;"><strong style="color: #C8A97E;">Email:</strong> <span style="color: #fff;">${data.email || "Not provided"}</span></p>
                    <p style="margin: 8px 0;"><strong style="color: #C8A97E;">Time:</strong> <span style="color: #fff;">${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} ET</span></p>
                  </div>
                </div>
                
                <!-- CTA Button -->
                <a href="https://swinginsitute.lovable.app/admin/members" 
                   style="display: block; text-align: center; background: linear-gradient(135deg, #C8A97E 0%, #8B7355 100%); color: #000; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
                  View Member Profile →
                </a>
              </div>
              
              <!-- Footer -->
              <div style="background-color: #0a0a0a; padding: 24px; text-align: center; border-top: 1px solid #222;">
                <p style="margin: 0; color: #666; font-size: 12px;">
                  Swing Institute Admin Notification System
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      };
    default:
      return {
        subject: "Swing Institute - Admin Alert",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Admin Alert</h1>
            <p>${data.details || "You have a new notification."}</p>
          </div>
        `,
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { alertType, data }: AlertRequest = await req.json();

    console.log(`Processing admin alert: ${alertType}`, data);

    // Initialize Supabase client with service role
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Get all admin user IDs
    const { data: adminRoles, error: rolesError } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

    if (rolesError) {
      console.error("Error fetching admin roles:", rolesError);
      throw rolesError;
    }

    if (!adminRoles || adminRoles.length === 0) {
      console.log("No admins found to notify");
      return new Response(
        JSON.stringify({ message: "No admins found" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get admin emails from auth.users
    const adminUserIds = adminRoles.map((r) => r.user_id);
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();

    if (usersError) {
      console.error("Error fetching users:", usersError);
      throw usersError;
    }

    const adminEmails = users
      ?.filter((u) => adminUserIds.includes(u.id))
      .map((u) => u.email)
      .filter((email): email is string => !!email) || [];

    if (adminEmails.length === 0) {
      console.log("No admin emails found");
      return new Response(
        JSON.stringify({ message: "No admin emails found" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Sending email to ${adminEmails.length} admin(s)`);

    // Generate email content
    const emailContent = getEmailTemplate(alertType, data);

    // Send emails to all admins
    const emailPromises = adminEmails.map((email) =>
      resend.emails.send({
        from: "Swing Institute <onboarding@resend.dev>",
        to: [email],
        subject: emailContent.subject,
        html: emailContent.html,
      })
    );

    const results = await Promise.allSettled(emailPromises);
    
    const successCount = results.filter((r) => r.status === "fulfilled").length;
    const failedCount = results.filter((r) => r.status === "rejected").length;

    console.log(`Emails sent: ${successCount} successful, ${failedCount} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        sent: successCount,
        failed: failedCount,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in admin-email-alerts function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
