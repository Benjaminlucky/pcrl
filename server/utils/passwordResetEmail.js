// utils/passwordResetEmail.js
// Isolated from utils/email.js on purpose: sending a reset link must never be
// coupled to (or able to break) the welcome / upline email functions.
import { Resend } from "resend";

const EMAIL_FROM = process.env.EMAIL_FROM || "PCRG <info@pcrginitiative.com>";
const client = () => new Resend(process.env.RESEND_API_KEY);

function shell({ heading, subheading = "", bodyHtml }) {
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

/**
 * Sends a password-reset email. Resolves to a boolean; never throws.
 * @param {Object} recipient - { email, firstName? }
 * @param {Object} opts - { resetUrl, expiresMinutes }
 */
export async function sendPasswordResetEmail(recipient, opts = {}) {
  if (!recipient?.email || !opts?.resetUrl) return false;

  const expiresMinutes = opts.expiresMinutes || 60;
  const name = recipient.firstName || "there";

  const bodyHtml = `
    <p>Hi ${name},</p>
    <p>We received a request to reset the password for your PCRG account. Click the button below to choose a new password.</p>
    <p style="margin:24px 0;">
      <a href="${opts.resetUrl}"
         style="display:inline-block; background:#b91c1c; color:#ffffff; text-decoration:none; padding:12px 26px; border-radius:8px; font-weight:bold; font-size:15px;">
        Reset my password
      </a>
    </p>
    <p style="font-size:14px; color:#374151;">
      This link expires in ${expiresMinutes} minutes and can be used once.
    </p>
    <p style="font-size:14px; color:#374151;">
      If you didn't request this, you can safely ignore this email — your password won't change.
    </p>
    <p style="font-size:13px; color:#9ca3af; margin-top:24px; word-break:break-all;">
      If the button doesn't work, paste this link into your browser:<br/>${opts.resetUrl}
    </p>
  `;

  try {
    await client().emails.send({
      from: EMAIL_FROM,
      to: [recipient.email],
      subject: "Reset your PCRG password",
      html: shell({
        heading: "Password reset",
        subheading: "Set a new password for your account",
        bodyHtml,
      }),
    });
    return true;
  } catch (err) {
    console.error("sendPasswordResetEmail failed:", err?.message || err);
    return false;
  }
}

export default { sendPasswordResetEmail };
