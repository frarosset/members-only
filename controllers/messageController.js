const messageValidators = require("./validators/messageValidators.js");
const asyncHandler = require("express-async-handler");
const db = require("../db/queries.js");
const CustomUnauthenticatedError = require("../errors/CustomUnauthenticatedError.js");

exports.newMessage = {};

exports.newMessage.get = (req, res) => {
  if (!req.user) {
    throw new CustomUnauthenticatedError(
      "",
      "/views/partials/messages/newMessageButNotLoggedIn.ejs"
    );
  }

  res.render("newMessage", { pageTitle: process.env.TITLE });
};

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
