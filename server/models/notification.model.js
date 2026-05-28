// models/notification.model.js
import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      "birthday_countdown",
      "birthday_reminder",
      "birthday_email",
      "referral_signup",
      "welcome",
      "milestone",
      "general",
    ],
    required: true,
  },

  // Subject of the notification (e.g. the birthday person, or the new recruit).
  // Optional now so non-birthday notifications don't need a subject.
  realtor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Realtor",
    required: false,
    default: null,
  },

  // Who should SEE this notification. For admin-facing notifications leave
  // recipient null and set recipientRole = "admin". For realtor-facing
  // notifications (e.g. referral_signup) set recipient = the upline's _id.
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Realtor",
    required: false,
    default: null,
  },
  recipientRole: {
    type: String,
    enum: ["admin", "realtor"],
    default: "admin",
  },

  // Birthday-specific (optional for everything else)
  targetDate: { type: Date, required: false, default: null },
  daysBefore: { type: Number, required: false, min: 0, max: 7, default: null },

  // In-app read state
  read: { type: Boolean, default: false },

  delivered: { type: Boolean, default: false },

  message: { type: String, required: true },

  metadata: {
    firstName: String,
    lastName: String,
    email: String,
  },

  channels: { type: [String], default: [] },

  createdAt: { type: Date, default: Date.now },
});

// Birthday job lookups
NotificationSchema.index({ type: 1, realtor: 1, targetDate: 1, daysBefore: 1 });
// Realtor notification feed lookups
NotificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ createdAt: -1 });

export default mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);
