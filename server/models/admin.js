import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  firstName: { type: String },
  lastName: { type: String },

  // Editorial role for the CMS. Legacy admins (no role) are treated as "admin"
  // at runtime via authMiddleware, so existing accounts keep full access.
  role: {
    type: String,
    enum: ["admin", "publisher", "editor"],
    default: "admin",
  },

  // 🔐 Password reset (hashed, never returned by default)
  resetPasswordToken: { type: String, default: null, select: false },
  resetPasswordExpires: { type: Date, default: null, select: false },
});

// Only hashes when the password itself changes (storing a reset token or a role
// change does not re-hash the existing password).
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

AdminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
