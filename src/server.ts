import "dotenv/config";
import express from "express";
import ApiRouter from "./routes";
import config from "./config";

const app = express();

app.use(express.json());
app.use("/api", ApiRouter.routes());

const port = config.port;

app.listen(port, () => {
  console.log(`Server is listening port ${port}`);
});
