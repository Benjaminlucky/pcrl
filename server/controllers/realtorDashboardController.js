import Realtor from "../models/realtor.model.js";
import Notification from "../models/notification.model.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const realtor = await Realtor.findById(userId)
      .populate("recruitedBy", "firstName lastName referralCode")
      .exec();

    if (!realtor) {
      return res.status(404).json({ message: "User not found" });
    }

    const realtorObj = realtor.toObject({ virtuals: true });

    const recruitCount = await Realtor.countDocuments({ recruitedBy: userId });

    return res.json({
      id: realtorObj._id,
      firstName: realtorObj.firstName,
      lastName: realtorObj.lastName,
      name: `${realtorObj.firstName} ${realtorObj.lastName}`,
      avatar: realtorObj.avatar || null,
      downlines: recruitCount,
      recruitedBy: realtorObj.recruitedBy
        ? `${realtorObj.recruitedBy.firstName} ${realtorObj.recruitedBy.lastName}`
        : "Admin",
      recruitedByCode: realtorObj.recruitedBy
        ? realtorObj.recruitedBy.referralCode
        : null,
      referralCode: realtorObj.referralCode,
      referralLink: realtorObj.referralLink,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------------------------------------------------------
// GET /api/realtors/me/downline  (protected, realtor)
// Returns ONLY the logged-in realtor's own direct downline, with safe fields.
// This replaces the previous pattern where the realtor dashboard called the
// admin list endpoint (which leaked every recruit's bank account + number).
// ---------------------------------------------------------------------------
export const getMyDownline = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 50, 1),
      100,
    );
    const skip = (page - 1) * limit;

    const filter = { recruitedBy: userId };

    const total = await Realtor.countDocuments(filter);
    const pages = Math.max(Math.ceil(total / limit), 1);

    const docs = await Realtor.find(filter)
      .sort("-createdAt")
      .skip(skip)
      .limit(limit)
      // SAFE projection only — no bank, accountNumber, accountName, phone, etc.
      .select("firstName lastName referralCode createdAt")
      .lean();

    // Count each downline member's own recruits (their team size)
    const withCounts = await Promise.all(
      docs.map(async (d) => ({
        _id: d._id,
        name: `${d.firstName} ${d.lastName}`,
        referralCode: d.referralCode,
        createdAt: d.createdAt,
        recruits: await Realtor.countDocuments({ recruitedBy: d._id }),
      })),
    );

    return res.json({ docs: withCounts, total, page, pages, limit });
  } catch (err) {
    console.error("getMyDownline error:", err);
    return res.status(500).json({ message: "Failed to fetch downline" });
  }
};

// ---------------------------------------------------------------------------
// GET /api/realtors/me/notifications  (protected, realtor)
// In-app notification feed for the logged-in realtor (referral_signup, etc.).
// ---------------------------------------------------------------------------
export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 20, 1),
      50,
    );

    const notifications = await Notification.find({ recipient: userId })
      .sort("-createdAt")
      .limit(limit)
      .lean();

    const unread = await Notification.countDocuments({
      recipient: userId,
      read: false,
    });

    return res.json({
      unread,
      notifications: notifications.map((n) => ({
        id: n._id,
        type: n.type,
        message: n.message,
        read: n.read,
        createdAt: n.createdAt,
      })),
    });
  } catch (err) {
    console.error("getMyNotifications error:", err);
    return res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// ---------------------------------------------------------------------------
// PATCH /api/realtors/me/notifications/read  (protected, realtor)
// Marks all of the realtor's notifications as read.
// ---------------------------------------------------------------------------
export const markNotificationsRead = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    await Notification.updateMany(
      { recipient: userId, read: false },
      { $set: { read: true } },
    );
    return res.json({ message: "Notifications marked as read" });
  } catch (err) {
    console.error("markNotificationsRead error:", err);
    return res.status(500).json({ message: "Failed to update notifications" });
  }
};
