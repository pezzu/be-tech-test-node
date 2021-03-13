import { Request, Response } from "express";

export default class RecordsController {
  public static create(req: Request, res: Response): void {}

  public static read(req: Request, res: Response): void {
    res.json({
      record: "123",
    });
  }
  public static update(req: Request, res: Response): void {}
  public static deleteRecord(req: Request, res: Response): void {}
}
