const messageValidators = require("./validators/messageValidators.js");
const asyncHandler = require("express-async-handler");
const db = require("../db/queries.js");
const CustomUnauthenticatedError = require("../errors/CustomUnauthenticatedError.js");

exports.newMessage = {};
exports.myMessages = {};

exports.newMessage.get = (req, res) => {
  if (!req.user) {
    throw new CustomUnauthenticatedError(
      "",
      "/views/partials/messages/newMessageButNotLoggedIn.ejs"
    );
  }

  res.render("newMessage", { pageTitle: process.env.TITLE });
};

exports.myMessages.get = [
  (req, res, next) => {
    if (!req.user) {
      throw new CustomUnauthenticatedError(
        "",
        "/views/partials/messages/myMessagesButNotLoggedIn.ejs"
      );
    } else {
      next();
    }
  },
  asyncHandler(async (req, res) => {
    req.user.messages = await db.read.allMessagesPerUserId(req.user.id, true);

    res.render("myMessages", {
      pageTitle: process.env.TITLE,
      user: req.user,
    });
  }),
];

exports.newMessage.post = [
  (req, res, next) => {
    if (!req.user) {
      throw new CustomUnauthenticatedError(
        "",
        "/views/partials/messages/newMessageButNotLoggedIn.ejs"
      );
    } else {
      next();
    }
  },
  messageValidators.newMessage,
  asyncHandler(async (req, res) => {
    await db.create.message({ ...req.body, userId: req.user.id });

    res.redirect("/");
  }),
];
