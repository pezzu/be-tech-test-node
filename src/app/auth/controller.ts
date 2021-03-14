import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../config";
import ApiError from "../../helpers/ApiError";
import User from "./model"

export default class AuthController {
  public static authenticate(req: Request, res: Response, next: NextFunction): void {
    const { name, password } = req.body;

    const user = User.findOne(name);
    if (user.password === password) {
      const token = jwt.sign({ user: name }, config.secret);
      res.cookie("token", token, { expires: new Date(360000 + Date.now()) });
      res.json({ token });
    } else {
      next(new ApiError(httpStatus.UNAUTHORIZED, "Invalid user or password"))
    }
  }
}
