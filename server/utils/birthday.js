// utils/birthday.js
import { DateTime } from "luxon";

export const BIRTHDAY_ZONE = "Africa/Lagos";

const isLeapYear = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

// Leap-day policy: Feb 29 birthdays are OBSERVED on Feb 28 in non-leap years.
// (Change to { m: 3, d: 1 } here if you prefer "celebrate on March 1" instead.)
function observedMonthDay(month, day, year) {
  if (month === 2 && day === 29 && !isLeapYear(year)) {
    return { m: 2, d: 28 };
  }
  return { m: month, d: day };
}

/**
 * Computes the next upcoming birthday and whole days until it, in Africa/Lagos
 * local time so a birthday is never off-by-one for late-evening Lagos dates.
 *
 * birthDate is stored as a UTC-midnight Date (e.g. 1990-05-28T00:00:00Z), so we
 * read its calendar month/day in UTC (exactly as saved), then rebuild the date
 * in the Lagos zone for the comparison.
 *
 * Backward-compatible return shape: { nextBirthday: Date, daysUntil: number }.
 * Extra fields (birthdayYear, observedMonth, observedDay) support stable,
 * timezone-proof idempotency keys in the cron.
 */
export function getNextBirthdayAndDaysUntil(birthDate, opts = {}) {
  if (!birthDate) return null;
  const zone = opts.zone || BIRTHDAY_ZONE;

  const dob = DateTime.fromJSDate(new Date(birthDate)).toUTC();
  if (!dob.isValid) return null;

  const month = dob.month; // 1-12
  const day = dob.day; // 1-31

  const today = DateTime.now().setZone(zone).startOf("day");

  const build = (year) => {
    const { m, d } = observedMonthDay(month, day, year);
    return DateTime.fromObject({ year, month: m, day: d }, { zone }).startOf(
      "day",
    );
  };

  let candidate = build(today.year);
  if (candidate < today) candidate = build(today.year + 1);

  const daysUntil = Math.round(candidate.diff(today, "days").days);
  const { m: observedMonth, d: observedDay } = observedMonthDay(
    month,
    day,
    candidate.year,
  );

  return {
    nextBirthday: candidate.toJSDate(),
    daysUntil,
    birthdayYear: candidate.year,
    observedMonth, // 1-12
    observedDay, // 1-31
  };
}
