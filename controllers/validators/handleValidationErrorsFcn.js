const { validationResult, matchedData } = require("express-validator");
const CustomBadReqestError = require("../../errors/CustomBadReqestError.js");
const { setFlashMessage } = require("../../utils/flashMessages.js");

const handleValidationErrorsFcn =
  (ejsTemplate, nonGetRedirectTo, params = {}) =>
  (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      // return res.status(400).send(result.errors);
      const errors = result.errors.map((itm) => ({
        msg: itm.msg,
        name: itm.path.split("[")[0],
        path: itm.path,
      }));

      const data = matchedData(req, {
        onlyValidData: false,
        includeOptionals: true,
      });

      const validationErrors = {
        orderedMsgNames: orderedErrorsNames(errors),
        groupedMsg: groupedErrors(errors),
      };

      // Throw error and redirect in case of non-GET requests
      if (res.method !== "GET") {
        setFlashMessage(req, "validationErrors", validationErrors);

        setFlashMessage(req, "data", data);

        // set the redirect to url for this error
        res.locals.onNotGetErrorRedirectTo = nonGetRedirectTo;

        throw new CustomBadReqestError(
          "Validation errors detected in the submitted form"
        );
      } else {
        return res.status(400).render(ejsTemplate, {
          pageTitle: process.env.TITLE,
          validationErrors,
          data,
          ...params,
        });
      }
    }
    // no errors
    next();
  };

const groupedErrors = (arr) =>
  arr.reduce((acc, { name, msg }) => {
    if (!acc[name]) {
      acc[name] = [msg];
    } else {
      acc[name].push(msg);
    }
    return acc;
  }, {});

const orderedErrorsNames = (arr) =>
  arr.reduce((acc, { name }) => {
    if (!acc.includes(name)) {
      acc.push(name);
    }
    return acc;
  }, []);

module.exports = handleValidationErrorsFcn;
