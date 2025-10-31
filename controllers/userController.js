const userValidator = require("./validators/userValidator.js");
const asyncHandler = require("express-async-handler");
const db = require("../db/queries.js");
const CustomUnauthenticatedError = require("../errors/CustomUnauthenticatedError.js");
const CustomUnauthorizedError = require("../errors/CustomUnauthorizedError.js");
const CustomNotFoundError = require("../errors/CustomNotFoundError.js");
const CustomConflictError = require("../errors/CustomConflictError.js");

exports.user = {};
exports.myProfile = {};
exports.joinTheClub = {};
exports.becomeAdmin = {};

exports.user.get = [
  (req, res, next) => {
    if (!req.user) {
      throw new CustomUnauthenticatedError(
        "",
        "/views/partials/messages/userButNotLoggedIn.ejs"
      );
    } else if (req.user.id === Number(req.params.id)) {
      res.redirect("/my-profile");
    } else if (!req.user.is_member) {
      throw new CustomUnauthorizedError(
        "",
        "/views/partials/messages/userButNotMember.ejs"
      );
    } else {
      next();
    }
  },
  asyncHandler(async (req, res) => {
    const id = req.params.id;

    const user = await db.read.userPublicFromId(id);

    if (!user) {
      throw new CustomNotFoundError("This user does not exist.");
    }

    user.messages = await db.read.allMessagesPerUserId(id, true);

    res.render("user", { pageTitle: process.env.TITLE, user });
  }),
];

exports.myProfile.get = [
  (req, res, next) => {
    if (!req.user) {
      throw new CustomUnauthenticatedError(
        "",
        "/views/partials/messages/myProfileButNotLoggedIn.ejs"
      );
    } else {
      next();
    }
  },
  (req, res) => {
    res.render("myProfile", { pageTitle: process.env.TITLE, user: req.user });
  },
];

exports.joinTheClub.get = (req, res) => {
  if (!req.user) {
    throw new CustomUnauthenticatedError(
      "",
      "/views/partials/messages/joinTheClubButNotLoggedIn.ejs"
    );
  } else if (req.user.is_member) {
    throw new CustomConflictError(
      "",
      "/views/partials/messages/joinTheClubButAlreadyMember.ejs"
    );
  }

  res.render("joinTheClub", {
    pageTitle: process.env.TITLE,
  });
};

exports.becomeAdmin.get = [
  (req, res, next) => {
    if (!req.user) {
      throw new CustomUnauthenticatedError(
        "",
        "/views/partials/messages/becomeAdminButNotLoggedIn.ejs"
      );
    } else if (!req.user.is_member) {
      throw new CustomUnauthorizedError(
        "",
        "/views/partials/messages/becomeAdminButNotMember.ejs"
      );
    } else if (req.user.is_admin) {
      throw new CustomConflictError(
        "",
        "/views/partials/messages/becomeAdminButAlreadyAdmin.ejs"
      );
    } else {
      next();
    }
  },
  (req, res) => {
    res.render("becomeAdmin", { pageTitle: process.env.TITLE, user: req.user });
  },
];

const startsWithVowel = (word) => /^[aeiou]/i.test(word);

exports.joinTheClub.post = [
  (req, res, next) => {
    if (!req.user) {
      throw new CustomUnauthenticatedError(
        "",
        "/views/partials/messages/joinTheClubButNotLoggedIn.ejs"
      );
    } else if (req.user.is_member) {
      throw new CustomConflictError(
        "",
        "/views/partials/messages/joinTheClubButAlreadyMember.ejs"
      );
      // res.redirect("/join-the-club");
    } else {
      next();
    }
  },
  userValidator.joinTheClub,
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
