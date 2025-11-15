const db = require("../db/queries.js");

const lastMessageId = (allMessages) =>
  allMessages.reduce((last, msg) => (msg.id > last ? msg.id : last), 0);

const setLastReadMessageId = async (req, lastMsgId) => {
  if (req.user) {
    const newLastMsgId = await db.update.upgradeUserLastReadMessageId(
      req.user.id,
      lastMsgId
    );
    if (newLastMsgId != null) {
      req.user["last_read_message_id"] = newLastMsgId;
    }
  } else {
    const current = req.session.lastReadMessageId ?? 0;
    if (current < lastMsgId) {
      req.session.lastReadMessageId = lastMsgId;
    }
  }
};

const setTempLastReadMessageId = (req, lastMsgId) => {
  const current = getLastReadMessageId(req);

  if (current < lastMsgId) {
    req.session.tempLastReadMessageId = lastMsgId;
  }
};

const updateLastReadMessageIdFromTemp = async (req) => {
  const tempLastReadMessageId = req.session.tempLastReadMessageId;
  if (tempLastReadMessageId != null) {
    await setLastReadMessageId(req, tempLastReadMessageId);
    req.session.tempLastReadMessageId = null;
  }
};

const updateLastReadMessageId = async (req, allMessages) => {
  const lastMsgId = lastMessageId(allMessages);
  await setLastReadMessageId(req, lastMsgId);
};

const updateTempLastReadMessageId = (req, allMessages) => {
  const lastMsgId = lastMessageId(allMessages);
  setTempLastReadMessageId(req, lastMsgId);
};

const getLastReadMessageId = (req) =>
  req.user?.["last_read_message_id"] ?? req.session.lastReadMessageId ?? 0;

module.exports = {
  updateLastReadMessageId,
  getLastReadMessageId,
  updateTempLastReadMessageId,
  updateLastReadMessageIdFromTemp,
};
