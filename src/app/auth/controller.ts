import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import config from "../../config";
import ApiError from "../../helpers/ApiError";

const users = {
  admin: "admin",
  editor: "verysecretpassword",
  tester: "123,",
};

export default class AuthController {
  public static authenticate(req: Request, res: Response, next: NextFunction): void {
    const { user, password } = req.body;

    if (users[user] === password) {
      const token = jwt.sign({ user }, config.secret);
      res.cookie("token", token, { expires: new Date(360000 + Date.now()) });
      res.json({ status: "ok" });
    } else {
      next(new ApiError(401, "Invalid user or password"))
    }
  }
}
