const CustomConflictError = require("../../errors/CustomConflictError.js");

exports.signup = (req, res, next) => {
  if (req.user) {
    throw new CustomConflictError(
      "",
      "/views/partials/messages/signupButAlreadyLoggedIn.ejs"
    );
  } else {
    next();
  }
};

exports.login = (req, res, next) => {
  if (req.user) {
    throw new CustomConflictError(
      "",
      "/views/partials/messages/loginButAlreadyLoggedIn.ejs"
    );
  } else {
    next();
  }
};
