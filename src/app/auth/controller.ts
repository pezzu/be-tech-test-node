import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../config";
import ApiError from "../../helpers/ApiError";
import { User } from "./model/user";

export default class AuthController {
  private static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { name, password } = req.body;

    const user = await User.findOne({ name }).exec();
    if (user && user.password === password) {
      const token = jwt.sign({ user: name }, config.secret);
      res.cookie("token", token, { expires: new Date(360000 + Date.now()) });
      res.json({ token });
    } else {
      next(new ApiError(httpStatus.UNAUTHORIZED, "Invalid user or password"));
    }
  }

  public static async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
    return AuthController.login(req, res, next);
  }

  public static async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, password, role } = req.body;
      await User.create({ name, password, role });
      return AuthController.login(req, res, next);
    } catch (e) {
      next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Can't create user"));
    }
  }
}
