// jobs/birthdayJob.js
import cron from "node-cron";
import Realtor from "../models/realtor.model.js";
import Notification from "../models/notification.model.js";
import { getNextBirthdayAndDaysUntil } from "../utils/birthday.js";

cron.schedule(
  "0 0 * * *", // midnight
  async () => {
    await runBirthdayChecks();
  },
  {
    scheduled: true,
    timezone: "Africa/Lagos",
  }
);

async function deliver(notification) {
  await Notification.findByIdAndUpdate(notification._id, {
    delivered: true,
    channels: ["database"],
  });
}

export async function runBirthdayChecks() {
  const realtors = await Realtor.find({
    birthDate: { $exists: true, $ne: null },
  }).lean();

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  for (const r of realtors) {
    const info = getNextBirthdayAndDaysUntil(r.birthDate);
    if (!info) continue;

    const { nextBirthday, daysUntil } = info;
    if (daysUntil > 7 || daysUntil < 0) continue;

    const message =
      daysUntil === 0
        ? `${r.firstName} ${r.lastName} has a birthday today! 🎉`
        : `${daysUntil} days to ${r.firstName} ${r.lastName}'s birthday 🎂`;

    const targetDate = new Date(nextBirthday);
    targetDate.setUTCHours(0, 0, 0, 0);

    const exists = await Notification.findOne({
      type: "birthday_countdown",
      realtor: r._id,
      targetDate,
      daysBefore: daysUntil,
    });

    if (!exists) {
      const notif = await Notification.create({
        type: "birthday_countdown",
        realtor: r._id,
        targetDate,
        daysBefore: daysUntil,
        delivered: false,
        message,
        metadata: {
          firstName: r.firstName,
          lastName: r.lastName,
          email: r.email,
        },
      });

      await deliver(notif);
    }
  }
}
