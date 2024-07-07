const { SESClient } = require("@aws-sdk/client-ses");
const config = require("./config");

module.exports = new SESClient({
  region: config.aws.awsRegion,
  credentials: {
    accessKeyId: config.aws.awsId,
    secretAccessKey: config.aws.awsSecret,
  },
});
