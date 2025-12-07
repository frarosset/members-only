const notifier = require("../events/notifier.js");
const getCookie = require("../utils/getCookie.js");

exports.dbUpdated = (req) =>
  notifier.emit("dbUpdated", getCookie(req, "connect.sid"));
