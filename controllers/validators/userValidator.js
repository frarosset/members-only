const { body } = require("express-validator");
const db = require("../../db/queries.js");
const handleValidationErrorsFcn = require("./handleValidationErrorsFcn.js");
const msg = require("./validatorsMsg.js");

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

exports.becomeAdmin = [
  body("password")
    .trim()
    .notEmpty()
    .withMessage(msg.notEmpty("admin password")),
  handleValidationErrorsFcn("becomeAdmin"),
];
