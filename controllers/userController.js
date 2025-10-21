const asyncHandler = require("express-async-handler");
const db = require("../db/queries.js");
const CustomUnauthenticatedError = require("../errors/CustomUnauthenticatedError.js");
const CustomUnauthorizedError = require("../errors/CustomUnauthorizedError.js");
const CustomNotFoundError = require("../errors/CustomNotFoundError.js");

exports.user = {};
exports.myProfile = {};

exports.user.get = [
  (req, res, next) => {
    if (!req.user) {
      throw new CustomUnauthenticatedError(
        "",
        "/views/partials/messages/userButNotLoggedIn.ejs"
      );
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
      throw new CustomNotFoundError("This user does not exists.");
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
