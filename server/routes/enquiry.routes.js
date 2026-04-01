// routes/enquiry.routes.js
import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

// POST /api/enquiry/developer
router.post("/developer", async (req, res) => {
  const { name, email, phone, company, projectDetails } = req.body;

  if (!name || !email || !phone || !projectDetails) {
    return res
      .status(400)
      .json({ message: "Please fill in all required fields." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // change if using a different provider
      auth: {
        user: process.env.MAIL_USER, // your Gmail address
        pass: process.env.MAIL_PASS, // your Gmail App Password (not account password)
      },
    });

    const mailOptions = {
      from: `"PCRG Developer Enquiry" <${process.env.MAIL_USER}>`,
      to: process.env.ADMIN_EMAIL, // admin receives the lead
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
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Enquiry sent successfully." });
  } catch (err) {
    console.error("Email error:", err);
    return res
      .status(500)
      .json({ message: "Failed to send enquiry. Please try again." });
  }
});

export default router;
