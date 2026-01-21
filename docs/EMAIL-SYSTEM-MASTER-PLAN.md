# The Swing Institute - Complete Email System

> **Master Email Architecture & Copy Document**  
> Version 1.0 | January 2026  
> Designed for premium, professional communication

---

## TABLE OF CONTENTS

1. [Master Action → Email Map](#1-master-action--email-map)
2. [Email Categories Overview](#2-email-categories-overview)
3. [Complete Email Sequences](#3-complete-email-sequences)
   - A. Quiz & Funnel Emails
   - B. Booking & Appointment Emails
   - C. Purchase & Payment Emails
   - D. Membership & Onboarding Emails
   - E. Training & Engagement Emails
   - F. Reminder & Notification Emails
   - G. Upgrade & Retention Emails
   - H. Admin & System Emails
4. [Automation & Trigger Logic](#4-automation--trigger-logic)
5. [GoHighLevel Integration Notes](#5-gohighlevel-integration-notes)
6. [Recommendations & Improvements](#6-recommendations--improvements)

---

## 1. MASTER ACTION → EMAIL MAP

### User Actions & Required Emails

| Action | Email Required | Type | Follow-up? | SMS Pair? |
|--------|----------------|------|------------|-----------|
| **QUIZ & FUNNEL** |
| Quiz completed + opt-in | ✅ | Engagement | Yes (x2) | Optional |
| Quiz abandoned (exit intent) | ✅ | Engagement | No | No |
| **BOOKINGS** |
| Parent Game Plan Call booked | ✅ | Transactional | Yes (reminders) | Recommended |
| Mindset Session booked | ✅ | Transactional | Yes (reminders) | Recommended |
| Swing Assessment booked | ✅ | Transactional | Yes (reminders) | Recommended |
| Private Lesson booked | ✅ | Transactional | Yes (reminders) | Recommended |
| Booking rescheduled | ✅ | Transactional | No | Optional |
| Booking canceled | ✅ | Transactional | Yes (re-book) | No |
| No-show occurred | ✅ | Engagement | No | No |
| **PURCHASES** |
| Membership purchased | ✅ | Transactional | Yes (onboarding) | No |
| Lesson package purchased | ✅ | Transactional | No | No |
| One-time payment (assessment) | ✅ | Transactional | No | No |
| Payment failed | ✅ | Transactional | Yes (retry) | Recommended |
| Payment resolved | ✅ | Transactional | No | No |
| **ACCOUNT** |
| Account created | ✅ | Transactional | No | No |
| Password reset requested | ✅ | Transactional | No | No |
| Email verification | ✅ | Transactional | No | No |
| **TRAINING** |
| First swing submitted | ✅ | Engagement | No | No |
| Coach review completed | ✅ | Engagement | No | Recommended |
| Phase progression unlocked | ✅ | Engagement | No | No |
| **LIFECYCLE** |
| Credits expiring (7 days) | ✅ | Engagement | Yes (3 days) | No |
| Credits renewed | ✅ | Informational | No | No |
| Inactivity (7 days) | ✅ | Engagement | Yes (14 days) | No |
| Subscription renewal | ✅ | Transactional | No | No |
| Subscription canceled | ✅ | Transactional | No | No |
| **ADMIN** |
| Announcement | ✅ | Informational | No | Optional |

---

## 2. EMAIL CATEGORIES OVERVIEW

### Category Breakdown

| Category | Email Count | Priority |
|----------|-------------|----------|
| A. Quiz & Funnel | 4 | High |
| B. Booking & Appointment | 10 | Critical |
| C. Purchase & Payment | 5 | Critical |
| D. Membership & Onboarding | 6 | High |
| E. Training & Engagement | 5 | Medium |
| F. Reminder & Notification | 4 | Critical |
| G. Upgrade & Retention | 6 | Medium |
| H. Admin & System | 4 | High |
| **TOTAL** | **44 emails** | |

---

## 3. COMPLETE EMAIL SEQUENCES

---

### A. QUIZ & FUNNEL EMAILS

---

#### A1. Quiz Completion Confirmation

**Trigger:** Quiz opt-in form submitted  
**Delay:** Immediate  
**GHL Tags:** `Quiz Completed`, `Profile: [Result]`

**Subject:** Your Swing Assessment Results Are Ready  
**Preview:** See exactly where [Player Name] stands — and what to do next.

---

**Email Body:**

```
Hi [Parent First Name],

Thank you for completing the Swing Assessment Quiz for [Player Name].

Your results are ready, and they reveal something important about where [Player Name] currently stands — and what it will take to reach the next level.

━━━━━━━━━━━━━━━━━━━━━━

YOUR RESULT: [PROFILE NAME]

[Brief 2-sentence description of what this profile means]

━━━━━━━━━━━━━━━━━━━━━━

WHAT THIS MEANS

Based on your answers, [Player Name] is in a stage where [specific insight based on profile]. The good news? With the right approach, this is completely addressable.

━━━━━━━━━━━━━━━━━━━━━━

YOUR RECOMMENDED NEXT STEP

The most valuable thing you can do right now is schedule a free Parent Game Plan Call with Coach Jasha.

In 20 minutes, you'll get:
• A clear picture of [Player Name]'s current development gaps
• A realistic timeline for improvement
• Whether Swing Institute is the right fit (no pressure)

[BUTTON: Schedule Your Free Call →]

━━━━━━━━━━━━━━━━━━━━━━

This call is for parents who are serious about their player's development — not for tire-kickers. If that's you, book your spot now.

Talk soon,

Coach Jasha Balcom
Swing Institute

P.S. Spots fill up quickly. If you're ready to get clarity, don't wait.
```

---

#### A2. Quiz Follow-Up #1 (No Action)

**Trigger:** 24 hours after quiz completion, no call booked  
**Delay:** 24 hours  
**GHL Tags:** `Quiz Follow-Up Sent`

**Subject:** Did you see [Player Name]'s results?  
**Preview:** Quick reminder — your assessment is waiting.

---

**Email Body:**

```
Hi [Parent First Name],

Just checking in.

Yesterday, you completed the Swing Assessment for [Player Name], and your results showed they're in the "[Profile Name]" stage.

I know life gets busy — but if you're still thinking about what to do next, here's the simple path forward:

Schedule a free 20-minute Parent Game Plan Call with me.

No sales pitch. No pressure. Just a straightforward conversation about where [Player Name] is now, where you want them to be, and whether we can help.

[BUTTON: Book Your Free Call →]

If this isn't the right time, no worries. But if you're serious about [Player Name]'s development, this call is the fastest way to get clarity.

— Coach Jasha
```

---

#### A3. Quiz Follow-Up #2 (Final)

**Trigger:** 72 hours after quiz completion, no call booked  
**Delay:** 72 hours  
**GHL Tags:** `Quiz Final Follow-Up`

**Subject:** Last chance to book your call  
**Preview:** After this, I'll assume you're all set.

---

**Email Body:**

```
Hi [Parent First Name],

This is my final follow-up about [Player Name]'s Swing Assessment.

I know you took the quiz for a reason — something about their development isn't sitting right with you. And I get it. Most parents I work with felt the same way before they reached out.

Here's the thing: the players who make real progress are the ones whose parents take action. Not think about it. Not wait for the "right time." They just do it.

If you're ready to stop guessing and start building a real plan for [Player Name], schedule your free call today.

[BUTTON: Schedule My Call →]

If not, that's okay too. I'll stop emailing, and I genuinely wish [Player Name] the best.

But if you're still on the fence — this is your moment.

— Coach Jasha

P.S. The call is free. The clarity is priceless.
```

---

#### A4. Quiz Abandonment Recovery

**Trigger:** Exit intent triggered, email captured  
**Delay:** Immediate  
**GHL Tags:** `Quiz Abandoned`, `Question Reached: [#]`

**Subject:** You didn't finish — here's your link  
**Preview:** Pick up right where you left off.

---

**Email Body:**

```
Hi there,

Looks like you started the Swing Assessment but didn't finish.

No worries — life happens. But since you took the time to begin, I'm guessing you're looking for answers about your player's development.

Here's your link to pick up where you left off:

[BUTTON: Continue My Assessment →]

It only takes 2 minutes, and you'll get personalized insights you won't find anywhere else.

— Coach Jasha
Swing Institute
```

---

### B. BOOKING & APPOINTMENT EMAILS

---

#### B1. Booking Confirmation (In-Person Session)

**Trigger:** Booking created  
**Delay:** Immediate  
**GHL Tags:** `Session Booked`, `Service: [Type]`

**Subject:** Your Session is Confirmed ✓  
**Preview:** [Date] at [Time] — here's everything you need to know.

---

**Email Body:**

```
Hi [First Name],

Your training session is confirmed. Here are your details:

━━━━━━━━━━━━━━━━━━━━━━

SESSION DETAILS

Service: [Service Name]
Date: [Full Date — e.g., Saturday, January 25, 2025]
Time: [Start Time] – [End Time]
Location: Swing Institute — Atlanta
Coach: Jasha Balcom

━━━━━━━━━━━━━━━━━━━━━━

WHAT TO BRING

• Baseball bat (if you have a preferred one)
• Athletic clothing and cleats
• Water bottle
• A positive attitude

━━━━━━━━━━━━━━━━━━━━━━

ARRIVAL

Please arrive 10 minutes early to check in and warm up.

━━━━━━━━━━━━━━━━━━━━━━

NEED TO RESCHEDULE?

Things come up — we get it. If you need to reschedule, please do so at least 24 hours in advance.

[BUTTON: Manage My Booking →]

━━━━━━━━━━━━━━━━━━━━━━

See you soon!

— The Swing Institute Team
```

---

#### B2. Booking Confirmation (Virtual Call)

**Trigger:** GoHighLevel booking confirmed  
**Delay:** Immediate  
**GHL Tags:** `Call Booked`, `Call Type: [Type]`

**Subject:** Your Call with Coach Jasha is Confirmed  
**Preview:** [Date] at [Time] — Zoom link inside.

---

**Email Body:**

```
Hi [First Name],

Great news — your call is confirmed.

━━━━━━━━━━━━━━━━━━━━━━

CALL DETAILS

Type: [Parent Game Plan Call / Mindset Session]
Date: [Full Date]
Time: [Start Time] – [End Time]
Duration: [20 / 30 / 60] minutes

━━━━━━━━━━━━━━━━━━━━━━

HOW TO JOIN

Click the link below at your scheduled time:

[BUTTON: Join Zoom Call →]
[Zoom URL]

Meeting ID: [ID]
Passcode: [Passcode]

━━━━━━━━━━━━━━━━━━━━━━

WHAT TO EXPECT

[If Parent Game Plan Call:]
This is a focused conversation about your player's current situation and goals. Come prepared to share:
• Your biggest frustration with their development
• What you've tried so far
• What success looks like to you

[If Mindset Session:]
We'll work through the mental side of the game. Come with an open mind and any specific situations you want to address.

━━━━━━━━━━━━━━━━━━━━━━

NEED TO RESCHEDULE?

Please reschedule at least 24 hours in advance:

[BUTTON: Reschedule Call →]

━━━━━━━━━━━━━━━━━━━━━━

Talk soon,

Coach Jasha Balcom
Swing Institute
```

---

#### B3. Reminder — 24 Hours Before

**Trigger:** 24 hours before session  
**Delay:** Scheduled  
**GHL Tags:** `Reminder Sent: 24h`

**Subject:** Reminder: Your session is tomorrow  
**Preview:** [Service Name] — [Date] at [Time]

---

**Email Body:**

```
Hi [First Name],

Quick reminder: your training session is tomorrow.

━━━━━━━━━━━━━━━━━━━━━━

[Service Name]
[Full Date]
[Start Time] – [End Time]

[If in-person:]
Location: Swing Institute — Atlanta

[If virtual:]
Zoom Link: [URL]

━━━━━━━━━━━━━━━━━━━━━━

[If in-person:]
Remember to arrive 10 minutes early.

[If virtual:]
Test your video and audio before the call.

━━━━━━━━━━━━━━━━━━━━━━

Need to reschedule? [Link]

See you soon!
— Swing Institute
```

---

#### B4. Reminder — 2 Hours Before

**Trigger:** 2 hours before session  
**Delay:** Scheduled  
**GHL Tags:** `Reminder Sent: 2h`

**Subject:** 2 hours until your session  
**Preview:** [Service Name] starts soon.

---

**Email Body:**

```
Hi [First Name],

Your session starts in 2 hours.

━━━━━━━━━━━━━━━━━━━━━━

[Service Name]
[Start Time] – [End Time]

[If in-person:]
Location: Swing Institute — Atlanta
Arrive 10 minutes early.

[If virtual:]
[BUTTON: Join Zoom Call →]

━━━━━━━━━━━━━━━━━━━━━━

See you soon!
— Swing Institute
```

---

#### B5. Reminder — 15 Minutes Before (Virtual Only)

**Trigger:** 15 minutes before virtual session  
**Delay:** Scheduled  
**GHL Tags:** `Reminder Sent: 15m`

**Subject:** Your call starts in 15 minutes  
**Preview:** Click to join Zoom now.

---

**Email Body:**

```
Hi [First Name],

Your call with Coach Jasha starts in 15 minutes.

[BUTTON: Join Zoom Call →]

Meeting ID: [ID]
Passcode: [Passcode]

━━━━━━━━━━━━━━━━━━━━━━

Quick tips:
• Find a quiet space
• Have your questions ready
• Be on time — calls start promptly

See you there!
— Swing Institute
```

---

#### B6. Reschedule Confirmation

**Trigger:** Booking rescheduled  
**Delay:** Immediate  
**GHL Tags:** `Session Rescheduled`

**Subject:** Your session has been rescheduled  
**Preview:** New date: [Date] at [Time]

---

**Email Body:**

```
Hi [First Name],

Your session has been rescheduled. Here are your updated details:

━━━━━━━━━━━━━━━━━━━━━━

NEW SESSION DETAILS

Service: [Service Name]
Date: [New Full Date]
Time: [New Start Time] – [New End Time]

[If in-person:]
Location: Swing Institute — Atlanta

[If virtual:]
Zoom Link: [URL]

━━━━━━━━━━━━━━━━━━━━━━

The original session on [Old Date] has been canceled.

[BUTTON: Add to Calendar →]

━━━━━━━━━━━━━━━━━━━━━━

Questions? Reply to this email.

— Swing Institute
```

---

#### B7. Cancellation Confirmation

**Trigger:** Booking canceled  
**Delay:** Immediate  
**GHL Tags:** `Session Canceled`

**Subject:** Your session has been canceled  
**Preview:** [Date] session canceled — here's how to rebook.

---

**Email Body:**

```
Hi [First Name],

Your session has been canceled:

━━━━━━━━━━━━━━━━━━━━━━

CANCELED SESSION

Service: [Service Name]
Date: [Full Date]
Time: [Start Time] – [End Time]

━━━━━━━━━━━━━━━━━━━━━━

[If package/credits used:]
Your [package credit / membership credit] has been restored and is available for rebooking.

━━━━━━━━━━━━━━━━━━━━━━

Ready to reschedule?

[BUTTON: Book a New Session →]

━━━━━━━━━━━━━━━━━━━━━━

If this was canceled in error, please reply to this email or call us directly.

— Swing Institute
```

---

#### B8. No-Show Follow-Up

**Trigger:** Session marked as no-show  
**Delay:** 1 hour after scheduled time  
**GHL Tags:** `No-Show`

**Subject:** We missed you today  
**Preview:** Your session was scheduled for [Time] — let's reschedule.

---

**Email Body:**

```
Hi [First Name],

We noticed you weren't able to make your session today.

━━━━━━━━━━━━━━━━━━━━━━

MISSED SESSION

Service: [Service Name]
Date: [Full Date]
Time: [Start Time]

━━━━━━━━━━━━━━━━━━━━━━

Things happen — we understand. But to keep your training on track, we recommend rescheduling as soon as possible.

[BUTTON: Reschedule Now →]

━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT: Per our policy, [no-show policy details — e.g., "sessions not canceled 24 hours in advance may not be refunded."]

If there was an emergency or this was a mistake, please reply to this email and we'll work with you.

— Swing Institute
```

---

#### B9. Post-Session Follow-Up

**Trigger:** 24 hours after completed session  
**Delay:** 24 hours  
**GHL Tags:** `Post-Session Sent`

**Subject:** How was your session?  
**Preview:** Quick check-in from Coach Jasha.

---

**Email Body:**

```
Hi [First Name],

Hope you're feeling good after yesterday's session!

I wanted to check in and make sure everything clicked. If you have any questions about what we covered — or if something didn't make sense — just reply to this email.

━━━━━━━━━━━━━━━━━━━━━━

YOUR NEXT STEPS

[If specific drill assigned:]
Practice drill: [Drill Name]
Reps: [X] per day
Focus: [Key Focus Area]

[If video submission encouraged:]
Submit your next swing video through your dashboard so I can track your progress.

━━━━━━━━━━━━━━━━━━━━━━

[BUTTON: Submit a Swing Video →]

━━━━━━━━━━━━━━━━━━━━━━

Keep putting in the work. Progress compounds.

— Coach Jasha
```

---

#### B10. Add to Calendar (iCal Attachment)

**Trigger:** Booking confirmed  
**Delay:** Immediate (sent with B1 or B2)  
**Attachment:** .ics calendar file

**Subject:** Add your session to your calendar  
**Preview:** Download the calendar invite.

---

**Email Body:**

```
Hi [First Name],

Here's a calendar invite for your upcoming session:

━━━━━━━━━━━━━━━━━━━━━━

[Service Name]
[Full Date]
[Start Time] – [End Time]

━━━━━━━━━━━━━━━━━━━━━━

[BUTTON: Download Calendar Invite (.ics)]

━━━━━━━━━━━━━━━━━━━━━━

This will add the session to Google Calendar, Apple Calendar, Outlook, or any calendar app you use.

— Swing Institute
```

---

### C. PURCHASE & PAYMENT EMAILS

---

#### C1. Subscription Confirmation (New Member)

**Trigger:** Stripe subscription created  
**Delay:** Immediate  
**GHL Tags:** `Tier: [Name]`, `Active Trainee`, `Member Since: [Date]`

**Subject:** Welcome to Swing Institute — Your Membership is Active  
**Preview:** You're officially in. Here's how to get started.

---

**Email Body:**

```
Hi [First Name],

Welcome to Swing Institute!

Your [Tier Name] membership is now active. You've made a decision that puts [Player Name] on a path to real improvement — and I'm honored to be part of it.

━━━━━━━━━━━━━━━━━━━━━━

YOUR MEMBERSHIP

Plan: [Tier Name]
Monthly Investment: $[Price]/month
Billing Date: [Next Billing Date]

━━━━━━━━━━━━━━━━━━━━━━

WHAT'S INCLUDED

[List of tier features]

━━━━━━━━━━━━━━━━━━━━━━

YOUR FIRST 3 STEPS

1. Log in to your dashboard
   [BUTTON: Go to My Dashboard →]

2. Submit your first swing video
   This is how I learn your player's current mechanics. The sooner you submit, the sooner we can start improving.

3. Explore the Training Room
   Connect with other families, ask questions, and see what other trainees are working on.

━━━━━━━━━━━━━━━━━━━━━━

I'll be in touch soon with your first personalized feedback.

Let's get to work.

— Coach Jasha Balcom
Swing Institute
```

---

#### C2. One-Time Purchase Confirmation (Package)

**Trigger:** Lesson package purchased  
**Delay:** Immediate  
**GHL Tags:** `Package: [Name]`

**Subject:** Your lesson package is ready  
**Preview:** [X] sessions available — book your first one now.

---

**Email Body:**

```
Hi [First Name],

Thank you for your purchase!

Your [Package Name] is now active. Here's what you've got:

━━━━━━━━━━━━━━━━━━━━━━

PACKAGE DETAILS

Package: [Package Name]
Sessions: [X] lessons
Valid Until: [Expiration Date]
Amount Paid: $[Amount]

━━━━━━━━━━━━━━━━━━━━━━

HOW TO USE YOUR SESSIONS

Simply book through your dashboard. Your package credits will be applied automatically at checkout.

[BUTTON: Book Your First Session →]

━━━━━━━━━━━━━━━━━━━━━━

Sessions expire [X] days from purchase. Don't let them go to waste!

— Swing Institute
```

---

#### C3. Payment Receipt

**Trigger:** Successful payment  
**Delay:** Immediate  
**GHL Tags:** None (transactional)

**Subject:** Payment received — $[Amount]  
**Preview:** Receipt for your Swing Institute purchase.

---

**Email Body:**

```
Hi [First Name],

We've received your payment. Here's your receipt:

━━━━━━━━━━━━━━━━━━━━━━

RECEIPT

Date: [Payment Date]
Amount: $[Amount]
Description: [Product/Service Name]
Payment Method: [Card Type] ending in [Last 4]

━━━━━━━━━━━━━━━━━━━━━━

Transaction ID: [Stripe Payment ID]

━━━━━━━━━━━━━━━━━━━━━━

Questions about this charge? Reply to this email.

— Swing Institute
```

---

#### C4. Payment Failed

**Trigger:** Stripe payment fails  
**Delay:** Immediate  
**GHL Tags:** `Payment Failed`

**Subject:** Action needed: Payment didn't go through  
**Preview:** Please update your payment method to keep your membership active.

---

**Email Body:**

```
Hi [First Name],

We tried to process your payment, but it didn't go through.

━━━━━━━━━━━━━━━━━━━━━━

PAYMENT DETAILS

Amount: $[Amount]
Due Date: [Date]
Reason: [Decline Reason, if available]

━━━━━━━━━━━━━━━━━━━━━━

WHAT TO DO

Please update your payment method to avoid any interruption to your membership:

[BUTTON: Update Payment Method →]

━━━━━━━━━━━━━━━━━━━━━━

We'll automatically retry the payment in 3 days. If the issue persists, your membership may be paused.

If you're having trouble or need to discuss your options, just reply to this email.

— Swing Institute
```

---

#### C5. Payment Resolved

**Trigger:** Previously failed payment succeeds  
**Delay:** Immediate  
**GHL Tags:** Remove `Payment Failed`

**Subject:** Payment successful — you're all set  
**Preview:** Your account is back on track.

---

**Email Body:**

```
Hi [First Name],

Good news — your payment has been processed successfully.

━━━━━━━━━━━━━━━━━━━━━━

PAYMENT CONFIRMED

Amount: $[Amount]
Date: [Date]

━━━━━━━━━━━━━━━━━━━━━━

Your membership is active and there's nothing else you need to do.

Thank you for being part of Swing Institute.

— Swing Institute
```

---

### D. MEMBERSHIP & ONBOARDING EMAILS

---

#### D1. Welcome Email (Day 0)

**Trigger:** Membership activated  
**Delay:** Immediate (part of C1)  
**GHL Tags:** `Onboarding: Day 0`

*(Covered in C1 — Subscription Confirmation)*

---

#### D2. Onboarding Day 1: Submit Your First Swing

**Trigger:** 24 hours after membership activation  
**Delay:** 24 hours  
**GHL Tags:** `Onboarding: Day 1`

**Subject:** Your first step: Submit a swing video  
**Preview:** This is how I learn [Player Name]'s current mechanics.

---

**Email Body:**

```
Hi [First Name],

Welcome to Day 1.

The most important thing you can do right now? Submit [Player Name]'s first swing video.

This is how I understand their current mechanics. Without video, I'm coaching blind. With it, I can give you feedback that actually moves the needle.

━━━━━━━━━━━━━━━━━━━━━━

HOW TO SUBMIT

1. Open your dashboard
2. Click "Submit Swing Video"
3. Upload a video (phone quality is fine)
4. Add any notes about what they're working on

[BUTTON: Submit Your First Video →]

━━━━━━━━━━━━━━━━━━━━━━

WHAT MAKES A GOOD VIDEO

• Film from the side (pitcher's view or catcher's view)
• Full swing visible (stance to finish)
• 3-5 swings is ideal
• Natural light or well-lit indoor space

━━━━━━━━━━━━━━━━━━━━━━

Once submitted, I'll review it and send back personalized feedback within [feedback timeframe based on tier].

Let's see what we're working with.

— Coach Jasha
```

---

#### D3. Onboarding Day 3: How Feedback Works

**Trigger:** 3 days after membership activation  
**Delay:** 3 days  
**GHL Tags:** `Onboarding: Day 3`

**Subject:** How your feedback works  
**Preview:** What happens after you submit a video.

---

**Email Body:**

```
Hi [First Name],

By now, you may have already submitted your first swing video. Here's what happens next:

━━━━━━━━━━━━━━━━━━━━━━

THE FEEDBACK PROCESS

1. You submit a video
2. I personally review it (not AI, not an assistant — me)
3. You receive a detailed video breakdown with:
   • What's working well
   • 1-2 specific fixes to focus on
   • Drill recommendations
4. You practice and submit again

━━━━━━━━━━━━━━━━━━━━━━

YOUR TIER: [Tier Name]

Swing Reviews Per Month: [X or "Unlimited"]
Feedback Timeframe: [24h / 48h / 72h]

━━━━━━━━━━━━━━━━━━━━━━

The key to progress is consistency. Submit regularly, practice intentionally, and trust the process.

[If not submitted yet:]
Haven't submitted yet?

[BUTTON: Submit Your First Video →]

━━━━━━━━━━━━━━━━━━━━━━

— Coach Jasha
```

---

#### D4. Onboarding Day 5: Explore the Training Room

**Trigger:** 5 days after membership activation  
**Delay:** 5 days  
**GHL Tags:** `Onboarding: Day 5`

**Subject:** Have you explored the Training Room?  
**Preview:** Connect with other families and get your questions answered.

---

**Email Body:**

```
Hi [First Name],

You're not training alone.

The Training Room is where Swing Institute families connect, share wins, ask questions, and support each other.

━━━━━━━━━━━━━━━━━━━━━━

WHAT YOU CAN DO

• Post questions and get answers from Coach Jasha
• Share your player's progress
• See what drills other families are working on
• Celebrate wins (big and small)

━━━━━━━━━━━━━━━━━━━━━━

[BUTTON: Enter the Training Room →]

━━━━━━━━━━━━━━━━━━━━━━

The families that engage the most tend to see the best results. Don't be a lurker — jump in.

— Coach Jasha
```

---

#### D5. Onboarding Day 7: How to Book Sessions

**Trigger:** 7 days after membership activation  
**Delay:** 7 days  
**GHL Tags:** `Onboarding: Day 7`

**Subject:** Ready to train in person?  
**Preview:** Here's how to book a private session.

---

**Email Body:**

```
Hi [First Name],

Online training is powerful — but sometimes there's no substitute for in-person work.

If you're in the Atlanta area (or willing to travel), here's how to book a private session:

━━━━━━━━━━━━━━━━━━━━━━

BOOKING A SESSION

1. Go to your dashboard
2. Click "Book a Session"
3. Select your service type
4. Choose your date and time
5. Confirm your booking

[BUTTON: Book a Session →]

━━━━━━━━━━━━━━━━━━━━━━

YOUR MEMBER RATE

[If Pro/Elite/Hybrid:]
As a [Tier Name] member, you get our discounted rate: $115/hour (normally $145).

[If Hybrid:]
You also have [X] in-person credit(s) included each month.

━━━━━━━━━━━━━━━━━━━━━━

Questions? Just reply to this email.

— Coach Jasha
```

---

#### D6. Onboarding Day 14: How Are You Doing?

**Trigger:** 14 days after membership activation  
**Delay:** 14 days  
**GHL Tags:** `Onboarding: Day 14`

**Subject:** Two weeks in — how's it going?  
**Preview:** Quick check-in from Coach Jasha.

---

**Email Body:**

```
Hi [First Name],

It's been two weeks since you joined Swing Institute. I wanted to check in.

━━━━━━━━━━━━━━━━━━━━━━

A FEW QUESTIONS

• Have you submitted any swing videos?
• Is [Player Name] practicing the drills?
• Do you have any questions I can answer?

━━━━━━━━━━━━━━━━━━━━━━

If you're feeling stuck or unsure about anything, just reply to this email. I read every response personally.

Progress takes time, but it also takes engagement. If you haven't been active yet, now is the time to start.

[If no videos submitted:]
[BUTTON: Submit Your First Video →]

[If videos submitted:]
[BUTTON: View Your Dashboard →]

━━━━━━━━━━━━━━━━━━━━━━

Keep going. The work you put in now compounds later.

— Coach Jasha
```

---

### E. TRAINING & ENGAGEMENT EMAILS

---

#### E1. Coach Review Completed

**Trigger:** Coach marks video review as complete  
**Delay:** Immediate  
**GHL Tags:** `Review Completed`

**Subject:** Your feedback is ready 🎯  
**Preview:** Coach Jasha has reviewed your swing.

---

**Email Body:**

```
Hi [First Name],

I've finished reviewing [Player Name]'s swing video, and your feedback is ready.

[BUTTON: View Your Feedback →]

━━━━━━━━━━━━━━━━━━━━━━

WHAT YOU'LL FIND

• Video breakdown with annotations
• What's working well
• 1-2 key focus areas
• Recommended drills

━━━━━━━━━━━━━━━━━━━━━━

Watch the review, practice the drills, and submit your next video when ready.

Progress is a process. Keep showing up.

— Coach Jasha
```

---

#### E2. Weekly Training Reminder

**Trigger:** Every Monday at 9am (for active members)  
**Delay:** Scheduled (recurring)  
**GHL Tags:** None

**Subject:** Your week starts now  
**Preview:** What's on your training plan this week?

---

**Email Body:**

```
Hi [First Name],

New week, new opportunity.

━━━━━━━━━━━━━━━━━━━━━━

THIS WEEK'S FOCUS

[If current phase/drill assigned:]
Keep working on: [Current Focus Area]
Drill: [Drill Name]
Reps: [X] per day

[If no specific assignment:]
Log in to your dashboard to see your current training plan.

━━━━━━━━━━━━━━━━━━━━━━

[BUTTON: View My Dashboard →]

━━━━━━━━━━━━━━━━━━━━━━

Consistency beats intensity. Show up every day, even if it's just for 15 minutes.

— Coach Jasha
```

---

#### E3. Progress Encouragement

**Trigger:** After 3rd video submission  
**Delay:** Immediate  
**GHL Tags:** `Milestone: 3 Videos`

**Subject:** You're building momentum  
**Preview:** Three videos in — here's what that means.

---

**Email Body:**

```
Hi [First Name],

Just wanted to acknowledge something: [Player Name] has now submitted 3 swing videos.

That might not sound like a lot, but it's more than most players ever do. It shows commitment. It shows you're serious.

━━━━━━━━━━━━━━━━━━━━━━

WHAT I'VE NOTICED

[Personalized observation if available, or generic:]
I'm starting to see patterns in their swing, and that's exactly what we need. The more data I have, the more targeted my feedback becomes.

━━━━━━━━━━━━━━━━━━━━━━

Keep going. You're doing the work that others skip.

— Coach Jasha
```

---

#### E4. Inactivity Check-In (7 Days)

**Trigger:** No video submission or login for 7 days  
**Delay:** 7 days since last activity  
**GHL Tags:** `Inactive: 7 Days`

**Subject:** Haven't seen you in a while  
**Preview:** Quick check-in — everything okay?

---

**Email Body:**

```
Hi [First Name],

I noticed it's been about a week since [Player Name] last engaged with the platform.

No judgment here — life gets busy. But I wanted to check in.

━━━━━━━━━━━━━━━━━━━━━━

IS SOMETHING HOLDING YOU BACK?

• Not sure what to work on?
• Waiting for feedback?
• Need help with video submission?
• Life just got in the way?

━━━━━━━━━━━━━━━━━━━━━━

Whatever it is, just reply to this email. I'm here to help.

[BUTTON: Submit a New Video →]

━━━━━━━━━━━━━━━━━━━━━━

The players who make the most progress are the ones who stay consistent — even when it's hard. Don't let momentum slip.

— Coach Jasha
```

---

#### E5. Inactivity Check-In (14 Days)

**Trigger:** No activity for 14 days  
**Delay:** 14 days since last activity  
**GHL Tags:** `Inactive: 14 Days`

**Subject:** Is Swing Institute still right for you?  
**Preview:** Honest question — no pressure.

---

**Email Body:**

```
Hi [First Name],

It's been two weeks since we've seen any activity from [Player Name].

I want to be direct: if something isn't working, I'd rather know now so we can fix it.

━━━━━━━━━━━━━━━━━━━━━━

WHAT'S GOING ON?

Reply with a number:

1 — We've been busy, but we're still committed
2 — We're not sure how to use the platform
3 — This isn't the right fit for us right now
4 — Something else (tell me)

━━━━━━━━━━━━━━━━━━━━━━

I read every reply. If there's something I can do to help, I will.

If you're ready to get back on track:

[BUTTON: Log In to Your Dashboard →]

━━━━━━━━━━━━━━━━━━━━━━

Either way, I appreciate your honesty.

— Coach Jasha
```

---

### F. REMINDER & NOTIFICATION EMAILS

---

#### F1. Credits Expiring (7 Days)

**Trigger:** Swing review credits reset in 7 days  
**Delay:** 7 days before reset  
**GHL Tags:** `Credits Expiring: 7 Days`

**Subject:** You have [X] swing reviews left this month  
**Preview:** Use them before they reset on [Date].

---

**Email Body:**

```
Hi [First Name],

Quick heads up: you have [X] swing review(s) remaining this month, and they reset on [Reset Date].

━━━━━━━━━━━━━━━━━━━━━━

YOUR CREDITS

Plan: [Tier Name]
Remaining Reviews: [X]
Reset Date: [Date]

━━━━━━━━━━━━━━━━━━━━━━

Don't let them go to waste. Submit a video before the month ends:

[BUTTON: Submit a Swing Video →]

━━━━━━━━━━━━━━━━━━━━━━

Unused credits don't roll over. Get your money's worth!

— Swing Institute
```

---

#### F2. Credits Expiring (3 Days)

**Trigger:** Credits reset in 3 days  
**Delay:** 3 days before reset  
**GHL Tags:** `Credits Expiring: 3 Days`

**Subject:** Only 3 days left to use your reviews  
**Preview:** [X] swing reviews expire on [Date].

---

**Email Body:**

```
Hi [First Name],

This is your final reminder: you have [X] swing review(s) that expire in 3 days.

[BUTTON: Submit a Video Now →]

━━━━━━━━━━━━━━━━━━━━━━

After [Reset Date], your credits reset. Don't leave feedback on the table.

— Swing Institute
```

---

#### F3. Package Credits Expiring (14 Days)

**Trigger:** Lesson package expires in 14 days  
**Delay:** 14 days before expiration  
**GHL Tags:** `Package Expiring: 14 Days`

**Subject:** Your lesson package expires soon  
**Preview:** You have [X] sessions left — use them by [Date].

---

**Email Body:**

```
Hi [First Name],

Your [Package Name] expires in 14 days.

━━━━━━━━━━━━━━━━━━━━━━

PACKAGE STATUS

Sessions Remaining: [X]
Expiration Date: [Date]

━━━━━━━━━━━━━━━━━━━━━━

Book your remaining sessions now to make sure you don't lose them:

[BUTTON: Book a Session →]

━━━━━━━━━━━━━━━━━━━━━━

After [Date], unused sessions cannot be recovered.

— Swing Institute
```

---

#### F4. Credits Renewed

**Trigger:** Monthly billing cycle completes  
**Delay:** Immediate  
**GHL Tags:** None

**Subject:** Your credits have been renewed  
**Preview:** [X] new swing reviews are ready.

---

**Email Body:**

```
Hi [First Name],

Good news — your monthly credits have been renewed.

━━━━━━━━━━━━━━━━━━━━━━

YOUR NEW CREDITS

Swing Reviews: [X] available
[If Hybrid:]
In-Person Credits: [X] available

━━━━━━━━━━━━━━━━━━━━━━

New month, new opportunities. Let's make this one count.

[BUTTON: Submit a Swing Video →]

━━━━━━━━━━━━━━━━━━━━━━

— Swing Institute
```

---

### G. UPGRADE & RETENTION EMAILS

---

#### G1. Upgrade Invitation (Starter → Pro)

**Trigger:** After 30 days on Starter + 2+ video submissions  
**Delay:** 30 days after sign-up  
**GHL Tags:** `Upgrade Candidate`

**Subject:** Ready to level up?  
**Preview:** You've been putting in work — here's how to accelerate.

---

**Email Body:**

```
Hi [First Name],

You've been part of Swing Institute for a month now, and I've noticed something: you're actually doing the work.

That puts you ahead of most families. But I also know you could be getting more.

━━━━━━━━━━━━━━━━━━━━━━

WHAT YOU'RE MISSING ON STARTER

• Only 2 swing reviews per month
• 72-hour feedback turnaround
• No access to Inner Diamond mindset program
• Full lesson rate ($145/hr)

━━━━━━━━━━━━━━━━━━━━━━

WHAT PRO UNLOCKS

• 4 swing reviews per month
• 48-hour priority feedback
• Inner Diamond mindset program
• Discounted lesson rate ($115/hr)
• Monthly live Q&A with Coach Jasha

━━━━━━━━━━━━━━━━━━━━━━

UPGRADE NOW

[BUTTON: Upgrade to Pro — $199/month →]

━━━━━━━━━━━━━━━━━━━━━━

You're already committed. This just gives you more tools to make that commitment pay off.

— Coach Jasha
```

---

#### G2. Hybrid Upgrade Invitation

**Trigger:** 3+ in-person sessions booked as non-Hybrid member  
**Delay:** After 3rd session  
**GHL Tags:** `Hybrid Candidate`

**Subject:** You might be overpaying for lessons  
**Preview:** The math on Hybrid membership.

---

**Email Body:**

```
Hi [First Name],

I noticed you've been booking in-person sessions regularly. That's great — it means [Player Name] is getting serious work in.

But here's the thing: you might be overpaying.

━━━━━━━━━━━━━━━━━━━━━━

THE MATH

Your current rate: $145/hour
Sessions booked recently: [X]
Total spent: ~$[Amount]

━━━━━━━━━━━━━━━━━━━━━━

WITH HYBRID CORE ($279/month)

• 1 in-person session included
• Full Pro online membership
• Discounted rate for additional sessions ($115/hr)
• Priority booking

━━━━━━━━━━━━━━━━━━━━━━

If you're training once a month or more, Hybrid pays for itself.

[BUTTON: Switch to Hybrid →]

━━━━━━━━━━━━━━━━━━━━━━

Questions? Just reply.

— Coach Jasha
```

---

#### G3. Renewal Confirmation

**Trigger:** Subscription successfully renewed  
**Delay:** Immediate  
**GHL Tags:** None

**Subject:** Your membership has been renewed  
**Preview:** Another month of training ahead.

---

**Email Body:**

```
Hi [First Name],

Your [Tier Name] membership has been renewed.

━━━━━━━━━━━━━━━━━━━━━━

RENEWAL DETAILS

Plan: [Tier Name]
Amount: $[Price]
Next Billing Date: [Date]

━━━━━━━━━━━━━━━━━━━━━━

Your credits have been refreshed. New month, new opportunities.

[BUTTON: Go to Dashboard →]

━━━━━━━━━━━━━━━━━━━━━━

Thank you for your continued trust.

— Swing Institute
```

---

#### G4. Cancellation Confirmation

**Trigger:** Subscription canceled  
**Delay:** Immediate  
**GHL Tags:** `Canceled`, Remove `Active Trainee`

**Subject:** Your membership has been canceled  
**Preview:** We're sorry to see you go.

---

**Email Body:**

```
Hi [First Name],

Your Swing Institute membership has been canceled.

━━━━━━━━━━━━━━━━━━━━━━

WHAT THIS MEANS

• Your access continues until [End Date]
• After that, you'll lose access to:
  - Training curriculum
  - Swing reviews
  - Training Room community
  - Member pricing

━━━━━━━━━━━━━━━━━━━━━━

CHANGED YOUR MIND?

You can reactivate anytime before [End Date]:

[BUTTON: Reactivate My Membership →]

━━━━━━━━━━━━━━━━━━━━━━

I'd love to know what led to this decision. If there's something we could have done better, please reply and let me know.

Either way, I genuinely appreciate the time you spent with us. The work [Player Name] put in isn't lost — those foundations will serve them well.

All the best,

Coach Jasha
```

---

#### G5. Win-Back Email (30 Days After Cancel)

**Trigger:** 30 days after cancellation  
**Delay:** 30 days  
**GHL Tags:** `Win-Back Sent`

**Subject:** Miss the progress?  
**Preview:** Your spot is still here if you want it.

---

**Email Body:**

```
Hi [First Name],

It's been about a month since you left Swing Institute.

No hard feelings — I know priorities shift. But if things have changed and you're ready to get back to work, your spot is waiting.

━━━━━━━━━━━━━━━━━━━━━━

WHAT YOU LEFT BEHIND

• Personalized swing reviews
• Phase-based training curriculum
• Training Room community
• Direct access to Coach Jasha

━━━━━━━━━━━━━━━━━━━━━━

[BUTTON: Rejoin Swing Institute →]

━━━━━━━━━━━━━━━━━━━━━━

No pressure. Just know the door is open.

— Coach Jasha
```

---

#### G6. Annual Upgrade Offer

**Trigger:** 6 months on monthly plan  
**Delay:** 6 months after sign-up  
**GHL Tags:** `Annual Candidate`

**Subject:** Save 2 months — switch to annual  
**Preview:** Lock in your rate and save $[Amount].

---

**Email Body:**

```
Hi [First Name],

You've been with Swing Institute for 6 months. That's real commitment.

Here's a way to reward it:

━━━━━━━━━━━━━━━━━━━━━━

SWITCH TO ANNUAL BILLING

Current monthly cost: $[Price]/month = $[Price × 12]/year

Annual price: $[Annual Price]/year

You save: $[Savings] (2 months free)

━━━━━━━━━━━━━━━━━━━━━━

[BUTTON: Switch to Annual →]

━━━━━━━━━━━━━━━━━━━━━━

Same membership. Lower price. Simple.

— Swing Institute
```

---

### H. ADMIN & SYSTEM EMAILS

---

#### H1. Account Created

**Trigger:** User creates account  
**Delay:** Immediate  
**GHL Tags:** `Account Created`

**Subject:** Your Swing Institute account is ready  
**Preview:** Log in to get started.

---

**Email Body:**

```
Hi [First Name],

Your Swing Institute account has been created.

━━━━━━━━━━━━━━━━━━━━━━

ACCOUNT DETAILS

Email: [Email]

━━━━━━━━━━━━━━━━━━━━━━

[BUTTON: Log In to Your Account →]

━━━━━━━━━━━━━━━━━━━━━━

Welcome to the team.

— Swing Institute
```

---

#### H2. Password Reset

**Trigger:** Password reset requested  
**Delay:** Immediate  
**GHL Tags:** None

**Subject:** Reset your password  
**Preview:** Click the link to set a new password.

---

**Email Body:**

```
Hi [First Name],

We received a request to reset your Swing Institute password.

[BUTTON: Reset My Password →]

━━━━━━━━━━━━━━━━━━━━━━

This link expires in 1 hour.

If you didn't request this, you can safely ignore this email. Your password won't change unless you click the link above.

— Swing Institute
```

---

#### H3. Admin Announcement Template

**Trigger:** Manual (admin-initiated)  
**Delay:** Immediate  
**GHL Tags:** `Announcement Sent`

**Subject:** [Announcement Subject]  
**Preview:** Important update from Swing Institute.

---

**Email Body:**

```
Hi [First Name],

[ANNOUNCEMENT CONTENT]

━━━━━━━━━━━━━━━━━━━━━━

[BUTTON IF RELEVANT: CTA Button →]

━━━━━━━━━━━━━━━━━━━━━━

Questions? Reply to this email.

— Coach Jasha
Swing Institute
```

---

#### H4. Support Response Template

**Trigger:** Manual (support reply)  
**Delay:** Immediate  
**GHL Tags:** None

**Subject:** Re: [Original Subject]  
**Preview:** Response from Swing Institute support.

---

**Email Body:**

```
Hi [First Name],

Thank you for reaching out.

[RESPONSE CONTENT]

━━━━━━━━━━━━━━━━━━━━━━

If you have any other questions, just reply to this email.

Best,

[Support Name]
Swing Institute
```

---

## 4. AUTOMATION & TRIGGER LOGIC

### Email Sequence Flows

#### Quiz Funnel Flow

```
Quiz Completed
├── [Immediate] A1: Quiz Completion Confirmation
├── [+24h, if no call booked] A2: Quiz Follow-Up #1
└── [+72h, if no call booked] A3: Quiz Follow-Up #2

Quiz Abandoned (exit intent)
└── [Immediate] A4: Quiz Abandonment Recovery
```

#### Booking Flow

```
Booking Created
├── [Immediate] B1 or B2: Booking Confirmation
├── [Immediate] B10: Calendar Invite
├── [-24h] B3: 24-Hour Reminder
├── [-2h] B4: 2-Hour Reminder
└── [+24h after session] B9: Post-Session Follow-Up

Booking Rescheduled
└── [Immediate] B6: Reschedule Confirmation

Booking Canceled
└── [Immediate] B7: Cancellation Confirmation

No-Show
└── [+1h after scheduled time] B8: No-Show Follow-Up
```

#### Membership Onboarding Flow

```
Membership Activated
├── [Immediate] C1/D1: Welcome + Subscription Confirmation
├── [+24h] D2: Submit First Swing
├── [+3d] D3: How Feedback Works
├── [+5d] D4: Explore Training Room
├── [+7d] D5: How to Book Sessions
└── [+14d] D6: Two-Week Check-In
```

#### Engagement Flow

```
Video Submitted
└── [When review complete] E1: Coach Review Completed

3rd Video Submitted
└── [Immediate] E3: Progress Encouragement

No Activity (7 days)
└── [+7d] E4: Inactivity Check-In

No Activity (14 days)
└── [+14d] E5: Final Inactivity Check-In
```

#### Credit/Renewal Flow

```
Credits Reset in 7 Days
├── [7d before] F1: Credits Expiring (7 Days)
└── [3d before] F2: Credits Expiring (3 Days)

Package Expires in 14 Days
└── [14d before] F3: Package Credits Expiring

Monthly Renewal
├── [Immediate] F4: Credits Renewed
└── [Immediate] G3: Renewal Confirmation
```

---

## 5. GOHIGHLEVEL INTEGRATION NOTES

### Required GHL Tags

| Tag | Applied When |
|-----|--------------|
| `Quiz Completed` | Quiz opt-in submitted |
| `Profile: Swing Foundation` | Quiz result |
| `Profile: Breakout Ready` | Quiz result |
| `Profile: Next Level` | Quiz result |
| `Quiz Follow-Up Sent` | After A2 sent |
| `Quiz Final Follow-Up` | After A3 sent |
| `Quiz Abandoned` | Exit intent triggered |
| `Session Booked` | Any booking created |
| `Service: Lesson` | Lesson booked |
| `Service: Assessment` | Assessment booked |
| `Call Booked` | Virtual call booked |
| `Session Rescheduled` | Booking rescheduled |
| `Session Canceled` | Booking canceled |
| `No-Show` | Session marked no-show |
| `Tier: Community` | Community tier purchased |
| `Tier: Starter` | Starter tier purchased |
| `Tier: Pro` | Pro tier purchased |
| `Tier: Elite` | Elite tier purchased |
| `Tier: Hybrid Core` | Hybrid Core purchased |
| `Tier: Hybrid Pro` | Hybrid Pro purchased |
| `Active Trainee` | Active membership |
| `Package: [Name]` | Package purchased |
| `Payment Failed` | Payment declined |
| `Onboarding: Day [#]` | Onboarding sequence |
| `Review Completed` | Coach review done |
| `Milestone: 3 Videos` | 3rd video submitted |
| `Inactive: 7 Days` | 7 days no activity |
| `Inactive: 14 Days` | 14 days no activity |
| `Credits Expiring: 7 Days` | 7 days before reset |
| `Credits Expiring: 3 Days` | 3 days before reset |
| `Upgrade Candidate` | 30 days + engaged |
| `Hybrid Candidate` | 3+ in-person sessions |
| `Canceled` | Subscription canceled |
| `Win-Back Sent` | Win-back email sent |

### GHL Pipeline Stages

| Stage | Trigger |
|-------|---------|
| New Lead | Quiz completed |
| Call Scheduled | Call booked |
| Call Completed | Post-call |
| Customer | Membership purchased |
| Churned | Subscription canceled |

---

## 6. RECOMMENDATIONS & IMPROVEMENTS

### Current Gaps Identified

1. **No SMS integration** — High-value reminders (24h, 2h before sessions) should have SMS pairs
2. **No re-engagement for trial users** — If offering trials, need trial-specific emails
3. **No referral program emails** — Opportunity for "refer a friend" after positive engagement
4. **No milestone celebration emails** — Beyond 3 videos (10, 25, 50, etc.)
5. **No seasonal campaign templates** — Off-season vs. in-season messaging

### Recommended Additions

1. **SMS Pairing** for:
   - Booking confirmations
   - 2-hour and 15-minute reminders
   - Payment failed notices
   - Coach review completed

2. **Referral System Emails**:
   - "Know another family?" (after 30 days + positive engagement)
   - Referral confirmation (when someone uses their link)
   - Reward notification (when referral converts)

3. **Seasonal Campaigns**:
   - Off-season training push (October-February)
   - Pre-season preparation (February-March)
   - In-season maintenance (March-October)

4. **Feedback Requests**:
   - NPS survey after 90 days
   - Testimonial request after phase progression
   - Review request for Google/social proof

### Email Delivery Best Practices

1. **From Address**: Use `coach@swinginstitute.com` or `team@swinginstitute.com`
2. **Reply-To**: Ensure all emails are replyable (monitored inbox)
3. **Domain Verification**: Verify domain with Resend for deliverability
4. **Unsubscribe**: Include one-click unsubscribe in footer
5. **Mobile Optimization**: All emails must be mobile-responsive
6. **Plain Text Fallback**: Include plain text version

---

## IMPLEMENTATION CHECKLIST

### Phase 1: Critical (Week 1)
- [ ] B1-B8: All booking emails
- [ ] C1-C5: All payment emails
- [ ] H1-H2: Account & password emails

### Phase 2: High Priority (Week 2)
- [ ] D1-D6: Onboarding sequence
- [ ] E1: Coach review notification
- [ ] F1-F4: Credit/renewal notifications

### Phase 3: Engagement (Week 3)
- [ ] A1-A4: Quiz funnel emails
- [ ] E2-E5: Training & engagement emails

### Phase 4: Lifecycle (Week 4)
- [ ] G1-G6: Upgrade & retention emails
- [ ] SMS integration for key emails
- [ ] GHL automation setup

---

*Document prepared for The Swing Institute by Coach Jasha Balcom*  
*For questions, contact: support@swinginstitute.com*
