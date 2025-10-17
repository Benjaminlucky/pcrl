// utils/birthday.js
import { DateTime } from "luxon"; // recommended for timezone safety (install: npm install luxon)

const TZ = "Africa/Lagos";

export function getNextBirthdayAndDaysUntil(birthDateISO) {
  // birthDateISO: a Date object or ISO string, e.g. "1985-02-28"
  if (!birthDateISO) return null;

  const dob = DateTime.fromJSDate(new Date(birthDateISO)).setZone(TZ);
  const now = DateTime.now().setZone(TZ).startOf("day");

  // Keep month/day
  let month = dob.month;
  let day = dob.day;

  // handle Feb 29 on non-leap years: treat as Feb 28
  if (month === 2 && day === 29) {
    // determine if current year is leap
    let candidate = DateTime.local(now.year, 2, 29).setZone(TZ);
    if (!candidate.isValid) {
      day = 28;
    }
  }

  // candidate this year
  let candidate = DateTime.local(now.year, month, day).setZone(TZ);
  if (candidate < now) {
    candidate = candidate.plus({ years: 1 });
    // for Feb 29, re-evaluate on next year
    if (month === 2 && day === 29 && !candidate.isValid) {
      candidate = DateTime.local(candidate.year, 2, 28).setZone(TZ);
    }
  }

  const daysUntil = Math.ceil(candidate.diff(now, "days").days);

  return { nextBirthday: candidate.toJSDate(), daysUntil };
}
