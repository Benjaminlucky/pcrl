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
      ...rest
    } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    //Get Recruiter

    let recruiter = null;
    if (ref && ref.trim() !== "") {
      recruiter = await Realtor.findOne({ referralCode: ref.trim() });
      if (!recruiter) {
        return res
          .status(400)
          .json({ message: "Invalid referral code provided" });
      }
    }

    //Generate New refferal code based on Count
    const count = await Realtor.countDocuments();
    const referralCode = `pcr${(count + 1).toString().padStart(2, "0")}`;

    const newRealtor = await Realtor.create({
      firstName,
      lastName,
      email,
      phone,
      state,
      bank,
      accountName,
      accountNumber,
      passwordHash,
      referralCode,
      birthDate: new Date(birthDate),
      recruitedBy: recruiter ? recruiter._id : null,

      ...rest,
    });

    res.status(201).json({
      message: "User created successfully",
      referralCode: newRealtor.referralCode,
      referralLink: newRealtor.referralLink,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to create Realtor Account" });
  }
};
