const CustomUnauthenticatedError = require("../../errors/CustomUnauthenticatedError.js");
const CustomUnauthorizedError = require("../../errors/CustomUnauthorizedError.js");
const asyncHandler = require("express-async-handler");
const db = require("../../db/queries.js");
const { setFlashMessage } = require("../../utils/flashMessages.js");

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
    // As a post request, this will be redirected to the defined redirect route
    setFlashMessage(req, "flashDialog", {
      title: "Error",
      msg: "You must be logged in and authorized to delete messages",
    });
    throw new CustomUnauthenticatedError(
      `A guest is trying to delete message with is ${req.params.id}`
    );
  } else if (req.user.is_admin) {
    // admins can proceed
    next();
  } else {
    const messageId = req.params.id;
    const currentUserId = req.user.id;

    const allowed = await db.read.userWroteMessage(messageId, currentUserId);

    if (!allowed) {
      setFlashMessage(req, "flashDialog", {
        title: "Error",
        msg: "You are not authorized to delete this message.",
      });
      throw new CustomUnauthorizedError(
        `Non-authorized user with id ${req.user.id} is trying to delete message with id ${req.params.id}`
      );
    } else {
      // the author can proceed
      next();
    }
  }
});
