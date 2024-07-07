const {
  SendEmailCommand,
  VerifyEmailIdentityCommand,
} = require("@aws-sdk/client-ses");

const sesClient = require("../config/emailConfig");

module.exports = {
  SendEmailCommand,
  VerifyEmailIdentityCommand,
  sesClient,
};
