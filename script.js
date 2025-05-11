const dayOfAge = document.getElementById("day");
const monthOfAge = document.getElementById("month");
const yearOfAge = document.getElementById("year");

dayOfAge.addEventListener("input", (e) => {
  if (e.target.value.length === 2) {
    monthOfAge.focus();
  }
});

monthOfAge.addEventListener("input", (e) => {
  if (e.target.value.length === 2) {
    yearOfAge.focus();
  }
});

yearOfAge.addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/\D/g, "");
});

const dayValidation = document.querySelector(".valid-day");
const dayRequired = document
  .querySelector(".label-day")
  .parentElement.querySelector(".field-required");

const monthValidation = document.querySelector(".valid-month");
const monthRequired = document
  .querySelector(".label-month")
  .parentElement.querySelector(".field-required");

const yearValidation = document.querySelector(".valid-year");
const yearRequired = document
  .querySelector(".label-year")
  .parentElement.querySelector(".field-required");
const yearRange = document.querySelector(".valid-year-range");
const dateLabels = document.querySelectorAll(".label-date");

const inputError = document.querySelectorAll(".input-error");

const submitButton = document.getElementById("btn-submit");

const currentYear = new Date().getFullYear();

// Modified handleDate function returns true if all validations pass
const handleDate = (e) => {
  e.preventDefault();
  let valid = true;

  // Reset error displays
  dayValidation.style.display = "none";
  dayRequired.style.display = "none";
  dayValidation.classList.remove("error-color");
  dayRequired.classList.remove("error-color");

  monthValidation.style.display = "none";
  monthRequired.style.display = "none";
  monthValidation.classList.remove("error-color");
  monthRequired.classList.remove("error-color");

  yearValidation.style.display = "none";
  yearRequired.style.display = "none";
  yearValidation.classList.remove("error-color");
  yearRequired.classList.remove("error-color");

  // Validate day
  if (dayOfAge.value === "") {
    dateLabels.forEach((label) => {
      label.classList.remove("label-date");
      label.classList.add("error-color-label");
    });
    dayRequired.style.display = "block";
    dayRequired.classList.add("error-color");
    valid = false;
  } else if (dayOfAge.value < 1 || dayOfAge.value > 31) {
    dayValidation.style.display = "block";
    dayValidation.classList.add("error-color");
    valid = false;
  }

  // Validate month
  if (monthOfAge.value === "") {
    monthRequired.style.display = "block";
    monthRequired.classList.add("error-color");
    valid = false;
  } else if (monthOfAge.value < 1 || monthOfAge.value > 12) {
    monthValidation.style.display = "block";
    monthValidation.classList.add("error-color");
    valid = false;
  }

  // Validate year and check range
  if (yearOfAge.value === "") {
    yearRequired.style.display = "block";
    yearRequired.classList.add("error-color");
    valid = false;
  } else {
    const yearValue = parseInt(yearOfAge.value);
    yearValidation.innerText = "";
    if (yearValue < 1925) {
      yearValidation.style.display = "block";
      yearValidation.innerText = "Must be a valid year";
      yearValidation.classList.add("error-color");
      valid = false;
    } else if (yearValue > currentYear) {
      yearValidation.style.display = "block";
      yearValidation.innerText = "Must be in the past";
      yearValidation.classList.add("error-color");
      valid = false;
    }
  }
  return valid;
};

// Combine calculation and validation in one event listener
submitButton.addEventListener("click", (e) => {
  // Run validation. If invalid, stop processing.
  if (!handleDate(e)) return;

  // If valid, calculate and display age
  const day = parseInt(dayOfAge.value);
  const month = parseInt(monthOfAge.value);
  const year = parseInt(yearOfAge.value);
  const age = calculateAge(day, month, year);
  displayAge(age);
});

const calculateAge = (day, month, year) => {
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();

  let ageYears = today.getFullYear() - birthDate.getFullYear();
  let ageMonths = today.getMonth() - birthDate.getMonth();
  let ageDays = today.getDate() - birthDate.getDate();

  if (ageDays < 0) {
    ageMonths--;
    const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    ageDays += previousMonth.getDate();
  }

  if (ageMonths < 0) {
    ageYears--;
    ageMonths += 12;
  }

  return { years: ageYears, months: ageMonths, days: ageDays };
};

const displayAge = (age) => {
  document.querySelector(".number-years").innerText = age.years;
  document.querySelector(".number-months").innerText = age.months;
  document.querySelector(".number-days").innerText = age.days;
};
