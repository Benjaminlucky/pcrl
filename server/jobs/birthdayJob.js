// jobs/birthdayJob.js
import cron from "node-cron";
import Realtor from "../models/realtor.model.js";
import Notification from "../models/notification.model.js";
import {
  getNextBirthdayAndDaysUntil,
  BIRTHDAY_ZONE,
} from "../utils/birthday.js";
import {
  sendAdminBirthdayReminder,
  sendRealtorBirthdayGreeting,
} from "../utils/email.js";

// Days on which the ADMIN receives an email reminder.
const ADMIN_EMAIL_DAYS = new Set([7, 1, 0]);

cron.schedule(
  "0 0 * * *", // midnight, Africa/Lagos
  async () => {
    console.log("[birthdayJob] Running daily birthday checks…");
    const summary = await runBirthdayChecks();
    console.log("[birthdayJob] Done:", JSON.stringify(summary));
  },
  { timezone: BIRTHDAY_ZONE },
);

// Marks the in-app countdown notification delivered (database channel).
async function markDelivered(notificationId) {
  await Notification.findByIdAndUpdate(notificationId, {
    delivered: true,
    channels: ["database"],
  });
}

/**
 * Idempotent: safe to run multiple times per day.
 * - In-app countdown notification for days 0..7 (dashboard badge/list).
 * - Admin email at 7 / 1 / 0 days (deduped via EmailLog).
 * - Realtor greeting on the day (deduped via EmailLog).
 * Returns a summary suitable for the manual-trigger endpoint.
 */
export async function runBirthdayChecks() {
  const summary = {
    scanned: 0,
    inWindow: 0,
    notificationsCreated: 0,
    adminEmailsSent: 0,
    adminEmailsSkipped: 0,
    realtorEmailsSent: 0,
    realtorEmailsSkipped: 0,
    errors: 0,
  };

  const realtors = await Realtor.find({
    birthDate: { $exists: true, $ne: null },
  }).lean();

  summary.scanned = realtors.length;

  for (const r of realtors) {
    try {
      const info = getNextBirthdayAndDaysUntil(r.birthDate);
      if (!info) continue;

      const {
        nextBirthday,
        daysUntil,
        birthdayYear,
        observedMonth,
        observedDay,
      } = info;

      if (daysUntil > 7 || daysUntil < 0) continue;
      summary.inWindow += 1;

      // --- 1) In-app countdown notification (timezone-proof targetDate) ---
      const targetDate = new Date(
        Date.UTC(birthdayYear, observedMonth - 1, observedDay),
      );

      const message =
        daysUntil === 0
          ? `${r.firstName} ${r.lastName} has a birthday today! 🎉`
          : `${daysUntil} day(s) to ${r.firstName} ${r.lastName}'s birthday 🎂`;

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
          recipientRole: "admin",
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
        await markDelivered(notif._id);
        summary.notificationsCreated += 1;
      }

      // --- 2) Admin email at 7 / 1 / 0 days (idempotent) ---
      if (ADMIN_EMAIL_DAYS.has(daysUntil)) {
        const res = await sendAdminBirthdayReminder({
          realtor: r,
          daysUntil,
          nextBirthday,
          birthdayYear,
        });
        if (res.status === "sent") summary.adminEmailsSent += 1;
        else if (res.status === "skipped") summary.adminEmailsSkipped += 1;
        else summary.errors += 1;
      }

      // --- 3) Realtor greeting on the day (idempotent) ---
      if (daysUntil === 0) {
        const res = await sendRealtorBirthdayGreeting({
          realtor: r,
          birthdayYear,
        });
        if (res.status === "sent") summary.realtorEmailsSent += 1;
        else if (res.status === "skipped") summary.realtorEmailsSkipped += 1;
        else summary.errors += 1;
      }
    } catch (err) {
      summary.errors += 1;
      console.error(
        "[birthdayJob] error for realtor",
        r?._id,
        err?.message || err,
      );
    }
  }

  return summary;
}
