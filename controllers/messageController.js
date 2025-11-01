const messageValidators = require("./validators/messageValidators.js");
const messageErrors = require("./errors/messageErrors.js");
const asyncHandler = require("express-async-handler");
const db = require("../db/queries.js");

exports.newMessage = {};
exports.myMessages = {};

exports.newMessage.get = [
  messageErrors.newMessage,
  (req, res) => {
    res.render("newMessage", { pageTitle: process.env.TITLE });
  },
];

exports.myMessages.get = [
  messageErrors.myMessages,
  asyncHandler(async (req, res) => {
    req.user.messages = await db.read.allMessagesPerUserId(req.user.id, true);

    res.render("myMessages", {
      pageTitle: process.env.TITLE,
      user: req.user,
    });
  }),
];

exports.newMessage.post = [
  messageErrors.newMessage,
  messageValidators.newMessage,
  asyncHandler(async (req, res) => {
    await db.create.message({ ...req.body, userId: req.user.id });

    res.redirect("/");
  }),
];
