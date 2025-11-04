const authValidators = require("./validators/authValidators.js");
const authErrors = require("./errors/authErrors.js");
const asyncHandler = require("express-async-handler");
const db = require("../db/queries.js");
const passport = require("passport");
const setOnNotGetErrorRedirectTo = require("./redirectOnError/setOnNotGetErrorRedirectTo.js");
const { setFlashMessage } = require("../utils/flashMessages.js");

exports.signup = {};
exports.login = {};
exports.logout = {};
exports.continueAsGuest = {};

exports.signup.get = [
  authErrors.signup,
  (req, res) => {
    res.render("signup", { pageTitle: process.env.TITLE });
  },
];

exports.login.get = [
  authErrors.login,
  (req, res) => {
    res.render("login", {
      pageTitle: process.env.TITLE,
      message: res.locals.messages?.[0],
    });
  },
];

exports.continueAsGuest.get = (req, res) => {
  if (!req.user) {
    req.session.isGuest = true;
  }
  res.redirect("/");
};

exports.signup.post = [
  setOnNotGetErrorRedirectTo.signup,
  authErrors.signup,
  authValidators.signup,
  asyncHandler(async (req, res, next) => {
    const id = await db.create.user(req.body);

    req.login({ id }, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  }),
];

exports.login.post = [
  setOnNotGetErrorRedirectTo.login,
  authErrors.login,
  authValidators.login,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true,
  }),
];

exports.logout.post = [
  setOnNotGetErrorRedirectTo.logout,
  (req, res, next) => {
    req.logout((err) => {
      if (err) {
        // As a post request, this will be redirected to the defined redirect route
        setFlashMessage(req, "flashDialog", {
          title: "Error",
          msg: "Failed to logout.",
        });
        return next(err);
      }
      res.redirect("/");
    });
  },
];
