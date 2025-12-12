// controllers/admin.controller.js
import Admin from "../models/admin.js";
import Realtor from "../models/realtor.model.js";
import Notification from "../models/notification.model.js";
import jwt from "jsonwebtoken";
import { getNextBirthdayAndDaysUntil } from "../utils/birthday.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// -------------------------------
// ADMIN AUTH
// -------------------------------
export const signupAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const exists = await Admin.findOne({ email });

    if (exists)
      return res.status(400).json({ message: "Admin already exists" });

    const admin = await Admin.create({ email, password });
    const token = generateToken(admin._id);

    res.status(201).json({ token, admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(admin._id);

    res.json({
      token,
      user: {
        id: admin._id,
        email: admin.email,
        role: "admin",
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------------------
// UPCOMING 7-DAY BIRTHDAY LIST
// FOR DETAILED FRONTEND SECTION
// -------------------------------
export const getUpcomingBirthdays = async (req, res) => {
  try {
    const realtors = await Realtor.find({ birthDate: { $ne: null } }).lean();

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const upcoming = [];

    for (const r of realtors) {
      const info = getNextBirthdayAndDaysUntil(r.birthDate);
      if (!info) continue;

      const { daysUntil, nextBirthday } = info;

      if (daysUntil >= 0 && daysUntil <= 7) {
        upcoming.push({
          id: r._id,
          firstName: r.firstName,
          lastName: r.lastName,
          email: r.email,
          nextBirthday,
          daysBefore: daysUntil,
          message:
            daysUntil === 0
              ? `${r.firstName} ${r.lastName} has a birthday today! 🎉`
              : `${daysUntil} days to ${r.firstName} ${r.lastName}'s birthday 🎂`,
        });
      }
    }

    return res.json({
      total: upcoming.length,
      birthdays: upcoming.sort((a, b) => a.daysBefore - b.daysBefore),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load birthdays" });
  }
};

// -------------------------------
// NOTIFICATION LIST
// for "count badge" + full notification logs
// -------------------------------
export const getBirthdayNotifications = async (req, res) => {
  try {
    const notifs = await Notification.find({
      type: "birthday_countdown",
    })
      .sort({ targetDate: 1, daysBefore: 1 })
      .lean();

    return res.json({
      total: notifs.length,
      notifications: notifs.map((n) => ({
        message: n.message,
        firstName: n.metadata?.firstName,
        lastName: n.metadata?.lastName,
        daysBefore: n.daysBefore,
        targetDate: n.targetDate,
        delivered: n.delivered,
        createdAt: n.createdAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load notifications" });
  }
};
