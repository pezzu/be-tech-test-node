import "dotenv/config";

export default {
  port: process.env.PORT,
  secret: process.env.SECRET,
  mongoURL: process.env.MONGO_URL,
};
