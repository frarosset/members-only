const CustomUnauthenticatedError = require("../../errors/CustomUnauthenticatedError.js");
const CustomNotFoundError = require("../../errors/CustomNotFoundError.js");
const asyncHandler = require("express-async-handler");
const db = require("../../db/queries.js");

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

exports.deleteMessage = asyncHandler(async (req, res, next) => {
  // Completely hide the existance of the page for non-authorized users
  if (!req.user) {
    throw new CustomNotFoundError("Page not found");
  } else if (req.user.is_admin) {
    // admins can proceed
    next();
  } else {
    const messageId = req.params.id;
    const currentUserId = req.user.id;

    const allowed = await db.read.userWroteMessage(messageId, currentUserId);

    if (!allowed) {
      throw new CustomNotFoundError("Page not found");
    } else {
      // the author can proceed
      next();
    }
  }
});
