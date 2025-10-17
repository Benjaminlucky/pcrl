// models/User.js
import mongoose from "mongoose";

const RealtorSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: { type: String, required: true, trim: true },
  birthDate: { type: Date, required: true },
  state: { type: String },
  bank: { type: String },
  accountName: { type: String },
  accountNumber: { type: String },
  passwordHash: { type: String, required: true },

  // Referral tracking
  referralCode: { type: String, required: true, unique: true }, // e.g. "pcr01"
  recruitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  }, // who referred this user

  role: { type: String, enum: ["admin", "realtor"], default: "realtor" },

  createdAt: { type: Date, default: Date.now },
});

// 🔹 Index for fast lookup by recruiter
RealtorSchema.index({ recruitedBy: 1 });

// 🔹 Virtual field to calculate referral link dynamically
RealtorSchema.virtual("referralLink").get(function () {
  return `https://yourapp.com/signup?ref=${this.referralCode}`;
});

// 🔹 Virtual field to count how many users this person recruited
RealtorSchema.virtual("recruitCount", {
  ref: "User", // model to reference
  localField: "_id", // current user's id
  foreignField: "recruitedBy", // field in other users
  count: true, // tells Mongoose to count, not return docs
});

// Ensure virtuals are included when converting to JSON
RealtorSchema.set("toJSON", { virtuals: true });
RealtorSchema.set("toObject", { virtuals: true });

export default mongoose.models.Realtor ||
  mongoose.model("Realtor", RealtorSchema);
