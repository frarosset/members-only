const { body } = require("express-validator");
const db = require("../../db/queries.js");
const handleValidationErrorsFcn = require("./handleValidationErrorsFcn.js");
const msg = require("./validatorsMsg.js");

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

exports.joinTheClub = [
  body("trait")
    .trim()
    .notEmpty()
    .withMessage(msg.notEmpty("trait"))
    .isLength({
      max: Number(process.env.MEMBERSHIP_RIDDLE_MAX_LENGTH),
    })
    .withMessage(
      msg.maxLength("trait", process.env.MEMBERSHIP_RIDDLE_MAX_LENGTH)
    )
    .matches(
      new RegExp(
        process.env.MEMBERSHIP_RIDDLE_REGEX,
        process.env.MEMBERSHIP_RIDDLE_REGEX_FLAG
      )
    )
    .withMessage(process.env.MEMBERSHIP_RIDDLE_REGEX_MSG)
    .custom(async (trait, { req }) => {
      const isTraitAllowed = await db.read.membershipRiddleTraitAllowed(trait);
      if (!isTraitAllowed) {
        throw new Error(
          `Sorry, at the moment we are not allowing things with this trait ('${trait}') in our club.`
        );
      }
      return true;
    }),
  body("noun")
    .trim()
    .notEmpty()
    .withMessage(msg.notEmpty("noun"))
    .isLength({
      max: Number(process.env.MEMBERSHIP_RIDDLE_MAX_LENGTH),
    })
    .withMessage(
      msg.maxLength("noun", process.env.MEMBERSHIP_RIDDLE_MAX_LENGTH)
    )
    .matches(
      new RegExp(
        process.env.MEMBERSHIP_RIDDLE_REGEX,
        process.env.MEMBERSHIP_RIDDLE_REGEX_FLAG
      )
    )
    .withMessage(process.env.MEMBERSHIP_RIDDLE_REGEX_MSG)
    .custom(async (noun, { req }) => {
      const isNounAllowed = await db.read.membershipRiddleNounAllowed(noun);
      if (!isNounAllowed) {
        throw new Error(
          `Sorry, at the moment we are not allowing such things ('${noun}') in our club.`
        );
      }
      return true;
    }),
  ,
  handleValidationErrorsFcn("joinTheClub"),
];
