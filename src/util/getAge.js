export const getAge = (dob, getOnlyAge = false, getYears = false) => {
  const today = new Date();

  const yearNow = today.getYear();
  const monthNow = today.getMonth();
  const dateNow = today.getDate();

  const dobDate = new Date(dob);

  const yearDob = dobDate.getYear();
  const monthDob = dobDate.getMonth();
  const dateDob = dobDate.getDate();
  let yearString = "";
  let monthString = "";
  let dayString = "";
  let monthAge;
  let dateAge;

  let yearAge = yearNow - yearDob;

  if (monthNow >= monthDob) {
    monthAge = monthNow - monthDob;
  } else {
    yearAge--;
    monthAge = 12 + monthNow - monthDob;
  }

  if (dateNow >= dateDob) {
    dateAge = dateNow - dateDob;
  } else {
    monthAge--;
    dateAge = 31 + dateNow - dateDob;

    if (monthAge < 0) {
      monthAge = 11;
      yearAge--;
    }
  }

  if (getOnlyAge) {
    return yearAge;
  }

  if (getYears) {
    if (yearAge >= 1) {
      return `${yearAge} ${yearAge > 1 ? "yrs" : "yr"}`;
    }
    if (monthAge >= 1) {
      return `${monthAge} ${monthAge > 1 ? "mns" : "mn"}`;
    }
    if (dateAge >= 1) {
      return `${dateAge} ${dateAge > 1 ? "dys" : "dy"}`;
    }
  }

  if (yearAge > 1) {
    yearString = " Years";
  } else {
    yearString = " Year";
  }
  if (monthAge > 1) {
    monthString = " Months";
  } else {
    monthString = " Month";
  }
  if (dateAge > 1) {
    dayString = " Days";
  } else {
    dayString = " Day";
  }

  return `${yearAge > 0 ? `${yearAge} ${yearString}, ` : ""}${
    monthAge > 0 ? `${monthAge} ${monthString}, ` : ""
  }${dateAge > 0 ? `${dateAge} ${dayString}` : ""}`;
};
