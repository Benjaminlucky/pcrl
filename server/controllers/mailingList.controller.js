import MailingList from "../models/MailingList.model.js";
import { Resend } from "resend";

// POST /api/mailing-list/subscribe
export const subscribe = async (req, res) => {
  const { email } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ message: "A valid email is required." });
  }

  try {
    // Check for duplicate
    const existing = await MailingList.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res
        .status(409)
        .json({ message: "This email is already subscribed." });
    }

    // Save to DB
    const entry = await MailingList.create({ email: email.toLowerCase() });

    // Send notification email via Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "PCRG Mailing List <info@pcrginitiative.com>",
      to: ["info@pcrginitiative.com"],
      replyTo: email,
      subject: `New Mailing List Subscriber — ${email}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden;">
          <div style="background: #b91c1c; padding: 24px 32px;">
            <h2 style="color: white; margin: 0; font-size: 22px;">New Mailing List Subscriber</h2>
            <p style="color: #fca5a5; margin: 4px 0 0;">Submitted via PCRG Academy Page</p>
          </div>
          <div style="padding: 32px; background: #fff;">
            <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
              <tr>
                <td style="padding: 10px 0; color: #6b7280; width: 40%;">Email Address</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 600;">${email}</td>
              </tr>
              <tr style="border-top: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280;">Subscribed At</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 600;">${new Date().toLocaleString(
                  "en-NG",
                  { timeZone: "Africa/Lagos" },
                )}</td>
              </tr>
            </table>
          </div>
          <div style="background: #f9fafb; padding: 16px 32px; font-size: 13px; color: #9ca3af; text-align: center;">
            Platinum Cape Realtors Group &bull; Academy Mailing List
          </div>
        </div>
      `,
    });

    return res.status(201).json({
      message: "Successfully subscribed to the mailing list.",
      data: entry,
    });
  } catch (err) {
    console.error("Mailing list subscribe error:", err);
    return res
      .status(500)
      .json({ message: "Subscription failed. Please try again." });
  }
};

// GET /api/mailing-list/subscribers  (admin)
export const getAllSubscribers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;

    const query = search ? { email: { $regex: search, $options: "i" } } : {};

    const total = await MailingList.countDocuments(query);
    const pages = Math.ceil(total / limit);

    const docs = await MailingList.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.status(200).json({ docs, total, pages, page: Number(page) });
  } catch (err) {
    console.error("Fetch subscribers error:", err);
    return res.status(500).json({ message: "Failed to fetch subscribers." });
  }
};

// DELETE /api/mailing-list/subscribers/:id  (admin)
export const deleteSubscriber = async (req, res) => {
  try {
    const deleted = await MailingList.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Subscriber not found." });
    }
    return res.status(200).json({ message: "Subscriber removed." });
  } catch (err) {
    console.error("Delete subscriber error:", err);
    return res.status(500).json({ message: "Failed to remove subscriber." });
  }
};
