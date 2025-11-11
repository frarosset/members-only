const authValidators = require("./validators/authValidators.js");
const authErrors = require("./errors/authErrors.js");
const asyncHandler = require("express-async-handler");
const db = require("../db/queries.js");
const passport = require("passport");
const setOnNotGetErrorRedirectTo = require("./redirectOnError/setOnNotGetErrorRedirectTo.js");
const { setFlashMessage } = require("../utils/flashMessages.js");
const saveSessionAndRedirect = require("../utils/saveSessionAndRedirect.js");

exports.signup = {};
exports.login = {};
exports.logout = {};
exports.continueAsGuest = {};

exports.signup.get = [
  authErrors.signup,
  (req, res) => {
    res.render("signup");
  },
];

exports.login.get = [
  authErrors.login,
  (req, res) => {
    const flashDialog =
      res.locals.messages?.length > 0
        ? { msg: res.locals.messages[0], closeLabel: "Try again" }
        : null;

    res.render("login", { flashDialog });
  },
];

exports.continueAsGuest.get = (req, res) => {
  if (!req.user) {
    req.session.isGuest = true;
    saveSessionAndRedirect(req, res, "/");
  } else {
    res.redirect("/");
  }
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
      saveSessionAndRedirect(req, res, "/");
    });
  }),
];

exports.login.post = [
  setOnNotGetErrorRedirectTo.login,
  authErrors.login,
  authValidators.login,
  // !!! Fixing session not being saved before redirect when using authentication failure messages with
  //   passport.authenticate("local", {
  //     successRedirect: "/",
  //     failureRedirect: "/login",
  //     failureMessage: true,
  //   }),
  // In express session, it is necessary to call session.save(callback) when setting data on the
  // session and redirecting. Using the following ensures that data are available on the redirected page:
  //  req.session.save((err) => {
  //    if (err) return next(err);
  //    res.redirect('/');
  //  })
  // Source: https://expressjs.com/en/resources/middleware/session.html#sessionsavecallback
  // However, passport.authenticate(), used as above, does not do this and redirects directly
  // Source: https://github.com/jaredhanson/passport/blob/master/lib/middleware/authenticate.js [#da379a0]
  // This is known but not fixed as of now: https://github.com/jaredhanson/passport/issues/703
  // A temporarily fix is providing a callback to passport.authenticate, as done next.
  asyncHandler((req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        req.session.messages = [info.message];
        return saveSessionAndRedirect(req, res, "/login");
      }
      req.login(user, (err) => {
        if (err) return next(err);
        saveSessionAndRedirect(req, res, "/");
      });
    })(req, res, next);
  }),
];

exports.logout.post = [
  setOnNotGetErrorRedirectTo.logout,
  asyncHandler((req, res, next) => {
    req.logout((err) => {
      if (err) {
        // As a post request, this will be redirected to the defined redirect route
        setFlashMessage(req, "flashDialog", {
          title: "Error",
          msg: "Failed to logout.",
        });
        return next(err);
      }
      saveSessionAndRedirect(req, res, "/");
    });
  }),
];
