import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Record, IRecordModel } from "./model";
import ApiError from "../../helpers/ApiError";
import { isAccessible } from "../auth/permissions";

export default class RecordsController {
  private static projection = { text: 1, isEditable: 1, owner: 1 };

  public static async listRecords(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const records = await Record.find(
        {},
        RecordsController.projection
      ).exec();
      res.json(records.filter((rec) => isAccessible((req as any).user, rec)));
    } catch (error) {
      error.status = httpStatus.INTERNAL_SERVER_ERROR;
      next(error);
    }
  }

  public static async createRecord(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const record = new Record({ ...req.body, owner: (req as any).user.role });

    try {
      const saved = await record.save();
      res.json(saved).status(httpStatus.CREATED);
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        next(new ApiError(httpStatus.CONFLICT, "Record already exists"));
      } else {
        error.status = httpStatus.INTERNAL_SERVER_ERROR;
        next(error);
      }
    }
  }

  public static async readRecord(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params.id;
      const record = await Record.findById(
        id,
        RecordsController.projection
      ).exec();
      if (record) {
        if (isAccessible((req as any).user, record)) {
          res.json(record);
          next();
        } else {
          next(new ApiError(httpStatus.UNAUTHORIZED, "Not enough permissions"));
        }
      } else {
        res.status(httpStatus.NOT_FOUND).end();
      }
    } catch (error) {
      next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message));
    }
  }

  public static async updateRecord(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const record = await Record.findByIdAndUpdate(req.params.id, req.body, {
        returnOriginal: false,
        projection: RecordsController.projection,
      }).exec();
      res.json(record);
    } catch (error) {
      next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message));
    }
  }

  public static async deleteRecord(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const record = await Record.findByIdAndRemove(req.params.id).exec();
      if(!record) {
        next(new ApiError(httpStatus.NOT_FOUND, "There is no such record"));
      } else {
        res.status(httpStatus.OK).end();
      }
    } catch (error) {
      next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message));
    }
  }
}
