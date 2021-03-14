import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import config from "../../config";
import ApiError from "../../helpers/ApiError";
import User from "./model";


export function authorize(roles: Array<string> = []) {
  return function (req: Request, res: Response, next: NextFunction) {
    const token = req.headers["x-access-token"] as string;

    if (token) {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          next(new ApiError(httpStatus.UNAUTHORIZED, "Invalid token"));
        } else {
          const user = User.findOne((decoded as {user: string}).user);
          if (roles.length === 0 || roles.includes(user.role)) {
            next();
          } else {
            next(
              new ApiError(httpStatus.UNAUTHORIZED, "Not enough permissions")
            );
          }
        }
      });
    } else {
      next(new ApiError(httpStatus.UNAUTHORIZED, "Invalid token"));
    }
  };
}
