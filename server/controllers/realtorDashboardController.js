import Realtor from "../models/realtor.model.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const realtor = await Realtor.findById(userId)
      .populate("recruitedBy", "firstName lastName")
      .exec();

    if (!realtor) {
      return res.status(404).json({ message: "User not found" });
    }

    // Convert including virtuals
    const realtorObj = realtor.toObject({ virtuals: true });

    // Count real downlines
    const recruitCount = await Realtor.countDocuments({ recruitedBy: userId });

    return res.json({
      id: realtorObj._id, // ✅ Added user ID so frontend can use it
      firstName: realtorObj.firstName,
      lastName: realtorObj.lastName,
      name: `${realtorObj.firstName} ${realtorObj.lastName}`,
      avatar: realtorObj.avatar || null,
      downlines: recruitCount,
      recruitedBy: realtorObj.recruitedBy
        ? `${realtorObj.recruitedBy.firstName} ${realtorObj.recruitedBy.lastName}`
        : "Admin",
      referralCode: realtorObj.referralCode,
      referralLink: realtorObj.referralLink,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
