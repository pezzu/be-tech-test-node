import { Request, Response, NextFunction } from "express";
import ApiError from "./ApiError";

export function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  res.status(err.status).json({
    error: {
      message: err.message,
      status: err.status,
    },
  });
}
