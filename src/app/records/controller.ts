import { NextFunction, Request, Response } from "express";

export default class RecordsController {
  public static create(req: Request, res: Response, next: NextFunction): void {}

  public static read(req: Request, res: Response, next: NextFunction): void {
    res.json({
      record: "123",
    });
  }
  public static update(req: Request, res: Response, next: NextFunction): void {}
  public static deleteRecord(req: Request, res: Response, next: NextFunction): void {}
}
