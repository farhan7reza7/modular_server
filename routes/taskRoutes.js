const express = require("express");
const taskController = require("../controllers/taskController");
const validator = require("../middlewares/taskValidator");
const authenticate = require("../middlewares/authMiddleware");
const cacheMiddleware = require("../middlewares/cacheMiddleware");

const router = express.Router();

router.post("/task", authenticate, validator.validateTask, taskController.task);

router.get("/tasks", authenticate, cacheMiddleware, taskController.tasks);

module.exports = router;
