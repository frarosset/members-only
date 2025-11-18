const messageValidators = require("./validators/messageValidators.js");
const messageErrors = require("./errors/messageErrors.js");
const asyncHandler = require("express-async-handler");
const db = require("../db/queries.js");
const CustomNotFoundError = require("../errors/CustomNotFoundError.js");
const setOnNotGetErrorRedirectTo = require("./redirectOnError/setOnNotGetErrorRedirectTo.js");
const { setFlashMessage } = require("../utils/flashMessages.js");
const saveSessionAndRedirect = require("../utils/saveSessionAndRedirect.js");
const noCache = require("../utils/noCache.js");
const { setLastReadMessageId } = require("../utils/lastReadMessageId.js");

exports.newMessage = {};
exports.myMessages = {};
exports.deleteMessage = {};

exports.newMessage.get = [
  messageErrors.newMessage,
  (req, res) => {
    res.render("newMessage");
  },
];

exports.myMessages.get = [
  messageErrors.myMessages,
  noCache,
  asyncHandler(async (req, res) => {
    req.user.messages = await db.read.allMessagesPerUserId(req.user.id, true);

    // No need to update last read message id if you access the user own messages only

    res.render("myMessages");
  }),
];

exports.newMessage.post = [
  setOnNotGetErrorRedirectTo.newMessage,
  messageErrors.newMessage,
  messageValidators.newMessage,
  asyncHandler(async (req, res) => {
    const id = await db.create.message({ ...req.body, userId: req.user.id });

    if (res.locals.lastReadMessageId == id - 1) {
      await setLastReadMessageId(req, id);
    }

    setFlashMessage(req, "userNewMessageId", id);
    saveSessionAndRedirect(req, res, "/");
  }),
];

exports.deleteMessage.post = [
  setOnNotGetErrorRedirectTo.deleteMessage,
  messageErrors.deleteMessage,
  asyncHandler(async (req, res) => {
    const id = req.params.id;

    const isDeleted = await db.delete.deleteMessageFromId(id);

    if (!isDeleted) {
      setFlashMessage(req, "flashDialog", {
        title: "Error",
        msg: "Cannot delete: this message does not exist or is already deleted",
      });
      throw new CustomNotFoundError("Message not found or already deleted");
    }

    // Note: req.body.referrer is validated/sanitized by setOnNotGetErrorRedirectTo.deleteMessage
    setFlashMessage(req, "flashDialog", {
      msg: "The message was successfully deleted.",
    });
    res.redirect(req.body.referrer ?? "/");
  }),
];
