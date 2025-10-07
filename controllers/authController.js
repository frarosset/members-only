exports.signup = {};

exports.signup.get = (req, res) => {
  res.render("signup", { pageTitle: process.env.TITLE });
};

exports.signup.post = [
  (req, res) => {
    res.send(JSON.stringify(req.body));
  },
];
