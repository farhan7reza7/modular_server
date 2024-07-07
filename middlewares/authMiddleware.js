const { verifyToken } = require("../utils/jwt");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: "not autheticated user" });
  }
  const token = authHeader.split(" ")[1];
  if (token) {
    const verified = verifyToken(token);
    if (verified === false) {
      res.status(403).json({
        message: "authentication failed",
      });
    } else {
      req.user = verified;
      next();
    }
  } else {
    res.status(401).json({ message: "not autheticated user" });
  }
};

module.exports = authenticate;
