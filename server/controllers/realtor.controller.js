// controllers/auth.controller.js
import Realtor from "../models/realtor.model.js";
import bcrypt from "bcrypt";
import cloudinary from "../utils/cloudinary.config.js";
import streamifier from "streamifier";

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

    const passwordHash = await bcrypt.hash(password, 12);

    let recruiter = null;
    if (ref?.trim()) {
      recruiter = await Realtor.findOne({ referralCode: ref.trim() });
      if (!recruiter) {
        return res
          .status(400)
          .json({ message: "Invalid referral code provided" });
      }
    }

    const count = await Realtor.countDocuments();
    const referralCode = `pcr${String(count + 1).padStart(3, "0")}`;

    const newRealtor = await Realtor.create({
      firstName,
      lastName,
      email,
      phone,
      state,
      bank,
      accountName,
      accountNumber,
      avatar: avatar || undefined, // ✅ allow override
      passwordHash,
      referralCode,
      birthDate: new Date(birthDate),
      recruitedBy: recruiter?._id || null,
    });

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
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({ message: "Unable to create Realtor Account" });
  }
};

// Update avatar controller
export const updateAvatar = async (req, res) => {
  try {
    // multer has put the file buffer on req.file
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user.id;

    // Upload buffer to Cloudinary via upload_stream
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
          }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
      });

    const result = await uploadFromBuffer(req.file.buffer);

    // Save avatar URL on Realtor
    const updated = await Realtor.findByIdAndUpdate(
      userId,
      { avatar: result.secure_url },
      { new: true, runValidators: true }
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
