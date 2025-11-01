const CustomUnauthenticatedError = require("../../errors/CustomUnauthenticatedError.js");
const CustomUnauthorizedError = require("../../errors/CustomUnauthorizedError.js");
const CustomConflictError = require("../../errors/CustomConflictError.js");

exports.user = (req, res, next) => {
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
};

exports.myProfile = (req, res, next) => {
  if (!req.user) {
    throw new CustomUnauthenticatedError(
      "",
      "/views/partials/messages/myProfileButNotLoggedIn.ejs"
    );
  } else {
    next();
  }
};

exports.joinTheClub = (req, res, next) => {
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
  } else {
    next();
  }
};

exports.becomeAdmin = (req, res, next) => {
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
};
