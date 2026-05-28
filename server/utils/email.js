// utils/email.js
// Centralized, branded transactional email layer (Resend).
// All sends are wrapped so a mail failure NEVER throws into a request handler
// or the cron. Birthday/admin sends are de-duplicated via EmailLog (sendOnce).
import { Resend } from "resend";
import EmailLog from "../models/emailLog.model.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "https://pcrginitiative.com";
const EMAIL_FROM = process.env.EMAIL_FROM || "PCRG <info@pcrginitiative.com>";

// Lazily construct so a missing key at import-time doesn't crash the server.
const client = () => new Resend(process.env.RESEND_API_KEY);

// Admin notification recipients (comma-separated env, sensible default).
export function getAdminNotifyEmails() {
  return (process.env.ADMIN_NOTIFY_EMAILS || "info@pcrginitiative.com")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// Shared branded HTML shell (PCRG maroon header)
// ---------------------------------------------------------------------------
export function emailShell({ heading, subheading = "", bodyHtml }) {
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden;">
    <div style="background: #7a0c0c; padding: 24px 32px;">
      <h2 style="color: #ffffff; margin: 0; font-size: 22px;">${heading}</h2>
      ${subheading ? `<p style="color: #f3d6d6; margin: 6px 0 0; font-size: 14px;">${subheading}</p>` : ""}
    </div>
    <div style="padding: 32px; background: #ffffff; color: #1a1a1a; font-size: 15px; line-height: 1.6;">
      ${bodyHtml}
    </div>
    <div style="background: #f9fafb; padding: 16px 32px; font-size: 13px; color: #9ca3af; text-align: center;">
      Platinum Cape Realtors Group &bull; This is an automated message
    </div>
  </div>`;
}

export function emailButton(href, label) {
  return `<a href="${href}" style="display:inline-block; background:#b91c1c; color:#ffffff; text-decoration:none; padding:12px 26px; border-radius:8px; font-weight:bold; font-size:15px;">${label}</a>`;
}

function fmtDate(d) {
  try {
    return new Date(d).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  } catch {
    return "";
  }
}

// ---------------------------------------------------------------------------
// Idempotent send. Once an EmailLog row for `idempotencyKey` is "sent", the
// same key is skipped forever. Failed sends are retried on the next run.
// Returns { status: "sent" | "skipped" | "failed", error? }.
// ---------------------------------------------------------------------------
export async function sendOnce({
  idempotencyKey,
  to,
  subject,
  type,
  refId = null,
  sendFn,
}) {
  // Already delivered? Skip.
  try {
    const existing = await EmailLog.findOne({ idempotencyKey }).lean();
    if (existing && existing.status === "sent") {
      return { status: "skipped" };
    }
  } catch (e) {
    console.error("EmailLog lookup error:", e?.message || e);
    // fall through and attempt the send
  }

  let ok = false;
  let errMsg = null;
  try {
    await sendFn();
    ok = true;
  } catch (e) {
    errMsg = e?.message || String(e);
    console.error(`Email send failed [${type}] ${idempotencyKey}:`, errMsg);
  }

  try {
    await EmailLog.findOneAndUpdate(
      { idempotencyKey },
      {
        idempotencyKey,
        to: Array.isArray(to) ? to : [to],
        subject,
        type,
        refId,
        status: ok ? "sent" : "failed",
        error: ok ? null : errMsg,
        sentAt: ok ? new Date() : null,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  } catch (logErr) {
    // A rare upsert race on the unique key is harmless.
    console.error("EmailLog upsert error:", logErr?.message || logErr);
  }

  return { status: ok ? "sent" : "failed", error: errMsg };
}

// ===========================================================================
// 1) Welcome email — sent on realtor signup  (Sprint 1, unchanged behavior)
// ===========================================================================
export async function sendRealtorWelcomeEmail(realtor, opts = {}) {
  if (!realtor?.email) return false;

  const loginUrl = `${FRONTEND_URL}/login`;
  const includePassword =
    process.env.WELCOME_EMAIL_INCLUDE_PASSWORD === "true" && !!opts.password;

  const credentialsRow = `
    <tr>
      <td style="padding:8px 0; color:#6b7280; width:40%;">Login email</td>
      <td style="padding:8px 0; color:#111827; font-weight:600;">${realtor.email}</td>
    </tr>
    ${
      includePassword
        ? `<tr style="border-top:1px solid #f3f4f6;">
             <td style="padding:8px 0; color:#6b7280;">Temporary password</td>
             <td style="padding:8px 0; color:#111827; font-weight:600;">${opts.password}</td>
           </tr>
           <tr><td colspan="2" style="padding:8px 0; color:#b91c1c; font-size:13px;">For your security, please change this password after your first login.</td></tr>`
        : ""
    }`;

  const bodyHtml = `
    <p>Hi ${realtor.firstName || "there"},</p>
    <p>Welcome to <strong>Platinum Cape Realtors Group</strong>. Your realtor account has been created successfully.</p>
    <table style="width:100%; border-collapse:collapse; font-size:15px; margin:16px 0;">
      ${credentialsRow}
    </table>
    <p style="margin:24px 0;">${emailButton(loginUrl, "Log in to your dashboard")}</p>
    ${
      realtor.referralLink
        ? `<p style="font-size:14px; color:#374151;">Your personal referral link — share it to grow your team:</p>
           <p style="font-size:14px;"><a href="${realtor.referralLink}" style="color:#b91c1c;">${realtor.referralLink}</a></p>`
        : ""
    }
    <p style="font-size:13px; color:#9ca3af; margin-top:24px;">If the button doesn't work, paste this link into your browser: ${loginUrl}</p>
  `;

  try {
    await client().emails.send({
      from: EMAIL_FROM,
      to: [realtor.email],
      subject: "Welcome to PCRG — your account is ready",
      html: emailShell({
        heading: "Welcome to PCRG",
        subheading: "Your realtor account is ready",
        bodyHtml,
      }),
    });
    return true;
  } catch (err) {
    console.error("sendRealtorWelcomeEmail failed:", err?.message || err);
    return false;
  }
}

// ===========================================================================
// 2) Upline referral alert  (Sprint 1, unchanged behavior)
// ===========================================================================
export async function sendUplineReferralEmail(upline, newRealtor, opts = {}) {
  if (!upline?.email) return false;

  const dashboardUrl = `${FRONTEND_URL}/dashboard`;
  const downlineCount = opts.downlineCount;

  const bodyHtml = `
    <p>Hi ${upline.firstName || "there"},</p>
    <p>Great news — <strong>${newRealtor.firstName} ${newRealtor.lastName}</strong> just joined PCRG using your referral code.</p>
    <table style="width:100%; border-collapse:collapse; font-size:15px; margin:16px 0;">
      <tr>
        <td style="padding:8px 0; color:#6b7280; width:40%;">New team member</td>
        <td style="padding:8px 0; color:#111827; font-weight:600;">${newRealtor.firstName} ${newRealtor.lastName}</td>
      </tr>
      ${
        typeof downlineCount === "number"
          ? `<tr style="border-top:1px solid #f3f4f6;">
               <td style="padding:8px 0; color:#6b7280;">Your total downline</td>
               <td style="padding:8px 0; color:#111827; font-weight:600;">${downlineCount}</td>
             </tr>`
          : ""
      }
    </table>
    <p style="margin:24px 0;">${emailButton(dashboardUrl, "View your team")}</p>
  `;

  try {
    await client().emails.send({
      from: EMAIL_FROM,
      to: [upline.email],
      subject: `${newRealtor.firstName} joined your team on PCRG`,
      html: emailShell({
        heading: "New team member",
        subheading: "Someone joined with your referral code",
        bodyHtml,
      }),
    });
    return true;
  } catch (err) {
    console.error("sendUplineReferralEmail failed:", err?.message || err);
    return false;
  }
}

// ===========================================================================
// 3) Admin birthday reminder — idempotent, at 7 / 1 / 0 days
// ===========================================================================
export async function sendAdminBirthdayReminder({
  realtor,
  daysUntil,
  nextBirthday,
  birthdayYear,
}) {
  const adminEmails = getAdminNotifyEmails();
  if (!adminEmails.length || !realtor) return { status: "failed" };

  const name = `${realtor.firstName} ${realtor.lastName}`;
  let subject;
  let heading;
  if (daysUntil === 0) {
    subject = `🎉 Today is ${name}'s birthday`;
    heading = "Birthday today";
  } else if (daysUntil === 1) {
    subject = `Tomorrow is ${name}'s birthday`;
    heading = "Birthday tomorrow";
  } else {
    subject = `${daysUntil} days to ${name}'s birthday`;
    heading = `${daysUntil}-day birthday reminder`;
  }

  const bodyHtml = `
    <p>Hello Admin,</p>
    <p>${
      daysUntil === 0
        ? `<strong>${name}</strong> is celebrating a birthday <strong>today</strong>! An automated greeting has been sent to them.`
        : `A heads-up that <strong>${name}</strong> has a birthday coming up.`
    }</p>
    <table style="width:100%; border-collapse:collapse; font-size:15px; margin:16px 0;">
      <tr>
        <td style="padding:8px 0; color:#6b7280; width:40%;">Realtor</td>
        <td style="padding:8px 0; color:#111827; font-weight:600;">${name}</td>
      </tr>
      <tr style="border-top:1px solid #f3f4f6;">
        <td style="padding:8px 0; color:#6b7280;">Email</td>
        <td style="padding:8px 0; color:#111827;">${realtor.email}</td>
      </tr>
      <tr style="border-top:1px solid #f3f4f6;">
        <td style="padding:8px 0; color:#6b7280;">Birthday</td>
        <td style="padding:8px 0; color:#111827;">${fmtDate(nextBirthday)}</td>
      </tr>
      <tr style="border-top:1px solid #f3f4f6;">
        <td style="padding:8px 0; color:#6b7280;">Countdown</td>
        <td style="padding:8px 0; color:#111827; font-weight:600;">${
          daysUntil === 0 ? "Today 🎂" : `${daysUntil} day(s)`
        }</td>
      </tr>
    </table>
  `;

  const idempotencyKey = `bday-admin:${realtor._id}:${birthdayYear}:${daysUntil}`;

  return sendOnce({
    idempotencyKey,
    to: adminEmails,
    subject,
    type: "admin_birthday",
    refId: realtor._id,
    sendFn: () =>
      client().emails.send({
        from: EMAIL_FROM,
        to: adminEmails,
        subject,
        html: emailShell({
          heading,
          subheading: "Realtor birthday notification",
          bodyHtml,
        }),
      }),
  });
}

