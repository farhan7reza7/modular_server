const { body } = require("express-validator");

const validator = require("../utils/validator");

exports.validateLogin = [
  body("username").isString().trim().escape(),
  body("password").isString().trim().escape(),
  validator,
];

exports.validateRegister = [
  body("username").isString().trim().escape(),
  body("email").isEmail().normalizeEmail(),
  body("password").isString().trim().escape(),
  validator,
];

exports.validateForget = [
  body("email").isEmail().normalizeEmail(),
  body("username").isString().trim().escape(),
  validator,
];

exports.validateEmail = [body("email").isEmail().normalizeEmail(), validator];

exports.validateMFA = [
  body("username").isString().trim().escape(),
  body("email").isEmail().normalizeEmail(),
  body("password").isString().trim().escape(),
  body("token").isString().trim().escape(),
  body("otp").isString().escape(),
  validator,
];

exports.validateReset = [
  body("userId").isString().trim().escape(),
  body("password").isString().trim().escape(),
  validator,
];
