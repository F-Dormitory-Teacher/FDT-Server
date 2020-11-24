import "dotenv/config";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import routes from "./routes";
import * as path from "path";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(routes);
app.use("/public", express.static(path.join(__dirname, "./public")));

export default app;
