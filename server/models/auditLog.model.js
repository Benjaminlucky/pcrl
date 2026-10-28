// models/auditLog.model.js
// Security-relevant staff actions (sign-ins, team and role changes).
import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true, index: true }, // e.g. "staff.create"
    actor: {
      id: { type: String, default: null },
      email: { type: String, default: "" },
    },
    target: {
      type: { type: String, default: "" }, // "staff" | "role"
      id: { type: String, default: "" },
      label: { type: String, default: "" },
    },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
    ip: { type: String, default: "" },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// Keep one year of history (this index also serves newest-first sorting).
AuditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });

export default mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);
