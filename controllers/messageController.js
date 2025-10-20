exports.newMessage = {};

exports.newMessage.get = (req, res) => {
  res.render("newMessage", { pageTitle: process.env.TITLE });
};