// ===========================================================================
// 4) Automated realtor birthday greeting — idempotent, day-of only
// ===========================================================================
export async function sendRealtorBirthdayGreeting({ realtor, birthdayYear }) {
  if (!realtor?.email) return { status: "failed" };

  const bodyHtml = `
    <p>Dear ${realtor.firstName},</p>
    <p>Happy Birthday from all of us at <strong>Platinum Cape Realtors Group</strong>! 🎉🎂</p>
    <p>Thank you for being a valued part of our family. We wish you a wonderful year ahead filled with success, growth, and joy.</p>
    <p>Warm regards,<br/>The PCRG Team</p>
  `;

  const idempotencyKey = `bday-realtor:${realtor._id}:${birthdayYear}`;

  return sendOnce({
    idempotencyKey,
    to: realtor.email,
    subject: `Happy Birthday, ${realtor.firstName}! 🎉`,
    type: "realtor_birthday",
    refId: realtor._id,
    sendFn: () =>
      client().emails.send({
        from: EMAIL_FROM,
        to: [realtor.email],
        subject: `Happy Birthday, ${realtor.firstName}! 🎉`,
        html: emailShell({
          heading: "Happy Birthday! 🎉",
          subheading: "From everyone at PCRG",
          bodyHtml,
        }),
      }),
  });
}

export default {
  sendRealtorWelcomeEmail,
  sendUplineReferralEmail,
  sendAdminBirthdayReminder,
  sendRealtorBirthdayGreeting,
  sendOnce,
  getAdminNotifyEmails,
  emailShell,
  emailButton,
};
