import express from "express";
import helmet from "helmet";
import ApiRouter from "./routes";

const app = express();

app.use(helmet());
app.use(express.json());
app.use("/api", ApiRouter.routes());

export default app;