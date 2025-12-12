// utils/birthday.js
export function getNextBirthdayAndDaysUntil(birthDate) {
  if (!birthDate) return null;

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const dob = new Date(birthDate);

  let nextBirthday = new Date(
    Date.UTC(
      today.getUTCFullYear(),
      dob.getUTCMonth(),
      dob.getUTCDate(),
      0,
      0,
      0,
      0
    )
  );

  if (nextBirthday < today) {
    nextBirthday = new Date(
      Date.UTC(
        today.getUTCFullYear() + 1,
        dob.getUTCMonth(),
        dob.getUTCDate(),
        0,
        0,
        0,
        0
      )
    );
  }

  const diff = nextBirthday - today;
  const daysUntil = Math.floor(diff / (1000 * 60 * 60 * 24));

  return { nextBirthday, daysUntil };
}
