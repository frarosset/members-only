const { body } = require("express-validator");
const handleValidationErrorsFcn = require("./handleValidationErrorsFcn.js");

const msg = require("./validatorsMsg.js");

const membersOnlyAccess = "members_only";
const accessTypes = new Set(["all", "users_only", membersOnlyAccess]);

exports.newMessage = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage(msg.notEmpty("title"))
    .isLength({
      min: Number(process.env.TITLE_MIN_LENGTH),
      max: Number(process.env.TITLE_MAX_LENGTH),
    })
    .withMessage(
      msg.minMaxLength(
        "title",
        process.env.TITLE_MIN_LENGTH,
        process.env.TITLE_MAX_LENGTH
      )
    )
    .matches(new RegExp(process.env.TITLE_REGEX, process.env.TITLE_REGEX_FLAG))
    .withMessage(process.env.TITLE_REGEX_MSG),
  body("text")
    .trim()
    .notEmpty()
    .withMessage(msg.notEmpty("text"))
    .isLength({
      min: Number(process.env.TEXT_MIN_LENGTH),
      max: Number(process.env.TEXT_MAX_LENGTH),
    })
    .withMessage(
      msg.minMaxLength(
        "text",
        process.env.TEXT_MIN_LENGTH,
        process.env.TEXT_MAX_LENGTH
      )
    )
    .matches(new RegExp(process.env.TEXT_REGEX, process.env.TEXT_REGEX_FLAG))
    .withMessage(process.env.TEXT_REGEX_MSG),
  body("access")
    .trim()
    .notEmpty()
    .withMessage(msg.notEmpty("access type"))
    .custom((access, { req }) => {
      if (!accessTypes.has(access)) {
        throw new Error(`Invalid access type (${access}).`);
      }
      // Members-only access requires membership
      if (access == membersOnlyAccess && !req.user.is_member) {
        throw new Error(
          `You cannot post members only messages because you are not a member, yet.`
        );
      }

      return true;
    }),
  handleValidationErrorsFcn("newMessage", "/new-message"),
];
