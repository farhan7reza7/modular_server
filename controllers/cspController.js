const express = require("express");
const { cspLogger } = require("../services/logService");
const config = require("../config/config");
const cspConfig = require("../utils/csp");
const helmet = require("helmet");
const crypto = require("crypto");

exports.report = (req, res) => {
  const report = req.body["csp-report"];

  cspLogger.warn("CSP violation", {
    "document-uri": report["document-uri"],
    "violated-directive": report["violated-directive"],
    "original-policy": report["original-policy"],
    "blocked-uri": report["blocked-uri"] || "N/A",
    userAgent: req.get("User-Agent"),
    ip: req.ip,
  });

  cspLogger.info("CSP Violation: ", report);
  console.log("CSP Violation: ", report);

  res.status(204).end();
};

exports.vio = (req, res) => {
  const scriptEl = `<script nonce='${res.locals.nonce}'>alert("Hello, world!")</script>`;
  res.send(`
      <html>
        <head>
          <title>CSP Example</title>
        </head>
        <body>
          <p>Listen</p>
          <audio src="https://github.com/farhan7reza7/farhan7reza7-3/blob/main/audio.mp3">Listener</audio>
          <h1>o, w...!</h1>
          ${scriptEl}
        </body>
      </html>
    `);
};

exports.cspType = express.json({
  type: "application/csp-report",
  limit: "1mb",
});

exports.nonceSetter = (req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString("base64");
  next();
};

exports.customizedHelmet = (req, res, next) => {
  const configuration = cspConfig(req, res);
  if (config.node_env === "production") {
    delete config.directives.upgradeInsecureRequests;
    config.reportOnly = true;
  }
  helmet.contentSecurityPolicy(configuration)(req, res, next);
};
