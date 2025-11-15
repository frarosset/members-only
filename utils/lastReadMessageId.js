const db = require("../db/queries.js");

const updateLastReadMessageId = async (req, allMessages) => {
  const lastMsgId = allMessages.reduce(
    (last, msg) => (msg.id > last ? msg.id : last),
    0
  );
  if (req.user) {
    await db.update.upgradeUserLastReadMessageId(req.user.id, lastMsgId);
  } else {
    const current = req.session.lastReadMessageId ?? 0;
    if (current < lastMsgId) {
      req.session.lastReadMessageId = lastMsgId;
    }
  }
};

const getLastReadMessageId = (req) =>
  req.user?.["last_read_message_id"] ?? req.session.lastReadMessageId ?? 0;

module.exports = { updateLastReadMessageId, getLastReadMessageId };
