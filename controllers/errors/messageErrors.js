const CustomUnauthenticatedError = require("../../errors/CustomUnauthenticatedError.js");

exports.newMessage = (req, res, next) => {
  if (!req.user) {
    throw new CustomUnauthenticatedError(
      "",
      "/views/partials/messages/newMessageButNotLoggedIn.ejs"
    );
  } else {
    next();
  }
};

exports.myMessages = (req, res, next) => {
  if (!req.user) {
    throw new CustomUnauthenticatedError(
      "",
      "/views/partials/messages/myMessagesButNotLoggedIn.ejs"
    );
  } else {
    next();
  }
};
