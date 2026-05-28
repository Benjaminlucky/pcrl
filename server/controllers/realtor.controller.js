// controllers/realtor.controller.js
import Realtor from "../models/realtor.model.js";
import Notification from "../models/notification.model.js";
import bcrypt from "bcrypt";
import cloudinary from "../utils/cloudinary.config.js";
import streamifier from "streamifier";
import {
  sendRealtorWelcomeEmail,
  sendUplineReferralEmail,
} from "../utils/email.js";

// ---------------------------------------------------------------------------
// Race-safe referral code generator.
// The old approach (`pcr${countDocuments()+1}`) caused E11000 duplicate-key
// errors: two signups could read the same count, or a deleted realtor left a
// gap so the next count collided with an existing code (e.g. pcr030).
//
// This version finds the current highest numeric code and increments it, then
// retries on the rare race where two requests still land on the same number.
// The unique index on referralCode is the final guarantee.
// ---------------------------------------------------------------------------
async function generateUniqueReferralCode(maxAttempts = 5) {
  // Find the highest existing pcrNNN by sorting descending on referralCode.
  const last = await Realtor.findOne({ referralCode: /^pcr\d+$/ })
    .sort({ referralCode: -1 })
    .select("referralCode")
    .lean();

  let next = 1;
  if (last?.referralCode) {
    const n = parseInt(last.referralCode.replace(/^pcr/, ""), 10);
    if (!Number.isNaN(n)) next = n + 1;
  }

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const candidate = `pcr${String(next + attempt).padStart(3, "0")}`;
    const exists = await Realtor.exists({ referralCode: candidate });
    if (!exists) return candidate;
  }

  // Fallback: timestamp-based suffix, effectively collision-proof.
  return `pcr${Date.now().toString().slice(-6)}`;
}

export const signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      state,
      bank,
      accountName,
      accountNumber,
      password,
      ref,
      birthDate,
      avatar,
    } = req.body;

    // --- Basic server-side presence check (defense in depth) ---
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: "Please fill in all required fields.",
        code: "MISSING_FIELDS",
      });
    }

    // --- Duplicate email check (clear, field-targeted message) ---
    const emailExists = await Realtor.findOne({
      email: email.toLowerCase().trim(),
    });
    if (emailExists) {
      return res.status(409).json({
        message:
          "An account with this email already exists. Try logging in, or use a different email.",
        code: "EMAIL_TAKEN",
        field: "email",
      });
    }

    // --- Referral code validation ---
    let recruiter = null;
    if (ref?.trim()) {
      recruiter = await Realtor.findOne({ referralCode: ref.trim() });
      if (!recruiter) {
        return res.status(400).json({
          message:
            "That referral code doesn't match any realtor. Please check it and try again, or remove it to continue without one.",
          code: "INVALID_REFERRAL",
          field: "ref",
        });
      }
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const referralCode = await generateUniqueReferralCode();

    let newRealtor;
    try {
      newRealtor = await Realtor.create({
        firstName,
        lastName,
        email: email.toLowerCase().trim(),
        phone,
        state,
        bank,
        accountName,
        accountNumber,
        avatar: avatar || undefined,
        passwordHash,
        referralCode,
        birthDate: new Date(birthDate),
        recruitedBy: recruiter?._id || null,
      });
    } catch (err) {
      // Catch any duplicate-key races that slipped past the checks above and
      // translate them into clear, field-specific messages.
      if (err?.code === 11000) {
        const dupField = Object.keys(err.keyPattern || {})[0];
        if (dupField === "email") {
          return res.status(409).json({
            message:
              "An account with this email already exists. Try logging in instead.",
            code: "EMAIL_TAKEN",
            field: "email",
          });
        }
        if (dupField === "accountNumber") {
          return res.status(409).json({
            message: "This account number is already registered.",
            code: "ACCOUNT_TAKEN",
            field: "accountNumber",
          });
        }
        if (dupField === "referralCode") {
          // Extremely rare after the generator; ask for a simple retry.
          return res.status(503).json({
            message:
              "We hit a momentary glitch assigning your referral code. Please tap Create Account once more.",
            code: "REFERRAL_RACE",
          });
        }
      }
      throw err; // unknown error -> handled by outer catch
    }

    // ---- Respond first so signup stays fast; side-effects are fire-and-forget ----
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newRealtor._id,
        name: `${newRealtor.firstName} ${newRealtor.lastName}`,
        avatar: newRealtor.avatar,
        referralCode: newRealtor.referralCode,
        referralLink: newRealtor.referralLink,
      },
    });

    // ---- Side effects (never block or fail the signup response) ----
    sendRealtorWelcomeEmail(newRealtor, { password }).catch((e) =>
      console.error("Welcome email error:", e?.message || e),
    );

    if (recruiter) {
      try {
        const downlineCount = await Realtor.countDocuments({
          recruitedBy: recruiter._id,
        });

        await Notification.create({
          type: "referral_signup",
          recipient: recruiter._id,
          recipientRole: "realtor",
          realtor: newRealtor._id,
          message: `${newRealtor.firstName} ${newRealtor.lastName} just joined using your referral code`,
          metadata: {
            firstName: newRealtor.firstName,
            lastName: newRealtor.lastName,
            email: newRealtor.email,
          },
          read: false,
          delivered: true,
          channels: ["database"],
        });

        sendUplineReferralEmail(recruiter, newRealtor, { downlineCount }).catch(
          (e) => console.error("Upline email error:", e?.message || e),
        );
      } catch (e) {
        console.error("Upline notification error:", e?.message || e);
      }
    }
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    if (!res.headersSent) {
      res.status(500).json({
        message:
          "Something went wrong on our end while creating your account. Please try again in a moment.",
        code: "SERVER_ERROR",
      });
    }
  }
};

