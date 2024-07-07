require("dotenv").config();

module.exports = {
  port: process.env.PORT,
  node_env: process.env.NODE_ENV,
  db: {
    uri: process.env.DATABASE_STRING,
  },
  jwt_secret: process.env.JWT_SECRET,
  aws: {
    awsRegion: process.env.SES_REGION,
    awsId: process.env.SES_ACCESS_ID,
    awsSecret: process.env.SES_SECRET,
    source: process.env.SOURCE,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  cors: {
    origin: [
      "https://social.d2b65wp3mxn1jy.amplifyapp.com/",
      "https://main.d2b65wp3mxn1jy.amplifyapp.com/",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    methods: ["PUT", "DELETE", "GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
};
