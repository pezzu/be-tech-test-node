import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import config from "../config";
import ApiError from "../helpers/ApiError";

export function permissions(users: Array<string> = []) {
  return function (req: Request, res: Response, next: NextFunction) {
    const token = req.headers.token as string;

    jwt.verify(token, config.SECRET, (err, decoded) => {
      if (err) {
        next(new ApiError(401, "Not Authenticated"));
      } else if (users.length === 0 || users.includes(decoded)) {
        next();
      } else {
        next(new ApiError(401, "Not enough permissions"));
      }
    });
  };
}
