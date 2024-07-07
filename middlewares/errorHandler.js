const { logger } = require("../services/logService");

const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    request: {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
    },
  });

  const statusCode = err.statusCode || 500;

  const response = {
    status: "error",
    statusCode,
    message: statusCode === 500 ? "Server internal error" : err.message,
  };

  if (req.app.get("env") === "development") {
    response.stack = err.stack;
    response.request = {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
    };
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
