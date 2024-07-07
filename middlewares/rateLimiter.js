const expressRateLimit = require("express-rate-limit");

module.exports = expressRateLimit({
  windowMs: 45 * 1000 * 60,
  max: 200,
  message: "Too many requests from this IP, please try again later.",
  headers: true,
  keyGenerator: (req) => req.ip,
});
