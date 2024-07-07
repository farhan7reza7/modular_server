const config = require("../config/config");

const messageCreator = (text, email) => {
  const messageData = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Text: {
          Data: text,
          Charset: "UTF-8",
        },
      },
      Subject: {
        Data: "Account verification",
        Charset: "UTF-8",
      },
    },
    Source: config.aws.source,
  };
  return messageData;
};

module.exports = messageCreator;
