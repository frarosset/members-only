const authValidators = require("./validators/authValidators.js");
const asyncHandler = require("express-async-handler");
const db = require("../db/queries.js");

exports.signup = {};

exports.signup.get = (req, res) => {
  res.render("signup", { pageTitle: process.env.TITLE });
};

exports.signup.post = [
  authValidators.signup,
  asyncHandler(async (req, res) => {
    const id = await db.create.user(req.body);

    res.send(id + JSON.stringify(req.body));
  }),
];
