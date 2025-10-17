import cron from "node-cron";
import Realtor from "../models/realtor.model.js";
import Notification from "../models/notification.model.js";
import { getNextBirthdayAndDaysUntil } from "../utils/birthday.js";
import { deliverBirthdayNotification } from "./delivery.js";

// Schedule to run every day at 00:05 Africa/Lagos
// node-cron uses server time; if server is in UTC, this aligns correctly via timezone.
cron.schedule(
  "5 0 * * *",
  async () => {
    await runBirthdayChecks();
  },
  {
    scheduled: true,
    timezone: "Africa/Lagos",
  }
);

export async function runBirthdayChecks() {
  try {
    // Fetch all realtors who have a birthDate
    const realtors = await Realtor.find({ birthDate: { $ne: null } }).lean();

    for (const r of realtors) {
      const info = getNextBirthdayAndDaysUntil(r.birthDate);
      if (!info) continue;

      const { nextBirthday, daysUntil } = info;

      // Target reminder days (can add more: e.g., 7, 3, 1, 0)
      const targets = [7];

      if (targets.includes(daysUntil)) {
        try {
          // Normalize targetDate to midnight UTC (date-only)
          const targetDate = new Date(
            nextBirthday.toISOString().split("T")[0] + "T00:00:00.000Z"
          );

          // Check if notification already exists
          const existing = await Notification.findOne({
            type: "birthday_reminder",
            realtor: r._id,
            targetDate,
            daysBefore: daysUntil,
          });

          if (!existing) {
            const notif = await Notification.create({
              type: "birthday_reminder",
              realtor: r._id,
              targetDate,
              daysBefore: daysUntil,
              metadata: {
                firstName: r.firstName,
                lastName: r.lastName,
                email: r.email,
              },
              channels: [],
            });

            // Deliver via email/socket
            await deliverBirthdayNotification(notif, r);
          } else if (!existing.delivered) {
            // Re-attempt delivery if previously undelivered
            await deliverBirthdayNotification(existing, r);
          }
        } catch (e) {
          console.error("Notification creation/delivery error:", e);
        }
      }
    }
  } catch (err) {
    console.error("Birthday job error:", err);
  }
}
