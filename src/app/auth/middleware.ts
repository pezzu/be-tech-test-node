import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { promisify } from "util";
import config from "../../config";
import ApiError from "../../helpers/ApiError";
import { Role } from "./model/role";
import { User } from "./model/user";
import { IUserExpanded } from "../../interfaces/user";

// https://github.com/Microsoft/TypeScript/issues/26048
declare module 'util' {
  function promisify<T1, T2, TResult>(fn: (arg1: T1, arg2: T2, callback: (err: any, result: TResult) => void) => void): (arg1: T1, arg2: T2) => Promise<TResult>;
}

const jwtVerify = promisify(jwt.verify);

export function authorize(roles: string[] = []) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const token = req.headers["x-access-token"] as string;
    if (!token) {
      next(new ApiError(httpStatus.UNAUTHORIZED, "Invalid token"));
      return;
    }

    let decoded;
    try {
      decoded = await jwtVerify(token, config.secret);
    } catch (err) {
      next(new ApiError(httpStatus.UNAUTHORIZED, "Invalid token"));
      return;
    }

    try {
      const username = (decoded as { user: string }).user;
      const userDb = await User.findOne({ name: username }).lean();
      if (roles.length === 0 || roles.includes(userDb.role)) {
        const role = await Role.findOne({ name: userDb.role }).lean();
        (req as any).user = { ...userDb, role };
        next();
      } else {
        next(new ApiError(httpStatus.UNAUTHORIZED, "Not enough permissions"));
      }
    } catch (err) {
      next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message));
    }
  };
}
