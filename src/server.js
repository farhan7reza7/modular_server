const app = require("./app");
const config = require("../config/config");

const port = config.port || 8080;

app.listen(port, () => {
  console.log("Server listening on port: ", port);
});
