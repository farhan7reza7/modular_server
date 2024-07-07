// resources
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const expressStatusMonitor = require("express-status-monitor");

const config = require("../config/config");
const connectDB = require("../config/db");
const routes = require("../routes/index");
const errorHandler = require("../middlewares/errorHandler");

const rateLimiter = require("../middlewares/rateLimiter");
const { logger, redisLogger } = require("../services/logService");
const redis = require("../config/cacheConfig");
const {
  nonceSetter,
  customizedHelmet,
} = require("../controllers/cspController");

//const User = require("../models/User");

//express app
const app = express();

// set env
app.set("env", config.node_env || "development");
app.set("trust proxy", true);

// connect db
connectDB();

//resis events
redis.on("error", (err) => {
  console.error("Redis error: ", err.message);
  redisLogger.error("Redis error: ", err);
});
redis.on("connect", () => {
  console.log("Connected to Redis server");
  redisLogger.info("Connected to Redis server");
});

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(config.cors));
app.use(nonceSetter);
app.use(customizedHelmet);
app.use(rateLimiter);
// set morgan to use winston logging system
app.use(morgan("combined", { stream: logger.stream }));
app.use(expressStatusMonitor());

//routes
app.use("/", routes);

//error handler
app.use(errorHandler);

async function deleter() {
  await User.deleteMany();
  const data = await User.find();
  console.log("users: ", data);
}
//deleter();

module.exports = app;
