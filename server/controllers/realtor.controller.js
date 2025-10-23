// controllers/auth.controller.js
import Realtor from "../models/realtor.model.js";
import bcrypt from "bcrypt";

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
