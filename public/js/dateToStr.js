const locale = "en-gb";

const timeOptions = {
  hour: "numeric",
  minute: "numeric",
};
const pastWeekDateOptions = {
  weekday: "long",
  ...timeOptions,
};
const pastYearDateOptions = {
  month: "long",
  day: "numeric",
  ...timeOptions,
};
const previousYearDateOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  ...timeOptions,
};

const simpleDateOptions = {
  year: "2-digit",
  month: "numeric",
  day: "numeric",
  ...timeOptions,
};

function dateToStr(date = new Date(), variant = null, skewMs = 0) {
  let msAgo = getMsAgo(date) - skewMs;

  if (variant === "simple")
    return date.toLocaleDateString(locale, simpleDateOptions);

  if (msAgo < 0) {
    console.log(
      `Future times not implemented yet! The date is ${-msAgo} ms in the future and formatted in simple format`
    );
    return date.toLocaleDateString(locale, simpleDateOptions) + "*";
  }

  if (isWithin(msAgo, "minute")) {
    return "Just now";
  } else if (isWithin(msAgo, "hour")) {
    const minutesAgo = Math.round(msAgo / 1000 / 60);
    return `${
      minutesAgo === 1
        ? "1 minute"
        : minutesAgo === 60
        ? "1 hour"
        : `${minutesAgo} minutes`
    } ago`;
  } else if (isToday(date)) {
    return date.toLocaleTimeString(locale, timeOptions);
  } else if (isYesterday(date)) {
    return `Yesterday, ${date.toLocaleTimeString(locale, timeOptions)}`;
  } else if (isWithin(msAgo, "week") && !isAWeekAgo(date)) {
    return date.toLocaleDateString(locale, pastWeekDateOptions);
  } else if (isWithin(msAgo, "year") && !isAYearAgo(date)) {
    return date.toLocaleDateString(locale, pastYearDateOptions);
  } else {
    return date.toLocaleDateString(locale, previousYearDateOptions);
  }
}

const msIn = {
  second: 1000,
  minute: 1000 * 60,
  hour: 1000 * 60 * 60,
  day: 1000 * 60 * 60 * 24,
  week: 1000 * 60 * 60 * 24 * 7,
  year: 1000 * 60 * 60 * 24 * 365,
};

function diffInMs(date1, date2) {
  return date2.getTime() - date1.getTime();
}

function getMsAgo(date) {
  return diffInMs(date, new Date());
}

function isWithin(ms, withinStr) {
  // withinStr: properties of msIn
  return ms < msIn[withinStr];
}

function isToday(date) {
  const today = new Date();
  return today.toDateString() === date.toDateString();
}

function isYesterday(date) {
  const yesterday = new Date(new Date() - msIn.day);
  return yesterday.toDateString() === date.toDateString();
}

function isAWeekAgo(date) {
  const aWeekAgo = new Date(new Date() - msIn.week);
  return aWeekAgo.toDateString() === date.toDateString();
}

function isAYearAgo(date) {
  const aWeekAgo = new Date(new Date() - msIn.year);
  return aWeekAgo.toDateString() === date.toDateString();
}

export default dateToStr;
