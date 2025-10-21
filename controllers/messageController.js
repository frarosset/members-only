const messageValidators = require("./validators/messageValidators.js");
const asyncHandler = require("express-async-handler");
const db = require("../db/queries.js");

exports.newMessage = {};

exports.newMessage.get = (req, res) => {
  res.render("newMessage", { pageTitle: process.env.TITLE });
};

exports.newMessage.post = [
  (req, res, next) => {
    if (!req.user) {
      res.redirect("/new-message");
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
