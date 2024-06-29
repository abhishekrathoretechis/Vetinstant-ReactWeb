import moment from "moment";

export const getDateWithFormat = (date) => {
  const day = date.split("-").shift();
  const month = date.substring(3, 5);
  const year = date.split("-").pop();
  const monStr = moment(new Date(`${month}/${day}/${year}`)).format("MMM");
  return `${monStr} ${day}, ${year}`;
};

export const getTimeDiff = (t2, t1) => {
  const tdiff_in_ms = t2 - t1;
  const tdiff_in_sec = tdiff_in_ms / 1000;
  const tdiff_in_min = tdiff_in_sec / 60;
  const tdiff_in_hours = tdiff_in_min / 60;
  return {
    hh: tdiff_in_hours,
    mm: tdiff_in_min,
  };
};

export const getExpiryTime = (expiryTime) => {
  const currentTime = new Date();
  const expiryTimeInMs = expiryTime.getTime();
  expiryTime.setTime(expiryTimeInMs);
  const tdiff = getTimeDiff(expiryTime.getTime(), currentTime.getTime());
  const expiresIn = {
    hh: Math.floor(tdiff.hh),
    mm: Math.floor(tdiff.mm % 60),
    ss: 0,
  };
  if (expiresIn.mm <= 0) return "Expired";
  return `${expiresIn.hh}h ${expiresIn.mm}m`;
};

export const disableBtn = (date, minutes = 15) => {
  const today = new Date();
  const dbDate = new Date(date);
  if (dbDate.getTime() < today.getTime()) return false;
  if (dbDate.getTime() > today.getTime()) {
    if (
      dbDate.getFullYear() === today.getFullYear() &&
      dbDate.getMonth() === today.getMonth() &&
      dbDate.getDate() === today.getDate()
    ) {
      if (dbDate.getHours() >= today.getHours()) {
        const minDiff = Math.floor(Math.abs(dbDate - today) / 1000 / 60);
        if (minDiff <= minutes) return false;
        return true;
      }
      return true;
    }
    return true;
  }
  return false;
};

export const getDateList = (numberOfDays = 7) => {
  const today = new Date();
  return Array.from({ length: numberOfDays }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date.toISOString().split("T")[0];
  });
};
