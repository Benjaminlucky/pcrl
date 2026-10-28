// utils/audit.js
// Best-effort audit logging — never blocks or fails the request.
import AuditLog from "../models/auditLog.model.js";

export function audit(req, action, target = {}, details = {}) {
  AuditLog.create({
    action,
    actor: {
      id: req?.user?.id ? String(req.user.id) : null,
      email: req?.user?.email || details.email || "",
    },
    target,
    details,
    ip: req?.ip || "",
  }).catch((err) => console.error("[audit] write failed:", err?.message || err));
}
