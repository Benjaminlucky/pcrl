// models/role.model.js
// A named set of permissions (see config/permissions.js). Staff accounts
// reference a role by its `key`.
import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    permissions: { type: [String], default: [] },
    // Built-in roles can't be deleted; "locked" ones can't be edited either.
    system: { type: Boolean, default: false },
    locked: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.models.Role || mongoose.model("Role", RoleSchema);
