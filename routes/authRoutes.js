const express = require("express");
const authController = require("../controllers/authController");
const validator = require("../middlewares/authValidator");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

//login
router.post("/login", validator.validateLogin, authController.login);

//register
router.post("/register", validator.validateRegister, authController.register);

//forget
router.post("/forget", validator.validateForget, authController.forget);

// verify email
router.post(
  "/verify-email",
  validator.validateEmail,
  authController.verifyEmailPost
);

// verify mfa
router.post(
  "/verify-mfa",
  authenticate,
  validator.validateMFA,
  authController.verifyMfaPost
);

router.post(
  "/reset",
  authenticate,
  validator.validateReset,
  authController.reset
);

// current
router.get("/current", authController.current);

router.get("/verify-mfa", authController.verifyMFA);

router.get("/verify-user", authController.verifyUser);

router.get("/verify-email", authController.verifyEmail);

module.exports = router;
