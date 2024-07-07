const { body } = require("express-validator");

const validator = require("../utils/validator");

exports.validateTask = [
  body("content").isString().escape(),
  body("userId").isString().escape(),
  validator,
];
