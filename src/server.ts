import config from "./config";
import app from "./app";
import { dbConnect } from "./services/mongodb";

const port = config.port;
(async () => {
  await dbConnect();
  app.listen(port, () => {
    console.log(`Server is listening port ${port}`);
  });
})();
