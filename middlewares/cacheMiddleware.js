const { getAsync } = require("../services/cacheService");
const { redisLogger } = require("../services/logService");

const cacheMiddleware = async (req, res, next) => {
  let cacheKey = req.originalUrl || req.url;
  cacheKey = cacheKey.replace(/\?.*$/, "");
  try {
    const cacheData = await getAsync(cacheKey);
    if (cacheData) {
      console.log("Cache hit!");
      redisLogger.info("Cache hit!, Data: " + JSON.parse(cacheData));

      res.json(JSON.parse(cacheData));
    } else {
      console.log("Cache miss");
      redisLogger.warn("Cache miss");
      next();
    }
  } catch (err) {
    console.error("redis error: ", err.message);
    redisLogger.error("redis error: ", err.message);
    next();
  }
};

module.exports = cacheMiddleware;
