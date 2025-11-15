const asyncHandler = require("express-async-handler");
const db = require("../db/queries.js");
const {
  updateLastReadMessageId,
  updateTempLastReadMessageId,
} = require("../utils/lastReadMessageId.js");
const noCache = require("../utils/noCache.js");

exports.get = [
  (req, res, next) => {
    if (!req.session.isGuest && !req.user) {
      res.render("index");
      return;
    }

    next();
  },
  noCache,
  asyncHandler(async (req, res) => {
    const isMember = req?.user?.is_member != null;
    const allMessages = await db.read.allMessages(isMember);

    // If the request is triggered by websocket, just update a temporary
    // lastReadMessageId (saved in the session), instead of the actual one
    // for the user.
    if (!res.locals.wsRefresh) {
      await updateLastReadMessageId(req, allMessages);
    } else {
      await updateTempLastReadMessageId(req, allMessages);
    }

    res.render("index", {
      messagesArray: allMessages,
    });
  }),
];
