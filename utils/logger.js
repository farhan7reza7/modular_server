const winston = require("winston");
const morgan = require("morgan");
const app = require("../src/app");
const config = require("../config/config");

// centralized logging and monitoring
// config winston
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  level: "info",
  transports: [
    new winston.transports.File({
      filename: "error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "combined.log",
      level: "info",
    }),
  ],
});

if (config.node_env === "development") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

logger.stream = {
  write: function (message) {
    // Use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message.trim());
  },
};

const redisLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  level: "info",
  transports: new winston.transports.File({
    filename: "redis.log",
    level: "info",
  }),
});

// set morgan to use winston logging system
app.use(morgan("combined", { stream: logger.stream }));

module.exports = { logger, redisLogger };
