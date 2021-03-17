import mongoose from "mongoose";
import config from "../../config";

mongoose.connection.on(
  "error",
  console.error.bind(console, "DB connection error:")
);

export const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

export const dbConnect = async (mongoURL = config.mongoURL) => {
  return mongoose.connect(mongoURL, options);
};

export const connection = mongoose.connection;
