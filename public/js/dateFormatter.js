import dateToStr from "/js/dateToStr.js";

function dateFormatter() {
  const serverNow = new Date(document.body.dataset.now);
  const clientNow = new Date();
  const clientServerSkew = serverNow ? Math.min(clientNow - serverNow, 0) : 0;

  const allDates = document.querySelectorAll(".date");

  allDates.forEach((el) => {
    el.textContent = dateToStr(
      new Date(el.dataset.date),
      null,
      clientServerSkew
    );
  });

  const allSimpleDates = document.querySelectorAll(".simple-date");

  allSimpleDates.forEach((el) => {
    el.textContent = dateToStr(
      new Date(el.dataset.date),
      "simple",
      clientServerSkew
    );
  });
}

dateFormatter();

window.dateFormatter = dateFormatter;
