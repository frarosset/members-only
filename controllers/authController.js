const authValidators = require("./validators/authValidators.js");
const asyncHandler = require("express-async-handler");
const db = require("../db/queries.js");
const passport = require("passport");

exports.signup = {};
exports.login = {};
exports.logout = {};
exports.continueAsGuest = {};
exports.joinTheClub = {};

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
  if (!req.user) {
    req.session.isGuest = true;
  }
  res.redirect("/");
};

exports.joinTheClub.get = (req, res) => {
  res.render("joinTheClub", {
    pageTitle: process.env.TITLE,
  });
};

exports.signup.post = [
  (req, res, next) => {
    if (req.user) {
      res.redirect("/signup"); // This shows an invite to logout to the user to proceed
    } else {
      next();
    }
  },
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
  (req, res, next) => {
    if (req.user) {
      res.redirect("/login"); // This shows an invite to logout to the user to proceed
    } else {
      next();
    }
  },
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
