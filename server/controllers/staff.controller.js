// controllers/staff.controller.js
// Team (staff accounts), roles and the activity log.
import crypto from "crypto";
import Admin from "../models/admin.js";
import Role from "../models/role.model.js";
import AuditLog from "../models/auditLog.model.js";
import { PERMISSION_GROUPS, ALL_PERMISSIONS, WILDCARD } from "../config/permissions.js";
import {
  resolveRole,
  expandPermissions,
  isFullAccess,
  clearRoleCache,
  countOtherActiveAdmins,
} from "../utils/rbac.js";
import { audit } from "../utils/audit.js";
import { sendStaffInviteEmail, sendPasswordResetEmail } from "../utils/passwordResetEmail.js";

const FRONTEND_URL = (process.env.FRONTEND_URL || "https://pcrginitiative.com").replace(/\/$/, "");
const INVITE_TTL_HOURS = 72;
const RESET_TTL_MINUTES = 60;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class HttpError extends Error {
  constructor(status, message, extra = {}) {
    super(message);
    this.status = status;
    this.extra = extra;
  }
}

function fail(res, err, label) {
  if (err instanceof HttpError) return res.status(err.status).json({ message: err.message, ...err.extra });
  if (err?.code === 11000) return res.status(409).json({ message: "That already exists." });
  if (err?.name === "CastError") return res.status(404).json({ message: "Not found." });
  console.error(`[staff] ${label} error:`, err);
  return res.status(500).json({ message: `Failed to ${label}.` });
}

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const str = (v, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const covers = (actorPerms, perms) => perms.every((p) => actorPerms.includes(p));

function publicStaff(doc, roleNames = {}) {
  return {
    id: String(doc._id),
    email: doc.email,
    firstName: doc.firstName || "",
    lastName: doc.lastName || "",
    role: doc.role || "admin",
    roleName: roleNames[doc.role || "admin"] || doc.role || "admin",
    isActive: doc.isActive !== false,
    lastLoginAt: doc.lastLoginAt || null,
    invitePending: !doc.lastLoginAt && !!doc.resetPasswordExpires && doc.resetPasswordExpires > new Date(),
    createdAt: doc.createdAt || doc._id.getTimestamp(),
  };
}

// Issue a one-time "set password" link (same mechanism as password reset).
async function issueLink(admin, ttlMs) {
  const raw = crypto.randomBytes(32).toString("hex");
  admin.resetPasswordToken = crypto.createHash("sha256").update(raw).digest("hex");
  admin.resetPasswordExpires = new Date(Date.now() + ttlMs);
  await admin.save();
  return `${FRONTEND_URL}/reset-password?token=${raw}&type=admin`;
}

async function loadRoleOr400(key) {
  const k = str(key, 64).toLowerCase();
  const role = await Role.findOne({ key: k }).lean();
  if (!role) throw new HttpError(400, `Role "${k}" doesn't exist.`);
  return role;
}

// The acting user may only assign/manage access they themselves hold.
async function assertCanGrantRole(req, roleKey) {
  const { perms } = await resolveRole(roleKey);
  if (!covers(req.user.permissions, perms)) {
    throw new HttpError(403, "You can't assign a role with more access than your own.");
  }
}

async function assertCanManage(req, target) {
  const { perms } = await resolveRole(target.role || "admin");
  if (!covers(req.user.permissions, perms)) {
    throw new HttpError(403, "You can't manage someone with more access than you.");
  }
}

async function assertNotLastAdmin(target, message) {
  const { perms } = await resolveRole(target.role || "admin");
  if (!isFullAccess(perms) || target.isActive === false) return;
  if ((await countOtherActiveAdmins(target._id)) === 0) throw new HttpError(409, message);
}

// ===========================================================================
// Permissions catalogue & roles
// ===========================================================================

// GET /api/admin/permissions
export function listPermissions(req, res) {
  res.json({ groups: PERMISSION_GROUPS, all: ALL_PERMISSIONS });
}

// GET /api/admin/roles
export async function listRoles(req, res) {
  try {
    const [roles, counts] = await Promise.all([
      Role.find({}).sort({ system: -1, name: 1 }).lean(),
      Admin.aggregate([{ $group: { _id: { $ifNull: ["$role", "admin"] }, count: { $sum: 1 } } }]),
    ]);
    const byRole = Object.fromEntries(counts.map((c) => [c._id, c.count]));
    res.json({
      roles: roles.map((r) => ({
        key: r.key,
        name: r.name,
        description: r.description,
        permissions: r.permissions.includes(WILDCARD) ? [WILDCARD] : expandPermissions(r.permissions),
        system: r.system,
        locked: r.locked,
        userCount: byRole[r.key] || 0,
        updatedAt: r.updatedAt,
      })),
    });
  } catch (err) {
    fail(res, err, "load roles");
  }
}

function cleanPermissions(input) {
  if (!Array.isArray(input)) throw new HttpError(400, "permissions must be a list.");
  const unknown = input.filter((p) => !ALL_PERMISSIONS.includes(p));
  if (unknown.length) throw new HttpError(400, `Unknown permission(s): ${unknown.join(", ")}`);
  return [...new Set(input)];
}

// POST /api/admin/roles  { name, description, permissions }
export async function createRole(req, res) {
  try {
    const name = str(req.body?.name, 60);
    if (!name) throw new HttpError(400, "Give the role a name.");
    const permissions = cleanPermissions(req.body?.permissions || []);
    if (!covers(req.user.permissions, permissions)) {
      throw new HttpError(403, "You can't create a role with permissions you don't have.");
    }
    const key = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
    if (!key) throw new HttpError(400, "Use letters or numbers in the role name.");
    if (await Role.exists({ key })) throw new HttpError(409, "A role with that name already exists.");
    const role = await Role.create({
      key,
      name,
      description: str(req.body?.description, 300),
      permissions,
      system: false,
      locked: false,
    });
    clearRoleCache();
    audit(req, "role.create", { type: "role", id: key, label: name }, { permissions });
    res.status(201).json({ message: "Role created", role });
  } catch (err) {
    fail(res, err, "create role");
  }
}

// PUT /api/admin/roles/:key  { name?, description?, permissions? }
export async function updateRole(req, res) {
  try {
    const role = await Role.findOne({ key: str(req.params.key, 64).toLowerCase() });
    if (!role) throw new HttpError(404, "Role not found.");
    if (role.locked) throw new HttpError(400, `The ${role.name} role always has full access and can't be edited.`);

    const before = { name: role.name, permissions: [...role.permissions] };
    if (req.body?.name !== undefined) {
      const name = str(req.body.name, 60);
      if (!name) throw new HttpError(400, "The role name can't be empty.");
      role.name = name;
    }
    if (req.body?.description !== undefined) role.description = str(req.body.description, 300);
    if (req.body?.permissions !== undefined) {
      const permissions = cleanPermissions(req.body.permissions);
      // Changing a role affects everyone holding it: the editor must hold
      // both the old and the new permission sets.
      if (!covers(req.user.permissions, permissions) || !covers(req.user.permissions, expandPermissions(role.permissions))) {
        throw new HttpError(403, "You can only edit roles within your own access.");
      }
      role.permissions = permissions;
    }
    await role.save();
    clearRoleCache();
    audit(req, "role.update", { type: "role", id: role.key, label: role.name }, {
      before,
      after: { name: role.name, permissions: role.permissions },
    });
    res.json({ message: "Role updated", role });
  } catch (err) {
    fail(res, err, "update role");
  }
}

// DELETE /api/admin/roles/:key
export async function deleteRole(req, res) {
  try {
    const role = await Role.findOne({ key: str(req.params.key, 64).toLowerCase() });
    if (!role) throw new HttpError(404, "Role not found.");
    if (role.system) throw new HttpError(400, "Built-in roles can't be deleted.");
    const inUse = await Admin.countDocuments({ role: role.key });
    if (inUse) {
      throw new HttpError(409, `${inUse} team member(s) still have this role. Move them to another role first.`, {
        userCount: inUse,
      });
    }
    if (!covers(req.user.permissions, expandPermissions(role.permissions))) {
      throw new HttpError(403, "You can only delete roles within your own access.");
    }
    await role.deleteOne();
    clearRoleCache();
    audit(req, "role.delete", { type: "role", id: role.key, label: role.name });
    res.json({ message: "Role deleted" });
  } catch (err) {
    fail(res, err, "delete role");
  }
}

// ===========================================================================
// Team members
// ===========================================================================

// GET /api/admin/staff
export async function listStaff(req, res) {
  try {
    const [staff, roles] = await Promise.all([
      Admin.find({}).select("+resetPasswordExpires").sort({ email: 1 }).lean(),
      Role.find({}).select("key name").lean(),
    ]);
    const names = Object.fromEntries(roles.map((r) => [r.key, r.name]));
    res.json({ staff: staff.map((s) => publicStaff(s, names)) });
  } catch (err) {
    fail(res, err, "load team");
  }
}

// POST /api/admin/staff  { email, firstName, lastName, role, password? }
// Without a password an invitation email with a "set password" link is sent.
export async function createStaff(req, res) {
  try {
    const email = str(req.body?.email, 200).toLowerCase();
    if (!EMAIL_RE.test(email)) throw new HttpError(400, "Enter a valid email address.");
    const role = await loadRoleOr400(req.body?.role);
    await assertCanGrantRole(req, role.key);

    const exists = await Admin.findOne({ email: { $regex: `^${escapeRegex(email)}$`, $options: "i" } });
    if (exists) throw new HttpError(409, "A team member with that email already exists.");

    const password = typeof req.body?.password === "string" ? req.body.password : "";
    if (password && password.length < 8) throw new HttpError(400, "Passwords must be at least 8 characters.");

    const admin = await Admin.create({
      email,
      firstName: str(req.body?.firstName, 80),
      lastName: str(req.body?.lastName, 80),
      role: role.key,
      // Without a chosen password, an unguessable one until they set their own.
      password: password || crypto.randomBytes(32).toString("hex"),
      isActive: true,
      createdBy: String(req.user.id),
    });

    let inviteSent = false;
    let inviteUrl = null;
    if (!password) {
      inviteUrl = await issueLink(admin, INVITE_TTL_HOURS * 60 * 60 * 1000);
      inviteSent = await sendStaffInviteEmail(
        { email: admin.email, firstName: admin.firstName },
        {
          resetUrl: inviteUrl,
          expiresHours: INVITE_TTL_HOURS,
          invitedBy: [req.user.firstName, req.user.lastName].filter(Boolean).join(" ") || req.user.email,
          roleName: role.name,
        },
      );
    }

    audit(req, "staff.create", { type: "staff", id: String(admin._id), label: email }, {
      role: role.key,
      invited: !password,
      inviteSent,
    });
    res.status(201).json({
      message: password ? "Team member added." : inviteSent ? "Invitation sent." : "Team member added, but the invitation email couldn't be sent.",
      staff: publicStaff(admin.toObject(), { [role.key]: role.name }),
      inviteSent,
      // If email delivery failed, the link can be shared manually.
      inviteUrl: !password && !inviteSent ? inviteUrl : undefined,
    });
  } catch (err) {
    fail(res, err, "add team member");
  }
}

// PUT /api/admin/staff/:id  { firstName?, lastName?, role?, isActive? }
export async function updateStaff(req, res) {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) throw new HttpError(404, "Team member not found.");
    const isSelf = String(admin._id) === String(req.user.id);
    await assertCanManage(req, admin);

    const changes = {};
    if (req.body?.firstName !== undefined) changes.firstName = str(req.body.firstName, 80);
    if (req.body?.lastName !== undefined) changes.lastName = str(req.body.lastName, 80);

    if (req.body?.role !== undefined && str(req.body.role, 64).toLowerCase() !== (admin.role || "admin")) {
      if (isSelf) throw new HttpError(400, "You can't change your own role.");
      const role = await loadRoleOr400(req.body.role);
      await assertCanGrantRole(req, role.key);
      const { perms: newPerms } = await resolveRole(role.key);
      if (!isFullAccess(newPerms)) {
        await assertNotLastAdmin(admin, "This is the last active administrator. Make someone else an administrator first.");
      }
      changes.role = role.key;
    }

    if (req.body?.isActive !== undefined && Boolean(req.body.isActive) !== (admin.isActive !== false)) {
      if (isSelf) throw new HttpError(400, "You can't deactivate your own account.");
      if (!req.body.isActive) {
        await assertNotLastAdmin(admin, "This is the last active administrator and can't be deactivated.");
      }
      changes.isActive = Boolean(req.body.isActive);
    }

    if (!Object.keys(changes).length) throw new HttpError(400, "Nothing to change.");
    const before = { role: admin.role, isActive: admin.isActive !== false };
    Object.assign(admin, changes);
    await admin.save();

    audit(req, "staff.update", { type: "staff", id: String(admin._id), label: admin.email }, { before, changes });
    const roles = await Role.find({}).select("key name").lean();
    res.json({
      message: "Team member updated",
      staff: publicStaff(admin.toObject(), Object.fromEntries(roles.map((r) => [r.key, r.name]))),
    });
  } catch (err) {
    fail(res, err, "update team member");
  }
}

