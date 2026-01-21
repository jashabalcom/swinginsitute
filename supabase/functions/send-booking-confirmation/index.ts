import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
  emailType: 
    | 'confirmation-inperson'      // B1
    | 'confirmation-virtual'       // B2
    | 'reminder-24h'               // B3
    | 'reminder-2h'                // B4
    | 'reminder-15m'               // B5
    | 'reschedule'                 // B6
    | 'cancellation'               // B7
    | 'no-show'                    // B8
    | 'post-session'               // B9
    | 'calendar-invite';           // B10
  bookingId: string;
  customerEmail: string;
  customerName: string;
  coachEmail?: string;
  serviceName: string;
  startTime: string;
  endTime: string;
  paymentMethod?: string;
  amountPaid?: number;
  // Virtual call fields
  zoomLink?: string;
  zoomMeetingId?: string;
  zoomPasscode?: string;
  // Reschedule fields
  oldDate?: string;
  oldTime?: string;
  // Post-session fields
  drillName?: string;
  drillReps?: string;
  focusArea?: string;
  // Credit restoration
  creditRestored?: boolean;
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
    }),
    shortDate: date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  };
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  console.log(`[BOOKING-EMAIL] ${step}${details ? ` - ${JSON.stringify(details)}` : ''}`);
};

// Premium email styles
const styles = {
  body: `margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;`,
  container: `background-color: #0a0a0a; padding: 40px 20px;`,
  card: `max-width: 600px; background-color: #171717; border-radius: 16px; overflow: hidden;`,
  headerGold: `background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%); padding: 40px 32px; text-align: center;`,
  headerBlue: `background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); padding: 40px 32px; text-align: center;`,
  headerRed: `background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 40px 32px; text-align: center;`,
  headerGreen: `background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 40px 32px; text-align: center;`,
  headerTitle: `color: #0a0a0a; margin: 0; font-size: 28px; font-weight: 700;`,
  headerTitleLight: `color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;`,
  content: `padding: 40px 32px;`,
  greeting: `color: #fafafa; font-size: 18px; margin: 0 0 24px;`,
  bodyText: `color: #a1a1aa; font-size: 16px; margin: 0 0 32px; line-height: 1.7;`,
  detailsBox: `background-color: #262626; border-radius: 12px; padding: 24px; margin-bottom: 32px;`,
  detailRow: `padding: 12px 0; border-bottom: 1px solid #404040;`,
  detailRowLast: `padding: 12px 0;`,
  detailLabel: `color: #a1a1aa; font-size: 14px;`,
  detailValue: `color: #fafafa; font-size: 16px; margin: 4px 0 0; font-weight: 600;`,
  detailSubvalue: `color: #a1a1aa; font-size: 14px; margin: 4px 0 0;`,
  divider: `border: none; border-top: 1px solid #404040; margin: 24px 0;`,
  highlight: `color: #f59e0b; font-weight: 600;`,
  note: `color: #a1a1aa; font-size: 14px; margin: 0 0 24px; line-height: 1.6;`,
  button: `display: inline-block; background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%); color: #0a0a0a; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;`,
  buttonBlue: `display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;`,
  footer: `padding: 24px 32px; background-color: #0a0a0a; text-align: center;`,
  footerText: `color: #71717a; font-size: 12px; margin: 0;`,
  signature: `color: #a1a1aa; font-size: 14px; margin: 24px 0 0; line-height: 1.6;`,
};

