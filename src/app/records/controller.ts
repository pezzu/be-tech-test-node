import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Record, IRecordModel } from "./model";
import ApiError from "../../helpers/ApiError";
import { isRecordAccessible, isRecordEditable } from "../auth/permissions";
import { IUserExpanded } from "../../interfaces/user";

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
      res.json(
        records.filter((rec) => isRecordAccessible((req as any).user, rec))
      );
    } catch (error) {
      next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message));
    }
  }

  public static async createRecord(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const record = new Record({
      ...req.body,
      owner: (req as any).user.role.name,
    });
    try {
      const saved = await record.save();
      res.json(saved).status(httpStatus.CREATED);
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        next(new ApiError(httpStatus.CONFLICT, "Record already exists"));
      } else {
        next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message));
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
        if (isRecordAccessible((req as any).user, record)) {
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
    const user: IUserExpanded = (req as any).user;
    try {
      const record = await Record.findById(
        req.params.id,
        RecordsController.projection
      ).exec();

      if (!record) {
        next(new ApiError(httpStatus.NOT_FOUND, "Record not found"));
        return;
      }

      if (!isRecordAccessible(user, record) || !isRecordEditable(user, record, req.body)) {
        next(new ApiError(httpStatus.UNAUTHORIZED, "Not enough permissions"));
        return;
      }

      const updated = await Record.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        projection: RecordsController.projection,
      }).exec();

      res.json(updated);
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
      if (!record) {
        next(new ApiError(httpStatus.NOT_FOUND, "There is no such record"));
      } else {
        res.status(httpStatus.OK).end();
      }
    } catch (error) {
      next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message));
    }
  }
}
