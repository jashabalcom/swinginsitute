import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingConfirmationRequest {
  bookingId: string;
  customerEmail: string;
  customerName: string;
  coachEmail?: string;
  serviceName: string;
  startTime: string;
  endTime: string;
  paymentMethod: string;
  amountPaid?: number;
}

const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  return {
    date: date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    time: date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  };
};

const logStep = (step: string, details?: any) => {
  console.log(`[SEND-BOOKING-CONFIRMATION] ${step}${details ? ` - ${JSON.stringify(details)}` : ''}`);
};

const sendEmail = async (to: string, subject: string, html: string) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Swing Institute <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to send email: ${errorText}`);
  }

  return response.json();
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      bookingId,
      customerEmail,
      customerName,
      coachEmail,
      serviceName,
      startTime,
      endTime,
      paymentMethod,
      amountPaid,
    }: BookingConfirmationRequest = await req.json();

    logStep("Sending booking confirmation", { bookingId, customerEmail, coachEmail });

    const { date, time } = formatDateTime(startTime);
    const endTimeFormatted = formatDateTime(endTime);

    // Customer confirmation email HTML
    const customerHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" style="max-width: 600px; background-color: #171717; border-radius: 16px; overflow: hidden;">
                <tr>
                  <td style="background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%); padding: 40px 32px; text-align: center;">
                    <h1 style="color: #0a0a0a; margin: 0; font-size: 28px; font-weight: 700;">Session Confirmed!</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 32px;">
                    <p style="color: #fafafa; font-size: 18px; margin: 0 0 24px;">Hi ${customerName || 'there'},</p>
                    <p style="color: #a1a1aa; font-size: 16px; margin: 0 0 32px; line-height: 1.6;">
                      Your training session has been confirmed. Here are your booking details:
                    </p>
                    <table width="100%" style="background-color: #262626; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #404040;">
                          <span style="color: #a1a1aa; font-size: 14px;">Service</span>
                          <p style="color: #fafafa; font-size: 16px; margin: 4px 0 0; font-weight: 600;">${serviceName}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #404040;">
                          <span style="color: #a1a1aa; font-size: 14px;">Date</span>
                          <p style="color: #fafafa; font-size: 16px; margin: 4px 0 0; font-weight: 600;">${date}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #404040;">
                          <span style="color: #a1a1aa; font-size: 14px;">Time</span>
                          <p style="color: #fafafa; font-size: 16px; margin: 4px 0 0; font-weight: 600;">${time} - ${endTimeFormatted.time}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0;">
                          <span style="color: #a1a1aa; font-size: 14px;">Location</span>
                          <p style="color: #fafafa; font-size: 16px; margin: 4px 0 0; font-weight: 600;">Swing Institute - Atlanta</p>
                        </td>
                      </tr>
                    </table>
                    <p style="color: #a1a1aa; font-size: 14px; margin: 0 0 24px; line-height: 1.6;">
                      <strong style="color: #f59e0b;">Reminder:</strong> Please arrive 10 minutes early to warm up.
                    </p>
                    <p style="color: #a1a1aa; font-size: 14px; margin: 0; line-height: 1.6;">
                      Need to reschedule? Please do so at least 24 hours in advance.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 24px 32px; background-color: #0a0a0a; text-align: center;">
                    <p style="color: #71717a; font-size: 12px; margin: 0;">© 2025 Swing Institute. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Send customer email
    const customerResult = await sendEmail(
      customerEmail,
      "Your Session is Confirmed! 🎯",
      customerHtml
    );
    logStep("Customer email sent", { result: customerResult });

    // Coach notification email HTML
    if (coachEmail) {
      const coachHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" style="max-width: 600px; background-color: #171717; border-radius: 16px; overflow: hidden;">
                  <tr>
                    <td style="background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); padding: 40px 32px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">New Session Booked</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px 32px;">
                      <p style="color: #fafafa; font-size: 18px; margin: 0 0 24px;">Coach,</p>
                      <p style="color: #a1a1aa; font-size: 16px; margin: 0 0 32px; line-height: 1.6;">
                        A new training session has been booked:
                      </p>
                      <table width="100%" style="background-color: #262626; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #404040;">
                            <span style="color: #a1a1aa; font-size: 14px;">Client</span>
                            <p style="color: #fafafa; font-size: 16px; margin: 4px 0 0; font-weight: 600;">${customerName || 'Guest'}</p>
                            <p style="color: #a1a1aa; font-size: 14px; margin: 4px 0 0;">${customerEmail}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #404040;">
                            <span style="color: #a1a1aa; font-size: 14px;">Service</span>
                            <p style="color: #fafafa; font-size: 16px; margin: 4px 0 0; font-weight: 600;">${serviceName}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #404040;">
                            <span style="color: #a1a1aa; font-size: 14px;">Date</span>
                            <p style="color: #fafafa; font-size: 16px; margin: 4px 0 0; font-weight: 600;">${date}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #404040;">
                            <span style="color: #a1a1aa; font-size: 14px;">Time</span>
                            <p style="color: #fafafa; font-size: 16px; margin: 4px 0 0; font-weight: 600;">${time} - ${endTimeFormatted.time}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0;">
                            <span style="color: #a1a1aa; font-size: 14px;">Payment</span>
                            <p style="color: #fafafa; font-size: 16px; margin: 4px 0 0; font-weight: 600;">
                              ${paymentMethod === 'package' ? 'Package Credit' : paymentMethod === 'credits' ? 'Membership Credit' : `$${amountPaid || 0}`}
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 24px 32px; background-color: #0a0a0a; text-align: center;">
                      <p style="color: #71717a; font-size: 12px; margin: 0;">© 2025 Swing Institute. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      const coachResult = await sendEmail(
        coachEmail,
        `New Booking: ${customerName || 'Guest'} - ${date}`,
        coachHtml
      );
      logStep("Coach email sent", { result: coachResult });
    }

    return new Response(
      JSON.stringify({ success: true, message: "Confirmation emails sent" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-booking-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
