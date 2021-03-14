import express from "express";
import helmet from "helmet";
import ApiRouter from "./routes";
import { errorHandler } from "./helpers/errorHandler";

const app = express();

app.use(helmet());
app.use(express.json());
app.use("/api", ApiRouter.routes());
app.use(errorHandler);

export default app;
