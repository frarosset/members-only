const authValidators = require("./validators/authValidators.js");
const asyncHandler = require("express-async-handler");
const db = require("../db/queries.js");
const passport = require("passport");
const CustomUnauthenticatedError = require("../errors/CustomUnauthenticatedError.js");
const CustomConflictError = require("../errors/CustomConflictError.js");

exports.signup = {};
exports.login = {};
exports.logout = {};
exports.continueAsGuest = {};
exports.joinTheClub = {};

exports.signup.get = (req, res) => {
  if (req.user) {
    throw new CustomConflictError(
      "",
      "/views/partials/messages/signupButAlreadyLoggedIn.ejs"
    );
  }

  res.render("signup", { pageTitle: process.env.TITLE });
};

exports.login.get = (req, res) => {
  if (req.user) {
    throw new CustomConflictError(
      "",
      "/views/partials/messages/loginButAlreadyLoggedIn.ejs"
    );
  }

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
  if (!req.user) {
    throw new CustomUnauthenticatedError(
      "",
      "/views/partials/messages/joinTheClubButNotLoggedIn.ejs"
    );
  }

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

const startsWithVowel = (word) => /^[aeiou]/i.test(word);

exports.joinTheClub.post = [
  (req, res, next) => {
    if (!req.user) {
      throw new CustomUnauthenticatedError(
        "",
        "/views/partials/messages/joinTheClubButNotLoggedIn.ejs"
      );
    } else if (req.user.is_member) {
      res.redirect("/join-the-club");
    } else {
      next();
    }
  },
  authValidators.joinTheClub,
  asyncHandler(async (req, res, next) => {
    const id = req.user.id;
    const trait = req.body.trait;
    const noun = req.body.noun;

    // Check validity of membership riddle entered data
    const isValid = await db.read.membershipRiddleCheckValidity(
      id,
      trait,
      noun
    );

    let outcomeStr = "";
    let onCloseRedirectTo = null;

    if (isValid) {
      // Check if another user has already brought this item
      const isNotAlreadyBrought = await db.read.membershipTraitNounAvailability(
        trait,
        noun
      );

      if (isNotAlreadyBrought) {
        db.update.upgradeUserToMember(id, trait, noun);
        outcomeStr = `You’ve got it! You and your ${trait} ${noun} are in. Welcome to the club!`;
        onCloseRedirectTo = "/";
      } else {
        const article = startsWithVowel(trait) ? "an" : "a";
        outcomeStr = `You’re on the right path: you could have entered with ${article} ${trait} ${noun}. However, another member has already brought that. Try once more.`;
      }
    } else {
      const article = startsWithVowel(trait) ? "An" : "A";
      outcomeStr = `${article} ${trait} ${noun}? No, you can't enter with that! Please try again.`;
    }

    // Note: currentUser is automatically passed through res.locals
    // However, its membership is not updated, yet, so you can show a custom message
    res.render("joinTheClub", {
      pageTitle: process.env.TITLE,
      message: outcomeStr,
      onCloseRedirectTo: onCloseRedirectTo,
    });
  }),
];
