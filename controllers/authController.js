const authValidators = require("./validators/authValidators.js");

exports.signup = {};

exports.signup.get = (req, res) => {
  res.render("signup", { pageTitle: process.env.TITLE });
};

exports.signup.post = [
  authValidators.signup,
  (req, res) => {
    res.send(JSON.stringify(req.body));
  },
];
