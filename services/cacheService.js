const redis = require("../config/cacheConfig");
const { promisify } = require("util");

const getAsync = promisify(redis.get).bind(redis);
const setAsync = promisify(redis.set).bind(redis);
const delAsync = promisify(redis.del).bind(redis);

module.exports = { getAsync, setAsync, delAsync };
