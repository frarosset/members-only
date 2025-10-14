const authValidators = require("./validators/authValidators.js");
const asyncHandler = require("express-async-handler");
const db = require("../db/queries.js");
const passport = require("passport");

exports.signup = {};
exports.login = {};
exports.logout = {};
exports.continueAsGuest = {};

exports.signup.get = (req, res) => {
  res.render("signup", { pageTitle: process.env.TITLE });
};

exports.login.get = (req, res) => {
  res.render("login", {
    pageTitle: process.env.TITLE,
    message: res.locals.messages?.[0],
  });
};

exports.continueAsGuest.get = (req, res) => {
  req.session.isGuest = true;
  res.redirect("/");
};

exports.signup.post = [
  authValidators.signup,
  asyncHandler(async (req, res) => {
    const id = await db.create.user(req.body);

    res.send(id + JSON.stringify(req.body));
  }),
];

exports.login.post = [
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true,
  }),
];

exports.logout.post = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
