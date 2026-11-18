const form = document.getElementById("age-form");

const fields = {
  day: document.getElementById("day"),
  month: document.getElementById("month"),
  year: document.getElementById("year"),
};

const results = {
  years: [
    document.getElementById("result-years"),
    document.getElementById("label-years"),
    "year",
  ],
  months: [
    document.getElementById("result-months"),
    document.getElementById("label-months"),
    "month",
  ],
  days: [
    document.getElementById("result-days"),
    document.getElementById("label-days"),
    "day",
  ],
};

// A leap (bissextile) year is divisible by 4, except century years,
// which must also be divisible by 400 (2000 is a leap year, 1900 is not).
const isLeapYear = (year) =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

// Days in a month (month is 1-12). February has 29 days in a leap year, 28 otherwise.
const daysInMonth = (year, month) => {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
};

// Day number of a date, counted in UTC. setUTCFullYear is used because
// Date.UTC and new Date() turn years 0-99 into 1900-1999.
const dayNumber = (year, month, day) => {
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  return Math.round(date.getTime() / (24 * 60 * 60 * 1000));
};

// Show or clear the error message under one input
const setError = (input, message) => {
  const field = input.closest(".field");
  field.classList.toggle("has-error", Boolean(message));
  // A message of " " turns the field red without showing any text
  field.querySelector(".error").textContent = message.trim();
  input.setAttribute("aria-invalid", message ? "true" : "false");
};

// Returns { day, month, year } when the date is valid, otherwise null
const validate = () => {
  const values = {};
  let valid = true;

  for (const [name, input] of Object.entries(fields)) {
    const raw = input.value.trim();
    setError(input, "");

    if (raw === "") {
      setError(input, "This field is required");
      valid = false;
    } else if (!/^\d+$/.test(raw)) {
      setError(input, `Must be a valid ${name}`);
      valid = false;
    } else {
      values[name] = Number(raw);
    }
  }
  if (!valid) return null;

  const { day, month, year } = values;
  const today = new Date();

  if (day < 1 || day > 31) {
    setError(fields.day, "Must be a valid day");
    valid = false;
  }
  if (month < 1 || month > 12) {
    setError(fields.month, "Must be a valid month");
    valid = false;
  }
  // Any year from 1 AD works (there is no year 0)
  if (year < 1) {
    setError(fields.year, "Must be a valid year");
    valid = false;
  } else if (year > today.getFullYear()) {
    setError(fields.year, "Must be in the past");
    valid = false;
  }
  if (!valid) return null;

  // Dates like 31/04 or 29/02 in a non-leap year
  if (day > daysInMonth(year, month)) {
    setError(fields.day, "Must be a valid date");
    setError(fields.month, " ");
    setError(fields.year, " ");
    return null;
  }

  // A date later this year
  const todayNumber = dayNumber(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
  );
  if (dayNumber(year, month, day) > todayNumber) {
    setError(fields.day, "Must be in the past");
    setError(fields.month, " ");
    setError(fields.year, " ");
    return null;
  }

  return values;
};

const calculateAge = ({ day, month, year }) => {
  const now = new Date();
  const today = {
    day: now.getDate(),
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };

  // The date that is `count` whole months after the birthday. If that month is
  // shorter (born on the 31st, or 29 Feb in a non-leap year), use its last day.
  const monthAnniversary = (count) => {
    const index = month - 1 + count;
    const y = year + Math.floor(index / 12);
    const m = (index % 12) + 1;
    return { day: Math.min(day, daysInMonth(y, m)), month: m, year: y };
  };

  // Whole months lived: step back one if this month's anniversary hasn't come yet
  let totalMonths = (today.year - year) * 12 + (today.month - month);
  let last = monthAnniversary(totalMonths);
  if (last.month === today.month && last.day > today.day) {
    totalMonths--;
    last = monthAnniversary(totalMonths);
  }

  // Days since the last month anniversary
  const days =
    dayNumber(today.year, today.month, today.day) -
    dayNumber(last.year, last.month, last.day);

  return {
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
    days,
  };
};

const showAge = (age) => {
  for (const [key, [number, label, word]] of Object.entries(results)) {
    const value = age ? age[key] : "- -";
    number.textContent = value;
    label.textContent = value === 1 ? word : `${word}s`;
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const date = validate();
  showAge(date ? calculateAge(date) : null);
});

// Highest valid number for each box, checked while typing
const maxValue = { day: 31, month: 12 };

for (const [name, input] of Object.entries(fields)) {
  input.addEventListener("input", () => {
    // Only digits can be typed
    input.value = input.value.replace(/\D/g, "");

    // Too high (e.g. 13 for a month): show the error right away.
    // Otherwise clear any old error as soon as the user edits the box.
    if (maxValue[name] && Number(input.value) > maxValue[name]) {
      setError(input, `Must be a valid ${name}`);
    } else if (input.closest(".field").classList.contains("has-error")) {
      setError(input, "");
    }
  });
}
