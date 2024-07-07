const express = require("express");
const cspController = require("../controllers/cspController");
const validator = require("../middlewares/cspValidator");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/report-csp-violation",
  /*  authenticate,*/
  cspController.cspType,
  validator.validateCspReport,
  cspController.report
);

router.get("/vio", cspController.vio);

module.exports = router;
