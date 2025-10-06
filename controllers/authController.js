exports.signup = {};

exports.signup.get = (req, res) => {
  res.render("signup", { pageTitle: process.env.TITLE });
};
