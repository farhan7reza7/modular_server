const config = require("./config");
const Redis = require("ioredis");
const { promisify } = require("util");

// handle caching
const redis = new Redis({
  host:
    config.node_env === "development"
      ? "localhost"
      : "backend-dev.ap-northeast-3.elasticbeanstalk.com",
  port: 6379,
  maxMemory: "100mb",
  maxRetriesPerRequest: null,
  maxMemoryPolicy: "volatile-lru",
});

module.exports = redis;
