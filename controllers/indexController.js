const asyncHandler = require("express-async-handler");
const db = require("../db/queries.js");

exports.get = [
  (req, res, next) => {
    if (!req.session.isGuest && !req.user) {
      res.render("index");
      return;
    }

    next();
  },
  asyncHandler(async (req, res) => {
    const isMember = req?.user?.is_member != null;
    const allMessages = await db.read.allMessages(isMember);

    res.render("index", {
      messagesArray: allMessages,
    });
  }),
];