export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user.id;

    const uploadFromBuffer = (buffer) =>
      new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "realtors/avatars",
            transformation: { width: 800, crop: "limit" },
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
      });

    const result = await uploadFromBuffer(req.file.buffer);

    const updated = await Realtor.findByIdAndUpdate(
      userId,
      { avatar: result.secure_url },
      { new: true, runValidators: true },
    ).select("firstName lastName avatar referralCode");

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      message: "Avatar updated",
      avatar: updated.avatar,
      user: {
        id: updated._id,
        name: `${updated.firstName} ${updated.lastName}`,
        avatar: updated.avatar,
        referralCode: updated.referralCode,
      },
    });
  } catch (error) {
    console.error("updateAvatar error:", error);
    return res.status(500).json({ message: "Failed to upload avatar" });
  }
};

// --- Admin-only handlers (unchanged from Sprint 1) ---

export const getRealtors = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 10, 1),
      100,
    );
    const sort = req.query.sort || "-createdAt";
    const search = req.query.search || "";
    const recruitedBy = req.query.recruitedBy || "";

    const filter = {};
    if (recruitedBy) filter.recruitedBy = recruitedBy;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { referralCode: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Realtor.countDocuments(filter);
    const pages = Math.max(Math.ceil(total / limit), 1);
    const skip = (page - 1) * limit;

    const docs = await Realtor.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("recruitedBy", "firstName lastName referralCode")
      .select(
        "firstName lastName email phone referralCode createdAt recruitedBy bank accountName accountNumber birthDate",
      )
      .lean();

    const formatted = docs.map((d) => ({
      _id: d._id,
      referralCode: d.referralCode,
      name: `${d.firstName} ${d.lastName}`,
      email: d.email,
      phone: d.phone,
      accountNumber: d.accountNumber || null,
      accountName: d.accountName || null,
      bank: d.bank || null,
      birthDate: d.birthDate || null,
      createdAt: d.createdAt,
      recruitedByName: d.recruitedBy
        ? `${d.recruitedBy.firstName} ${d.recruitedBy.lastName}`
        : "-",
      recruitedByCode: d.recruitedBy ? d.recruitedBy.referralCode : "-",
    }));

    return res.json({ docs: formatted, total, page, pages, limit });
  } catch (err) {
    console.error("getRealtors error:", err);
    return res.status(500).json({ message: "Failed to fetch realtors" });
  }
};

export const getRealtorById = async (req, res) => {
  try {
    const { id } = req.params;
    const realtor = await Realtor.findById(id)
      .populate("recruitedBy", "firstName lastName referralCode")
      .select("-passwordHash")
      .lean();

    if (!realtor) {
      return res.status(404).json({ message: "Realtor not found" });
    }

    return res.json({
      ...realtor,
      recruitedByName: realtor.recruitedBy
        ? `${realtor.recruitedBy.firstName} ${realtor.recruitedBy.lastName}`
        : null,
      recruitedByCode: realtor.recruitedBy
        ? realtor.recruitedBy.referralCode
        : null,
    });
  } catch (err) {
    console.error("getRealtorById error:", err);
    return res.status(500).json({ message: "Failed to fetch realtor" });
  }
};

export const updateRealtor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      phone,
      state,
      bank,
      accountName,
      accountNumber,
      birthDate,
    } = req.body;

    const existing = await Realtor.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Realtor not found" });
    }

    if (email && email !== existing.email) {
      const emailExists = await Realtor.findOne({ email });
      if (emailExists) {
        return res
          .status(409)
          .json({ message: "Email already in use", field: "email" });
      }
    }

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (state) updateData.state = state;
    if (bank) updateData.bank = bank;
    if (accountName) updateData.accountName = accountName;
    if (accountNumber) updateData.accountNumber = accountNumber;
    if (birthDate) updateData.birthDate = new Date(birthDate);

    const updated = await Realtor.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("recruitedBy", "firstName lastName referralCode")
      .select("-passwordHash")
      .lean();

    return res.json({
      message: "Realtor updated successfully",
      realtor: {
        ...updated,
        recruitedByName: updated.recruitedBy
          ? `${updated.recruitedBy.firstName} ${updated.recruitedBy.lastName}`
          : null,
      },
    });
  } catch (err) {
    console.error("updateRealtor error:", err);
    return res.status(500).json({ message: "Failed to update realtor" });
  }
};

export const deleteRealtor = async (req, res) => {
  try {
    const { id } = req.params;
    const realtor = await Realtor.findById(id);
    if (!realtor) {
      return res.status(404).json({ message: "Realtor not found" });
    }

    const recruitsCount = await Realtor.countDocuments({ recruitedBy: id });
    if (recruitsCount > 0) {
      return res.status(400).json({
        message: `Cannot delete realtor with ${recruitsCount} recruits. Please reassign or remove recruits first.`,
      });
    }

    await Realtor.findByIdAndDelete(id);
    return res.json({ message: "Realtor deleted successfully", id });
  } catch (err) {
    console.error("deleteRealtor error:", err);
    return res.status(500).json({ message: "Failed to delete realtor" });
  }
};
