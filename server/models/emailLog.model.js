// models/emailLog.model.js
import mongoose from "mongoose";

const EmailLogSchema = new mongoose.Schema({
  // Unique per logical email. Once a row reaches status "sent", the same key
  // is never sent again (the cron's idempotency guard).
  idempotencyKey: { type: String, required: true, unique: true },

  to: { type: [String], default: [] },
  subject: { type: String, default: "" },

  // e.g. "admin_birthday", "realtor_birthday"
  type: { type: String, required: true },

  status: {
    type: String,
    enum: ["pending", "sent", "failed"],
    default: "pending",
  },

  // Related entity (usually the realtor whose birthday it is)
  refId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Realtor",
    default: null,
  },

  error: { type: String, default: null },
  sentAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

EmailLogSchema.index({ type: 1, createdAt: -1 });
EmailLogSchema.index({ status: 1 });

export default mongoose.models.EmailLog ||
  mongoose.model("EmailLog", EmailLogSchema);
