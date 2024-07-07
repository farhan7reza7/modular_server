const express = require("express");
const router = express.Router();

router.use("/", require("./authRoutes"));
router.use("/", require("./taskRoutes"));
router.use("/", require("./cspRoutes"));

module.exports = router;
