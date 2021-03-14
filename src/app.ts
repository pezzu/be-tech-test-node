import express from "express";
import ApiRouter from "./routes";

const app = express();

app.use(express.json());
app.use("/api", ApiRouter.routes());

export default app;