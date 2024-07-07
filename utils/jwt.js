const jwt = require("jsonwebtoken");
const configuration = require("../config/config");

const generateToken = (payload, config = {}) => {
  return jwt.sign(payload, configuration.jwt_secret, config);
};

const verifyToken = (token) => {
  jwt.verify(token, configuration.jwt_secret, (err, decode) => {
    if (err) {
      return false;
    } else {
      return decode;
    }
  });
};

module.exports = {
  generateToken,
  verifyToken,
};
