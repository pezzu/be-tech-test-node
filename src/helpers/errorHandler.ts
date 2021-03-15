import { Request, Response, NextFunction } from "express";
import { ValidationError } from "express-json-validator-middleware";
import ApiError from "./ApiError";

export function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof ValidationError) {
    res.status(400).json({
      error: {
        message: ((err as unknown) as { validationErrors: object }).validationErrors,
        status: 400,
      },
    });
  } else {
    res.status(err.status).json({
      error: {
        message: err.message,
        status: err.status,
      },
    });
  }
}
