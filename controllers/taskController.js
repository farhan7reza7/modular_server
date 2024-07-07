const Task = require("../models/Task");
const User = require("../models/User");
const { setAsync, delAsync } = require("../services/cacheService");
const { redisLogger } = require("../services/logService");

exports.task = async (req, res, next) => {
  const { content, userId } = req.body;
  let cacheKey = req.originalUrl || req.url;
  redisLogger.info("original url: " + cacheKey);

  cacheKey = cacheKey.replace(/\/task/, "/tasks");
  redisLogger.info("changed url: " + cacheKey);

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "user not found" });
    }
    const task = await Task({ content, user: user._id });
    await task.save();
    user.tasks.push(task._id);
    await user.save();
    await delAsync(cacheKey);
    redisLogger.info("deleted key: " + cacheKey);
    res.json({ message: "added successfully and cache invalidated" });
  } catch (error) {
    next(error);
  }
};

exports.tasks = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const user = await User.findById(userId).populate("tasks");
    let cacheKey = req.originalUrl || req.url;
    cacheKey = cacheKey.replace(/\?.*$/, "");
    await setAsync(cacheKey, JSON.stringify({ tasks: user.tasks }), "EX", 3600);
    redisLogger.info("set key: " + cacheKey);
    if (!user) {
      res.status(404).json({ message: "user not found" });
    } else {
      res.status(200).json({ tasks: user.tasks });
    }
  } catch (error) {
    console.error("\n\n\n\ntry not work in tasks: ", error.message, "\n\n\n\n");
    next(error);
  }
};