// POST /api/admin/staff/:id/password  { password? }
// With a password: sets it directly. Without: emails a reset link (or
// re-sends the invitation if they never signed in).
export async function resetStaffPassword(req, res) {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) throw new HttpError(404, "Team member not found.");
    await assertCanManage(req, admin);

    const password = typeof req.body?.password === "string" ? req.body.password : "";
    if (password) {
      if (password.length < 8) throw new HttpError(400, "Passwords must be at least 8 characters.");
      admin.password = password;
      admin.resetPasswordToken = null;
      admin.resetPasswordExpires = null;
      await admin.save();
      audit(req, "staff.password_set", { type: "staff", id: String(admin._id), label: admin.email });
      return res.json({ message: "Password updated." });
    }

    const neverSignedIn = !admin.lastLoginAt;
    const ttl = neverSignedIn ? INVITE_TTL_HOURS * 3600 * 1000 : RESET_TTL_MINUTES * 60 * 1000;
    const url = await issueLink(admin, ttl);
    const role = await resolveRole(admin.role || "admin");
    const sent = neverSignedIn
      ? await sendStaffInviteEmail(
          { email: admin.email, firstName: admin.firstName },
          {
            resetUrl: url,
            expiresHours: INVITE_TTL_HOURS,
            invitedBy: [req.user.firstName, req.user.lastName].filter(Boolean).join(" ") || req.user.email,
            roleName: role.role?.name,
          },
        )
      : await sendPasswordResetEmail(
          { email: admin.email, firstName: admin.firstName },
          { resetUrl: url, expiresMinutes: RESET_TTL_MINUTES },
        );
    audit(req, neverSignedIn ? "staff.invite_resent" : "staff.password_reset_sent", {
      type: "staff",
      id: String(admin._id),
      label: admin.email,
    }, { sent });
    res.json({
      message: sent ? (neverSignedIn ? "Invitation re-sent." : "Password reset email sent.") : "The email couldn't be sent — share the link manually.",
      sent,
      link: sent ? undefined : url,
    });
  } catch (err) {
    fail(res, err, "reset password");
  }
}

// DELETE /api/admin/staff/:id
export async function deleteStaff(req, res) {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) throw new HttpError(404, "Team member not found.");
    if (String(admin._id) === String(req.user.id)) throw new HttpError(400, "You can't delete your own account.");
    await assertCanManage(req, admin);
    await assertNotLastAdmin(admin, "This is the last active administrator and can't be removed.");
    await admin.deleteOne();
    audit(req, "staff.delete", { type: "staff", id: String(admin._id), label: admin.email }, { role: admin.role });
    res.json({ message: "Team member removed" });
  } catch (err) {
    fail(res, err, "remove team member");
  }
}

// ===========================================================================
// Activity log
// ===========================================================================

// GET /api/admin/audit?page=&limit=&action=
export async function listAudit(req, res) {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), 200);
    const filter = {};
    if (req.query.action) filter.action = { $regex: `^${str(req.query.action, 40).replace(/[^a-z_.]/gi, "")}` };
    const [total, entries] = await Promise.all([
      AuditLog.countDocuments(filter),
      AuditLog.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    ]);
    res.json({ entries, total, page, pages: Math.max(Math.ceil(total / limit), 1) });
  } catch (err) {
    fail(res, err, "load activity");
  }
}
