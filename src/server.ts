import "dotenv/config";
import { createConnection } from "typeorm";
import app from "./app";
import logger from "./lib/logger";
import * as http from "http";

createConnection()
  .then((connection) => {
    logger.green("[DB] Connection Success");
  })
  .catch((error) => logger.red("[DB] Connection Error", error.message));

// require("greenlock-express")
//   .init({
//     packageRoot: "/root/blog_server",
//     configDor: "./greenlock.d",
//     cluster: false,
//     maintainerEmail: "1cktmdgh2@gmail.com"
//   })
//   .serve(app);

http.createServer(app).listen(8080, () => {
  logger.green(`[HTTP] server is listening to ${8080}`);
});
