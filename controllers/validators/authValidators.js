const { body } = require("express-validator");
const db = require("../../db/queries.js");
const handleValidationErrorsFcn = require("./handleValidationErrorsFcn.js");

const msg = {
  notEmpty: (field) => `The ${field} cannot be empty.`,
  minMaxLength: (field, min, max) => {
    if (min === max) {
      return `The ${field} must have ${min} ${
        min === 1 ? "character" : "characters"
      }.`;
    } else {
      return `The ${field} must have between ${Math.min(
        min,
        max
      )} and ${Math.max(min, max)} characters.`;
    }
  },
};

exports.signup = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage(msg.notEmpty("username"))
    .isLength({
      min: Number(process.env.USERNAME_MIN_LENGTH),
      max: Number(process.env.USERNAME_MAX_LENGTH),
    })
    .withMessage(
      msg.minMaxLength(
        "username",
        process.env.USERNAME_MIN_LENGTH,
        process.env.USERNAME_MAX_LENGTH
      )
    )
    .matches(
      new RegExp(process.env.USERNAME_REGEX, process.env.USERNAME_REGEX_FLAG)
    )
    .withMessage(process.env.USERNAME_REGEX_MSG)
    .custom(async (username, { req }) => {
      const isUSernameAvailable = await db.read.usernameAvailability(username);
      if (!isUSernameAvailable) {
        throw new Error(`This username is already used.`);
      }
      return true;
    }),
  body("name")
    .trim()
    .notEmpty()
    .withMessage(msg.notEmpty("name"))
    .isLength({
      min: Number(process.env.NAME_SURNAME_MIN_LENGTH),
      max: Number(process.env.NAME_SURNAME_MAX_LENGTH),
    })
    .withMessage(
      msg.minMaxLength(
        "name",
        process.env.NAME_SURNAME_MIN_LENGTH,
        process.env.NAME_SURNAME_MAX_LENGTH
      )
    )
    .matches(
      new RegExp(
        process.env.NAME_SURNAME_REGEX,
        process.env.NAME_SURNAME_REGEX_FLAG
      )
    )
    .withMessage(process.env.NAME_SURNAME_REGEX_MSG),
  body("surname")
    .trim()
    .notEmpty()
    .withMessage(msg.notEmpty("surname"))
    .isLength({
      min: Number(process.env.NAME_SURNAME_MIN_LENGTH),
      max: Number(process.env.NAME_SURNAME_MAX_LENGTH),
    })
    .withMessage(
      msg.minMaxLength(
        "surname",
        process.env.NAME_SURNAME_MIN_LENGTH,
        process.env.NAME_SURNAME_MAX_LENGTH
      )
    )
    .matches(
      new RegExp(
        process.env.NAME_SURNAME_REGEX,
        process.env.NAME_SURNAME_REGEX_FLAG
      )
    )
    .withMessage(process.env.NAME_SURNAME_REGEX_MSG),
  body("password")
    .trim()
    .notEmpty()
    .withMessage(msg.notEmpty("password"))
    .isLength({
      min: Number(process.env.PASSWORD_MIN_LENGTH),
      max: Number(process.env.PASSWORD_MAX_LENGTH),
    })
    .withMessage(
      msg.minMaxLength(
        "password",
        process.env.PASSWORD_MIN_LENGTH,
        process.env.PASSWORD_MAX_LENGTH
      )
    )
    .matches(
      new RegExp(process.env.PASSWORD_REGEX, process.env.PASSWORD_REGEX_FLAG)
    )
    .withMessage(process.env.PASSWORD_REGEX_MSG),
  body("confirm_password")
    .trim()
    .notEmpty()
    .withMessage(msg.notEmpty("confirm password"))
    .custom((confirm_password, { req }) => {
      if (confirm_password !== req.body.password) {
        throw new Error(`The confirm password does not match.`);
      }
      return true;
    }),
  handleValidationErrorsFcn("signup"),
];
