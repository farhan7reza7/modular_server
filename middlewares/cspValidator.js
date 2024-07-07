const { body, validationResult } = require("express-validator");

const validator = require("../utils/validator");

exports.validateCspReport = [
  body("csp-report").isObject(),
  body("csp-report.document-url").escape(),
  body("csp-report.violated-directive").isString().escape(),
  body("csp-report.effective-directive").isString().escape(),
  body("csp-report.blocked-uri").isString().escape(),
  body("csp-report.original-policy").isString().escape(),
  validator,
];
