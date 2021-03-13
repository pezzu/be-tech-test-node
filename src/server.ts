import 'dotenv/config';
import express from 'express';
import ApiRouter from './routes';
import config from "./config"

const app = express();

const port = config.port;

app.use(express.json());
app.use('/api', ApiRouter.routes());

app.listen(port, () => {
  console.log(`Server is listening port ${port}`);
})