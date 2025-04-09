const dayOfAge = document.getElementById("day");
const monthOfAge = document.getElementById("month");
const yearOfAge = document.getElementById("year");

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
const dateLabels = document.querySelectorAll(".label-date");

const submitButton = document.getElementById("btn-submit");

// Get current year
const currentYear = new Date().getFullYear();

const handleDate = (e) => {
  e.preventDefault();

  // Reset previous errors
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

  if (dayOfAge.value === "") {
    dateLabels.forEach((label) => {
      label.classList.remove("label-date");
      label.classList.add("error-color-label");
    });
    dayRequired.style.display = "block";
    dayRequired.classList.add("error-color");
  } else if (dayOfAge.value < 1 || dayOfAge.value > 31) {
    dayValidation.style.display = "block";
    dayValidation.classList.add("error-color");
    dateLabels[index].classList.remove("error-color-label");
  }

  if (monthOfAge.value === "") {
    monthRequired.style.display = "block";
    monthRequired.classList.add("error-color");
  } else if (monthOfAge.value < 1 || monthOfAge.value > 12) {
    monthValidation.style.display = "block";
    monthValidation.classList.add("error-color");
  }

  if (yearOfAge.value === "") {
    yearRequired.style.display = "block";
    yearRequired.classList.add("error-color");
  } else if (yearOfAge.value < 1900 || yearOfAge.value > currentYear) {
    yearValidation.style.display = "block";
    yearValidation.classList.add("error-color");
  }
};

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

submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  const day = parseInt(dayOfAge.value);
  const month = parseInt(monthOfAge.value);
  const year = parseInt(yearOfAge.value);

  const age = calculateAge(day, month, year);
  displayAge(age); // Call displayAge with the calculated age
});

submitButton.addEventListener("click", handleDate);
