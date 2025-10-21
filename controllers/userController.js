const asyncHandler = require("express-async-handler");
const db = require("../db/queries.js");
const CustomUnauthenticatedError = require("../errors/CustomUnauthenticatedError.js");
const CustomUnauthorizedError = require("../errors/CustomUnauthorizedError.js");

exports.user = {};

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
  (req, res) => {
    const id = req.params.id;

    res.send(id);
  },
];
