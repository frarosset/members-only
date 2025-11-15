const userValidator = require("./validators/userValidator.js");
const userErrors = require("./errors/userErrors.js");
const asyncHandler = require("express-async-handler");
const db = require("../db/queries.js");
const CustomNotFoundError = require("../errors/CustomNotFoundError.js");
const setOnNotGetErrorRedirectTo = require("./redirectOnError/setOnNotGetErrorRedirectTo.js");
const { setFlashMessage } = require("../utils/flashMessages.js");
const saveSessionAndRedirect = require("../utils/saveSessionAndRedirect.js");

exports.user = {};
exports.myProfile = {};
exports.joinTheClub = {};
exports.becomeAdmin = {};

exports.user.get = [
  userErrors.user,
  asyncHandler(async (req, res) => {
    const id = req.params.id;

    const user = await db.read.userPublicFromId(id);

    if (!user) {
      throw new CustomNotFoundError("This user does not exist.");
    }

    user.messages = await db.read.allMessagesPerUserId(id, true);

    // Don't update last read message id if you access an  user message: there might be other unread users messages

    res.render("user", { user });
  }),
];

exports.myProfile.get = [
  userErrors.myProfile,
  (req, res) => {
    res.render("myProfile");
  },
];

exports.joinTheClub.get = [
  userErrors.joinTheClub,
  (req, res) => {
    res.render("joinTheClub");
  },
];

exports.becomeAdmin.get = [
  userErrors.becomeAdmin,
  (req, res) => {
    res.render("becomeAdmin");
  },
];

const startsWithVowel = (word) => /^[aeiou]/i.test(word);

exports.joinTheClub.post = [
  setOnNotGetErrorRedirectTo.joinTheClub,
  userErrors.joinTheClub,
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

    let success;
    let outcomeStr = "";

    if (isValid) {
      // Check if another user has already brought this item
      const isNotAlreadyBrought = await db.read.membershipTraitNounAvailability(
        trait,
        noun
      );

      if (isNotAlreadyBrought) {
        success = await db.update.upgradeUserToMember(id, trait, noun);

        if (!success) {
          throw new Error(`Cannot upgrade user with id ${id} to member`);
        }

        outcomeStr = `You’ve got it! You and your ${trait} ${noun} are in. Welcome to the club!`;
      } else {
        const article = startsWithVowel(trait) ? "an" : "a";
        outcomeStr = `You’re on the right path: you could have entered with ${article} ${trait} ${noun}. However, another member has already brought that. Try once more.`;
      }
    } else {
      const article = startsWithVowel(trait) ? "An" : "A";
      outcomeStr = `${article} ${trait} ${noun}? No, you can't enter with that! Please try again.`;
    }

    const redirectTo = success ? "/" : "/join-the-club";
    const closeLabel = success ? "Continue" : "Try again";

    setFlashMessage(req, "flashDialog", {
      msg: outcomeStr,
      closeLabel,
    });

    saveSessionAndRedirect(req, res, redirectTo);
  }),
];

exports.becomeAdmin.post = [
  setOnNotGetErrorRedirectTo.becomeAdmin,
  userErrors.becomeAdmin,
  userValidator.becomeAdmin,
  asyncHandler(async (req, res, next) => {
    const id = req.user.id;

    // Check validity of admin password
    const isValid = req.body.password === process.env.ADMIN_PASSWORD;

    let success = false;
    let outcomeStr = "";

    if (isValid) {
      success = await db.update.upgradeUserToAdmin(id);

      if (!success) {
        throw new Error(`Cannot upgrade user with id ${id} to admin`);
      }

      outcomeStr = `Congratulations! You're an admin now!`;
    } else {
      outcomeStr = `Incorrect admin password! Please try again.`;
    }

    const redirectTo = success ? "/" : "/become-admin";
    const closeLabel = success ? "Continue" : "Try again";

    setFlashMessage(req, "flashDialog", {
      msg: outcomeStr,
      closeLabel,
    });

    saveSessionAndRedirect(req, res, redirectTo);
  }),
];
