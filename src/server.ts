import http from "http";
import { createTerminus } from "@godaddy/terminus";
import config from "./config";
import app from "./app";
import { dbConnect, connection } from "./services/mongodb";

const server = http.createServer(app);

const options = {
  signal: "SIGINT",
  healthChecks: {
    "/healthcheck": onHealthCheck,
  },
  onSignal,
};

createTerminus(server, options);

const port = config.port;
(async () => {
  await dbConnect();
  server.listen(port, () => {
    console.log(`Server is listening port ${port}`);
  });
})();

function onSignal() {
  return Promise.all([
    connection.close(false).then(() => {
      console.log("DB disconnected");
    }),
  ]);
}

function onHealthCheck() {
  const { readyState } = connection;

  if (readyState === 0 || readyState === 3) {
    return Promise.reject(new Error("Mongoose has disconnected"));
  }

  if (readyState === 2) {
    return Promise.reject(new Error("Mongoose is connecting"));
  }

  return Promise.resolve();
}
