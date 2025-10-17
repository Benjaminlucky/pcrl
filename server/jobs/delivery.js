// jobs/delivery.js
import Notification from "../models/notification.model.js";
import nodemailer from "nodemailer";
import { getSocketIO } from "../utils/socket"; // your socket singleton or app.locals
import Realtor from "../models/realtor.model.js";

// configure nodemailer transporter (or use a provider)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export async function deliverBirthdayNotification(notification, realtor) {
  // admin list or find users with role admin
  // choose target admins
  const admins = await Realtor.find({ role: "admin" }).lean(); // import Realtor

  if (!admins || admins.length === 0) return;

  // Build notification payload
  const payload = {
    id: notification._id,
    type: notification.type,
    realtor: notification.realtor,
    name: `${notification.metadata.firstName} ${notification.metadata.lastName}`,
    daysBefore: notification.daysBefore,
    targetDate: notification.targetDate,
    message: `${notification.metadata.firstName} ${notification.metadata.lastName}'s birthday is in ${notification.daysBefore} days`,
    createdAt: notification.createdAt,
  };

  // 1) Save delivered state after sending
  // 2) In-app: Notification record already saved
  // 3) Socket emit to admins (you need to maintain admin socket rooms)
  try {
    // Socket
    const io = getSocketIO(); // implement a socket singleton that returns the io instance
    if (io) {
      // optionally target admin user ids, else broadcast to "admins" room
      io.to("admins").emit("notification", payload);
      notification.channels.push("socket");
    }

    // Email (batch or immediate)
    const toEmails = admins.map((a) => a.email).filter(Boolean);
    if (toEmails.length) {
      const mailOptions = {
        from: process.env.MAIL_FROM,
        to: toEmails.join(","),
        subject: `Upcoming birthday: ${payload.name} in ${payload.daysBefore} days`,
        text: `${payload.message}\n\nDate: ${new Date(
          notification.targetDate
        ).toDateString()}\nVisit dashboard to view details.`,
      };
      await transporter.sendMail(mailOptions);
      notification.channels.push("email");
    }

    // mark as delivered
    notification.delivered = true;
    notification.deliveredAt = new Date();
    notification.channels = Array.from(new Set(notification.channels));
    await notification.save();
  } catch (err) {
    console.error("deliverBirthdayNotification error:", err);
  }
}