const generateEmailWrapper = (headerStyle: string, headerTitle: string, content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="${styles.body}">
  <table width="100%" cellpadding="0" cellspacing="0" style="${styles.container}">
    <tr>
      <td align="center">
        <table width="100%" style="${styles.card}">
          <tr>
            <td style="${headerStyle}">
              <h1 style="${headerStyle.includes('linear-gradient(135deg, #d97706') ? styles.headerTitle : styles.headerTitleLight}">${headerTitle}</h1>
            </td>
          </tr>
          <tr>
            <td style="${styles.content}">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="${styles.footer}">
              <p style="${styles.footerText}">© 2026 Swing Institute. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// B1: In-Person Session Confirmation
const generateInPersonConfirmation = (data: BookingEmailRequest, startFormatted: ReturnType<typeof formatDateTime>, endFormatted: ReturnType<typeof formatDateTime>) => {
  const content = `
    <p style="${styles.greeting}">Hi ${data.customerName || 'there'},</p>
    <p style="${styles.bodyText}">
      Your training session is confirmed. Here are your details:
    </p>
    
    <table width="100%" style="${styles.detailsBox}">
      <tr><td style="${styles.detailRow}">
        <span style="${styles.detailLabel}">Service</span>
        <p style="${styles.detailValue}">${data.serviceName}</p>
      </td></tr>
      <tr><td style="${styles.detailRow}">
        <span style="${styles.detailLabel}">Date</span>
        <p style="${styles.detailValue}">${startFormatted.date}</p>
      </td></tr>
      <tr><td style="${styles.detailRow}">
        <span style="${styles.detailLabel}">Time</span>
        <p style="${styles.detailValue}">${startFormatted.time} – ${endFormatted.time}</p>
      </td></tr>
      <tr><td style="${styles.detailRow}">
        <span style="${styles.detailLabel}">Location</span>
        <p style="${styles.detailValue}">Swing Institute — Atlanta</p>
      </td></tr>
      <tr><td style="${styles.detailRowLast}">
        <span style="${styles.detailLabel}">Coach</span>
        <p style="${styles.detailValue}">Jasha Balcom</p>
      </td></tr>
    </table>
    
    <p style="${styles.note}">
      <strong style="${styles.highlight}">What to Bring:</strong><br>
      • Baseball bat (if you have a preferred one)<br>
      • Athletic clothing and cleats<br>
      • Water bottle<br>
      • A positive attitude
    </p>
    
    <p style="${styles.note}">
      <strong style="${styles.highlight}">Reminder:</strong> Please arrive 10 minutes early to check in and warm up.
    </p>
    
    <p style="${styles.note}">
      Need to reschedule? Please do so at least 24 hours in advance.
    </p>
    
    <p style="${styles.signature}">
      See you soon!<br><br>
      — The Swing Institute Team
    </p>
  `;
  
  return {
    subject: `Your Session is Confirmed ✓`,
    preview: `${startFormatted.shortDate} at ${startFormatted.time} — here's everything you need to know.`,
    html: generateEmailWrapper(styles.headerGold, 'Session Confirmed!', content)
  };
};

// B2: Virtual Call Confirmation
const generateVirtualConfirmation = (data: BookingEmailRequest, startFormatted: ReturnType<typeof formatDateTime>, endFormatted: ReturnType<typeof formatDateTime>) => {
  const isParentCall = data.serviceName.toLowerCase().includes('parent') || data.serviceName.toLowerCase().includes('game plan');
  const isMindset = data.serviceName.toLowerCase().includes('mindset');
  
  const whatToExpect = isParentCall ? `
    <p style="${styles.note}">
      <strong style="${styles.highlight}">What to Expect:</strong><br>
      This is a focused conversation about your player's current situation and goals. Come prepared to share:<br>
      • Your biggest frustration with their development<br>
      • What you've tried so far<br>
      • What success looks like to you
    </p>
  ` : isMindset ? `
    <p style="${styles.note}">
      <strong style="${styles.highlight}">What to Expect:</strong><br>
      We'll work through the mental side of the game. Come with an open mind and any specific situations you want to address.
    </p>
  ` : '';
  
  const content = `
    <p style="${styles.greeting}">Hi ${data.customerName || 'there'},</p>
    <p style="${styles.bodyText}">
      Great news — your call is confirmed.
    </p>
    
    <table width="100%" style="${styles.detailsBox}">
      <tr><td style="${styles.detailRow}">
        <span style="${styles.detailLabel}">Type</span>
        <p style="${styles.detailValue}">${data.serviceName}</p>
      </td></tr>
      <tr><td style="${styles.detailRow}">
        <span style="${styles.detailLabel}">Date</span>
        <p style="${styles.detailValue}">${startFormatted.date}</p>
      </td></tr>
      <tr><td style="${styles.detailRowLast}">
        <span style="${styles.detailLabel}">Time</span>
        <p style="${styles.detailValue}">${startFormatted.time} – ${endFormatted.time}</p>
      </td></tr>
    </table>
    
    ${data.zoomLink ? `
    <p style="${styles.note}">
      <strong style="${styles.highlight}">How to Join:</strong><br>
      Click the link below at your scheduled time:
    </p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="${data.zoomLink}" style="${styles.buttonBlue}">Join Zoom Call →</a>
    </p>
    ${data.zoomMeetingId ? `<p style="${styles.note}">Meeting ID: ${data.zoomMeetingId}${data.zoomPasscode ? `<br>Passcode: ${data.zoomPasscode}` : ''}</p>` : ''}
    ` : ''}
    
    ${whatToExpect}
    
    <p style="${styles.note}">
      Need to reschedule? Please do so at least 24 hours in advance.
    </p>
    
    <p style="${styles.signature}">
      Talk soon,<br><br>
      Coach Jasha Balcom<br>
      Swing Institute
    </p>
  `;
  
  return {
    subject: `Your Call with Coach Jasha is Confirmed`,
    preview: `${startFormatted.shortDate} at ${startFormatted.time} — Zoom link inside.`,
    html: generateEmailWrapper(styles.headerBlue, 'Call Confirmed!', content)
  };
};

// B3: 24-Hour Reminder
const generateReminder24h = (data: BookingEmailRequest, startFormatted: ReturnType<typeof formatDateTime>, endFormatted: ReturnType<typeof formatDateTime>) => {
  const isVirtual = !!data.zoomLink;
  
  const content = `
    <p style="${styles.greeting}">Hi ${data.customerName || 'there'},</p>
    <p style="${styles.bodyText}">
      Quick reminder: your training session is tomorrow.
    </p>
    
    <table width="100%" style="${styles.detailsBox}">
      <tr><td style="${styles.detailRow}">
        <span style="${styles.detailLabel}">Service</span>
        <p style="${styles.detailValue}">${data.serviceName}</p>
      </td></tr>
      <tr><td style="${styles.detailRow}">
        <span style="${styles.detailLabel}">Date</span>
        <p style="${styles.detailValue}">${startFormatted.date}</p>
      </td></tr>
      <tr><td style="${styles.detailRow}">
        <span style="${styles.detailLabel}">Time</span>
        <p style="${styles.detailValue}">${startFormatted.time} – ${endFormatted.time}</p>
      </td></tr>
      <tr><td style="${styles.detailRowLast}">
        <span style="${styles.detailLabel}">${isVirtual ? 'Join' : 'Location'}</span>
        <p style="${styles.detailValue}">${isVirtual ? `<a href="${data.zoomLink}" style="color: #3b82f6;">Join Zoom Call</a>` : 'Swing Institute — Atlanta'}</p>
      </td></tr>
    </table>
    
    <p style="${styles.note}">
      ${isVirtual ? 'Test your video and audio before the call.' : 'Remember to arrive 10 minutes early.'}
    </p>
    
    <p style="${styles.signature}">
      See you soon!<br>
      — Swing Institute
    </p>
  `;
  
  return {
    subject: `Reminder: Your session is tomorrow`,
    preview: `${data.serviceName} — ${startFormatted.shortDate} at ${startFormatted.time}`,
    html: generateEmailWrapper(styles.headerGold, 'Session Tomorrow', content)
  };
};

// B4: 2-Hour Reminder
const generateReminder2h = (data: BookingEmailRequest, startFormatted: ReturnType<typeof formatDateTime>, endFormatted: ReturnType<typeof formatDateTime>) => {
  const isVirtual = !!data.zoomLink;
  
  const content = `
    <p style="${styles.greeting}">Hi ${data.customerName || 'there'},</p>
    <p style="${styles.bodyText}">
      Your session starts in 2 hours.
    </p>
    
    <table width="100%" style="${styles.detailsBox}">
      <tr><td style="${styles.detailRow}">
        <span style="${styles.detailLabel}">Service</span>
        <p style="${styles.detailValue}">${data.serviceName}</p>
      </td></tr>
      <tr><td style="${styles.detailRowLast}">
        <span style="${styles.detailLabel}">Time</span>
        <p style="${styles.detailValue}">${startFormatted.time} – ${endFormatted.time}</p>
      </td></tr>
    </table>
    
    ${isVirtual ? `
    <p style="text-align: center; margin: 24px 0;">
      <a href="${data.zoomLink}" style="${styles.buttonBlue}">Join Zoom Call →</a>
    </p>
    ` : `
    <p style="${styles.note}">
      <strong style="${styles.highlight}">Location:</strong> Swing Institute — Atlanta<br>
      Arrive 10 minutes early.
    </p>
    `}
    
    <p style="${styles.signature}">
      See you soon!<br>
      — Swing Institute
    </p>
  `;
  
  return {
    subject: `2 hours until your session`,
    preview: `${data.serviceName} starts soon.`,
    html: generateEmailWrapper(styles.headerGold, 'Starting Soon', content)
  };
};

// B5: 15-Minute Reminder (Virtual Only)
const generateReminder15m = (data: BookingEmailRequest) => {
  const content = `
    <p style="${styles.greeting}">Hi ${data.customerName || 'there'},</p>
    <p style="${styles.bodyText}">
      Your call with Coach Jasha starts in 15 minutes.
    </p>
    
    <p style="text-align: center; margin: 32px 0;">
      <a href="${data.zoomLink}" style="${styles.buttonBlue}">Join Zoom Call →</a>
    </p>
    
    ${data.zoomMeetingId ? `
    <p style="${styles.note}">
      Meeting ID: ${data.zoomMeetingId}${data.zoomPasscode ? `<br>Passcode: ${data.zoomPasscode}` : ''}
    </p>
    ` : ''}
    
    <p style="${styles.note}">
      <strong style="${styles.highlight}">Quick tips:</strong><br>
      • Find a quiet space<br>
      • Have your questions ready<br>
      • Be on time — calls start promptly
    </p>
    
    <p style="${styles.signature}">
      See you there!<br>
      — Swing Institute
    </p>
  `;
  
  return {
    subject: `Your call starts in 15 minutes`,
    preview: `Click to join Zoom now.`,
    html: generateEmailWrapper(styles.headerBlue, 'Starting in 15 Min', content)
  };
};

// B6: Reschedule Confirmation
const generateRescheduleConfirmation = (data: BookingEmailRequest, startFormatted: ReturnType<typeof formatDateTime>, endFormatted: ReturnType<typeof formatDateTime>) => {
  const isVirtual = !!data.zoomLink;
  
  const content = `
    <p style="${styles.greeting}">Hi ${data.customerName || 'there'},</p>
    <p style="${styles.bodyText}">
      Your session has been rescheduled. Here are your updated details:
    </p>
    
    <table width="100%" style="${styles.detailsBox}">
      <tr><td style="${styles.detailRow}">
        <span style="${styles.detailLabel}">Service</span>
        <p style="${styles.detailValue}">${data.serviceName}</p>
      </td></tr>
      <tr><td style="${styles.detailRow}">
        <span style="${styles.detailLabel}">New Date</span>
        <p style="${styles.detailValue}">${startFormatted.date}</p>
      </td></tr>
      <tr><td style="${styles.detailRow}">
        <span style="${styles.detailLabel}">New Time</span>
        <p style="${styles.detailValue}">${startFormatted.time} – ${endFormatted.time}</p>
      </td></tr>
      <tr><td style="${styles.detailRowLast}">
        <span style="${styles.detailLabel}">${isVirtual ? 'Join' : 'Location'}</span>
        <p style="${styles.detailValue}">${isVirtual ? `<a href="${data.zoomLink}" style="color: #3b82f6;">Zoom Link</a>` : 'Swing Institute — Atlanta'}</p>
      </td></tr>
    </table>
    
    ${data.oldDate ? `
    <p style="${styles.note}">
      The original session on ${data.oldDate}${data.oldTime ? ` at ${data.oldTime}` : ''} has been canceled.
    </p>
    ` : ''}
    
    <p style="${styles.note}">
      Questions? Reply to this email.
    </p>
    
    <p style="${styles.signature}">
      — Swing Institute
    </p>
  `;
  
  return {
    subject: `Your session has been rescheduled`,
    preview: `New date: ${startFormatted.shortDate} at ${startFormatted.time}`,
    html: generateEmailWrapper(styles.headerGold, 'Session Rescheduled', content)
  };
};

// B7: Cancellation Confirmation
const generateCancellationConfirmation = (data: BookingEmailRequest, startFormatted: ReturnType<typeof formatDateTime>, endFormatted: ReturnType<typeof formatDateTime>) => {
  const content = `
    <p style="${styles.greeting}">Hi ${data.customerName || 'there'},</p>
    <p style="${styles.bodyText}">
      Your session has been canceled:
    </p>
    
    <table width="100%" style="${styles.detailsBox}">
      <tr><td style="${styles.detailRow}">
        <span style="${styles.detailLabel}">Service</span>
        <p style="${styles.detailValue}">${data.serviceName}</p>
      </td></tr>
      <tr><td style="${styles.detailRow}">
        <span style="${styles.detailLabel}">Date</span>
        <p style="${styles.detailValue}">${startFormatted.date}</p>
      </td></tr>
      <tr><td style="${styles.detailRowLast}">
        <span style="${styles.detailLabel}">Time</span>
        <p style="${styles.detailValue}">${startFormatted.time} – ${endFormatted.time}</p>
      </td></tr>
    </table>
    
    ${data.creditRestored ? `
    <p style="${styles.note}">
      Your ${data.paymentMethod === 'package' ? 'package credit' : 'membership credit'} has been restored and is available for rebooking.
    </p>
    ` : ''}
    
    <p style="${styles.note}">
      Ready to reschedule?
    </p>
    
    <p style="text-align: center; margin: 24px 0;">
      <a href="https://swinginsitute.lovable.app/book" style="${styles.button}">Book a New Session →</a>
    </p>
    
    <p style="${styles.note}">
      If this was canceled in error, please reply to this email or call us directly.
    </p>
    
    <p style="${styles.signature}">
      — Swing Institute
    </p>
  `;
  
  return {
    subject: `Your session has been canceled`,
    preview: `${startFormatted.shortDate} session canceled — here's how to rebook.`,
    html: generateEmailWrapper(styles.headerRed, 'Session Canceled', content)
  };
};

// B8: No-Show Follow-Up
const generateNoShowFollowUp = (data: BookingEmailRequest, startFormatted: ReturnType<typeof formatDateTime>) => {
  const content = `
    <p style="${styles.greeting}">Hi ${data.customerName || 'there'},</p>
    <p style="${styles.bodyText}">
      We noticed you weren't able to make your session today.
    </p>
    
    <table width="100%" style="${styles.detailsBox}">
      <tr><td style="${styles.detailRow}">
        <span style="${styles.detailLabel}">Missed Session</span>
        <p style="${styles.detailValue}">${data.serviceName}</p>
      </td></tr>
      <tr><td style="${styles.detailRow}">
        <span style="${styles.detailLabel}">Date</span>
        <p style="${styles.detailValue}">${startFormatted.date}</p>
      </td></tr>
      <tr><td style="${styles.detailRowLast}">
        <span style="${styles.detailLabel}">Time</span>
        <p style="${styles.detailValue}">${startFormatted.time}</p>
      </td></tr>
    </table>
    
    <p style="${styles.bodyText}">
      Things happen — we understand. But to keep your training on track, we recommend rescheduling as soon as possible.
    </p>
    
    <p style="text-align: center; margin: 24px 0;">
      <a href="https://swinginsitute.lovable.app/book" style="${styles.button}">Reschedule Now →</a>
    </p>
    
    <p style="${styles.note}">
      <strong style="${styles.highlight}">Important:</strong> Per our policy, sessions not canceled 24 hours in advance may not be refunded.
    </p>
    
    <p style="${styles.note}">
      If there was an emergency or this was a mistake, please reply to this email and we'll work with you.
    </p>
    
    <p style="${styles.signature}">
      — Swing Institute
    </p>
  `;
  
  return {
    subject: `We missed you today`,
    preview: `Your session was scheduled for ${startFormatted.time} — let's reschedule.`,
    html: generateEmailWrapper(styles.headerRed, 'Missed Session', content)
  };
};

// B9: Post-Session Follow-Up
const generatePostSessionFollowUp = (data: BookingEmailRequest) => {
  const content = `
    <p style="${styles.greeting}">Hi ${data.customerName || 'there'},</p>
    <p style="${styles.bodyText}">
      Hope you're feeling good after yesterday's session!
    </p>
    <p style="${styles.bodyText}">
      I wanted to check in and make sure everything clicked. If you have any questions about what we covered — or if something didn't make sense — just reply to this email.
    </p>
    
    ${data.drillName ? `
    <table width="100%" style="${styles.detailsBox}">
      <tr><td colspan="2" style="${styles.detailRow}">
        <span style="${styles.detailLabel}">Your Next Steps</span>
      </td></tr>
      <tr><td style="${styles.detailRow}">
        <span style="${styles.detailLabel}">Practice Drill</span>
        <p style="${styles.detailValue}">${data.drillName}</p>
      </td></tr>
      ${data.drillReps ? `
      <tr><td style="${styles.detailRow}">
        <span style="${styles.detailLabel}">Reps</span>
        <p style="${styles.detailValue}">${data.drillReps} per day</p>
      </td></tr>
      ` : ''}
      ${data.focusArea ? `
      <tr><td style="${styles.detailRowLast}">
        <span style="${styles.detailLabel}">Focus</span>
        <p style="${styles.detailValue}">${data.focusArea}</p>
      </td></tr>
      ` : ''}
    </table>
    ` : ''}
    
    <p style="${styles.bodyText}">
      Submit your next swing video through your dashboard so I can track your progress.
    </p>
    
    <p style="text-align: center; margin: 24px 0;">
      <a href="https://swinginsitute.lovable.app/dashboard" style="${styles.button}">Submit a Swing Video →</a>
    </p>
    
    <p style="${styles.note}">
      Keep putting in the work. Progress compounds.
    </p>
    
    <p style="${styles.signature}">
      — Coach Jasha
    </p>
  `;
  
  return {
    subject: `How was your session?`,
    preview: `Quick check-in from Coach Jasha.`,
    html: generateEmailWrapper(styles.headerGreen, 'Session Complete', content)
  };
};

// B10: Calendar Invite
const generateCalendarInvite = (data: BookingEmailRequest, startFormatted: ReturnType<typeof formatDateTime>, endFormatted: ReturnType<typeof formatDateTime>) => {
  const content = `
    <p style="${styles.greeting}">Hi ${data.customerName || 'there'},</p>
    <p style="${styles.bodyText}">
      Here's a calendar invite for your upcoming session:
    </p>
    
    <table width="100%" style="${styles.detailsBox}">
      <tr><td style="${styles.detailRow}">
        <span style="${styles.detailLabel}">Service</span>
        <p style="${styles.detailValue}">${data.serviceName}</p>
      </td></tr>
      <tr><td style="${styles.detailRow}">
        <span style="${styles.detailLabel}">Date</span>
        <p style="${styles.detailValue}">${startFormatted.date}</p>
      </td></tr>
      <tr><td style="${styles.detailRowLast}">
        <span style="${styles.detailLabel}">Time</span>
        <p style="${styles.detailValue}">${startFormatted.time} – ${endFormatted.time}</p>
      </td></tr>
    </table>
    
    <p style="${styles.note}">
      This will add the session to Google Calendar, Apple Calendar, Outlook, or any calendar app you use.
    </p>
    
    <p style="${styles.signature}">
      — Swing Institute
    </p>
  `;
  
  return {
    subject: `Add your session to your calendar`,
    preview: `Download the calendar invite.`,
    html: generateEmailWrapper(styles.headerGold, 'Calendar Invite', content)
  };
};

// Coach notification email
const generateCoachNotification = (data: BookingEmailRequest, startFormatted: ReturnType<typeof formatDateTime>, endFormatted: ReturnType<typeof formatDateTime>) => {
  const content = `
    <p style="${styles.greeting}">Coach,</p>
    <p style="${styles.bodyText}">
      A new training session has been booked:
    </p>
    
    <table width="100%" style="${styles.detailsBox}">
      <tr><td style="${styles.detailRow}">
        <span style="${styles.detailLabel}">Client</span>
        <p style="${styles.detailValue}">${data.customerName || 'Guest'}</p>
        <p style="${styles.detailSubvalue}">${data.customerEmail}</p>
      </td></tr>
      <tr><td style="${styles.detailRow}">
        <span style="${styles.detailLabel}">Service</span>
        <p style="${styles.detailValue}">${data.serviceName}</p>
      </td></tr>
      <tr><td style="${styles.detailRow}">
        <span style="${styles.detailLabel}">Date</span>
        <p style="${styles.detailValue}">${startFormatted.date}</p>
      </td></tr>
      <tr><td style="${styles.detailRow}">
        <span style="${styles.detailLabel}">Time</span>
        <p style="${styles.detailValue}">${startFormatted.time} – ${endFormatted.time}</p>
      </td></tr>
      <tr><td style="${styles.detailRowLast}">
        <span style="${styles.detailLabel}">Payment</span>
        <p style="${styles.detailValue}">
          ${data.paymentMethod === 'package' ? 'Package Credit' : data.paymentMethod === 'credits' ? 'Membership Credit' : `$${data.amountPaid || 0}`}
        </p>
      </td></tr>
    </table>
  `;
  
  return {
    subject: `New Booking: ${data.customerName || 'Guest'} - ${startFormatted.shortDate}`,
    html: generateEmailWrapper(styles.headerBlue, 'New Session Booked', content)
  };
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
    const data: BookingEmailRequest = await req.json();
    
    // Default to in-person confirmation for backwards compatibility
    const emailType = data.emailType || 'confirmation-inperson';
    
    logStep("Processing booking email", { emailType, bookingId: data.bookingId, customerEmail: data.customerEmail });

    const startFormatted = formatDateTime(data.startTime);
    const endFormatted = formatDateTime(data.endTime);

    let emailContent: { subject: string; preview?: string; html: string };
    
    switch (emailType) {
      case 'confirmation-inperson':
        emailContent = generateInPersonConfirmation(data, startFormatted, endFormatted);
        break;
      case 'confirmation-virtual':
        emailContent = generateVirtualConfirmation(data, startFormatted, endFormatted);
        break;
      case 'reminder-24h':
        emailContent = generateReminder24h(data, startFormatted, endFormatted);
        break;
      case 'reminder-2h':
        emailContent = generateReminder2h(data, startFormatted, endFormatted);
        break;
      case 'reminder-15m':
        emailContent = generateReminder15m(data);
        break;
      case 'reschedule':
        emailContent = generateRescheduleConfirmation(data, startFormatted, endFormatted);
        break;
      case 'cancellation':
        emailContent = generateCancellationConfirmation(data, startFormatted, endFormatted);
        break;
      case 'no-show':
        emailContent = generateNoShowFollowUp(data, startFormatted);
        break;
      case 'post-session':
        emailContent = generatePostSessionFollowUp(data);
        break;
      case 'calendar-invite':
        emailContent = generateCalendarInvite(data, startFormatted, endFormatted);
        break;
      default:
        emailContent = generateInPersonConfirmation(data, startFormatted, endFormatted);
    }

    // Send customer email
    const customerResult = await sendEmail(
      data.customerEmail,
      emailContent.subject,
      emailContent.html
    );
    logStep("Customer email sent", { result: customerResult });

    // Send coach notification for confirmations only
    if (data.coachEmail && (emailType === 'confirmation-inperson' || emailType === 'confirmation-virtual')) {
      const coachEmail = generateCoachNotification(data, startFormatted, endFormatted);
      const coachResult = await sendEmail(
        data.coachEmail,
        coachEmail.subject,
        coachEmail.html
      );
      logStep("Coach email sent", { result: coachResult });
    }

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully", emailType }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error in send-booking-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
