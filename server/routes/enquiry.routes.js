// routes/enquiry.routes.js
import express from "express";
import { Resend } from "resend";

const router = express.Router();

// POST /api/enquiry/developer
router.post("/developer", async (req, res) => {
  const { name, email, phone, company, projectDetails } = req.body;

  if (!name || !email || !phone || !projectDetails) {
    return res
      .status(400)
      .json({ message: "Please fill in all required fields." });
  }

  // ✅ Moved inside the handler — env vars are loaded by the time this runs
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: "PCRG Developer Enquiry <info@pcrginitiative.com>",
      to: ["info@pcrginitiative.com"],
      replyTo: email,
      subject: `New Developer Enquiry — ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden;">
          <div style="background: #b91c1c; padding: 24px 32px;">
            <h2 style="color: white; margin: 0; font-size: 22px;">New Developer Enquiry</h2>
            <p style="color: #fca5a5; margin: 4px 0 0;">Submitted via PCRG Developer Page</p>
          </div>
          <div style="padding: 32px; background: #fff;">
            <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
              <tr>
                <td style="padding: 10px 0; color: #6b7280; width: 40%;">Full Name</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 600;">${name}</td>
              </tr>
              <tr style="border-top: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280;">Email</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 600;">${email}</td>
              </tr>
              <tr style="border-top: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280;">Phone</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 600;">${phone}</td>
              </tr>
              <tr style="border-top: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280;">Company / Org</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 600;">${company || "N/A"}</td>
              </tr>
              <tr style="border-top: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280; vertical-align: top;">Project Details</td>
                <td style="padding: 10px 0; color: #111827; white-space: pre-line;">${projectDetails}</td>
              </tr>
            </table>
          </div>
          <div style="background: #f9fafb; padding: 16px 32px; font-size: 13px; color: #9ca3af; text-align: center;">
            Platinum Cape Realtors Group &bull; Developer Enquiry System
          </div>
        </div>
      `,
    });

    return res.status(200).json({ message: "Enquiry sent successfully." });
  } catch (err) {
    console.error("Resend error:", err);
    return res
      .status(500)
      .json({ message: "Failed to send enquiry. Please try again." });
  }
});

export default router;

router.post("/book-call", async (req, res) => {
  const { name, email, phone, preferredDate, preferredTime, notes } = req.body;

  if (!name || !email || !phone) {
    return res
      .status(400)
      .json({ message: "Please fill in all required fields." });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: "PCRG Strategy Call <info@pcrginitiative.com>",
      to: ["info@pcrginitiative.com"],
      replyTo: email,
      subject: `Strategy Call Request — ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden;">
          <div style="background: #b91c1c; padding: 24px 32px;">
            <h2 style="color: white; margin: 0; font-size: 22px;">Strategy Call Request</h2>
            <p style="color: #fca5a5; margin: 4px 0 0;">Submitted via PCRG Partner Page</p>
          </div>
          <div style="padding: 32px; background: #fff;">
            <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
              <tr><td style="padding: 10px 0; color: #6b7280; width: 40%;">Full Name</td><td style="padding: 10px 0; color: #111827; font-weight: 600;">${name}</td></tr>
              <tr style="border-top: 1px solid #f3f4f6;"><td style="padding: 10px 0; color: #6b7280;">Email</td><td style="padding: 10px 0; color: #111827; font-weight: 600;">${email}</td></tr>
              <tr style="border-top: 1px solid #f3f4f6;"><td style="padding: 10px 0; color: #6b7280;">Phone</td><td style="padding: 10px 0; color: #111827; font-weight: 600;">${phone}</td></tr>
              <tr style="border-top: 1px solid #f3f4f6;"><td style="padding: 10px 0; color: #6b7280;">Preferred Date</td><td style="padding: 10px 0; color: #111827; font-weight: 600;">${preferredDate || "Not specified"}</td></tr>
              <tr style="border-top: 1px solid #f3f4f6;"><td style="padding: 10px 0; color: #6b7280;">Preferred Time</td><td style="padding: 10px 0; color: #111827; font-weight: 600;">${preferredTime || "Not specified"}</td></tr>
              <tr style="border-top: 1px solid #f3f4f6;"><td style="padding: 10px 0; color: #6b7280; vertical-align: top;">Notes</td><td style="padding: 10px 0; color: #111827; white-space: pre-line;">${notes || "None"}</td></tr>
            </table>
          </div>
          <div style="background: #f9fafb; padding: 16px 32px; font-size: 13px; color: #9ca3af; text-align: center;">
            Platinum Cape Realtors Group &bull; Strategy Call System
          </div>
        </div>
      `,
    });
    return res.status(200).json({ message: "Call booked successfully." });
  } catch (err) {
    console.error("Resend error:", err);
    return res
      .status(500)
      .json({ message: "Failed to book call. Please try again." });
  }
});
