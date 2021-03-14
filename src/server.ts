import "dotenv/config";
import express from "express";
import config from "./config";
import ApiRouter from "./routes";
import { dbConnect } from "./services/mongodb";

const app = express();

app.use(express.json());
app.use("/api", ApiRouter.routes());

const port = config.port;

(async () => {
  await dbConnect();
  app.listen(port, () => {
    console.log(`Server is listening port ${port}`);
  });
})();
