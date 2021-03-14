import mongoose from "mongoose";
import config from "../../config";

mongoose.connection.on(
  "error",
  console.error.bind(console, "DB connection error:")
);

export const dbConnect = async (mongoURL = config.mongoURL) => {
  return mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
};
