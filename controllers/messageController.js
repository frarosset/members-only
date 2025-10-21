const messageValidators = require("./validators/messageValidators.js");

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
  (req, res) => {
    res.send("Message posted");
  },
];
