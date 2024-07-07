const config = require("../config/config");

const cspConfig = (req, res) => {
  return {
    directives: {
      defaultSrc: [`'self'`],
      scriptSrc: [
        `'self'`,
        "https://cdnjs.cloudflare.com",
        config.node_env === "development"
          ? `'unsafe-inline'`
          : `'nonce-${res.locals.nonce}'`,
      ],
      styleSrc: [
        `'self'`,
        "https://cdnjs.cloudflare.com",
        config.node_env === "development"
          ? `'unsafe-inline'`
          : `'nonce-${res.locals.nonce}'`,
      ],
      imgSrc: [`'self'`, "data:"],
      fontSrc: [`'self'`],
      connectSrc: [
        `'self'`,
        "http://localhost:3000",
        "http://localhost:3001",
        "https://social.d2b65wp3mxn1jy.amplifyapp.com/",
        "https://main.d2b65wp3mxn1jy.amplifyapp.com/",
      ],
      baseUri: [`'self'`],
      mediaSrc: [`'self'`],
      frameSrc: [`'self'`],
      objectSrc: [`'none'`],
      frameAncestors: [`'none'`],
      formAction: [`'self'`],
      reportUri: ["/report-csp-violation"],
      upgradeInsecureRequests: [],
    },
    reportOnly: false,
    browserSniff: false,
    disableAndroid: false,
  };
};

module.exports = cspConfig;
