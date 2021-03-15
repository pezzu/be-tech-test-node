import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import config from "../../config";
import ApiError from "../../helpers/ApiError";
import { Role } from "./model/role";
import { User } from "./model/user";
import { IUserExpanded } from "../../interfaces/user";

export function authorize(roles: Array<string> = []) {
  return function (req: Request, res: Response, next: NextFunction) {
    const token = req.headers["x-access-token"] as string;
    if (token) {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          next(new ApiError(httpStatus.UNAUTHORIZED, "Invalid token"));
        } else {
          const username = (decoded as { user: string }).user;
          User.findOne({ name: username }, (err, userDb) => {
            if (err) {
              next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message));
            }
            if (roles.length === 0 || roles.includes(userDb.role)) {
              Role.findOne({ name: userDb.role }, (err, role) => {
                if (err) {
                  next(
                    new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message)
                  );
                } else {
                  userDb.role = role;
                  (req as any).user = userDb;
                  next();
                }
              }).lean();
            } else {
              next(
                new ApiError(httpStatus.UNAUTHORIZED, "Not enough permissions")
              );
            }
          }).lean();
        }
      });
    } else {
      next(new ApiError(httpStatus.UNAUTHORIZED, "Invalid token"));
    }
  };
}
