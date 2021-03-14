import { Router } from "express";
import AuthRouter from "../app/auth/routes";
import RecordsRouter from "../app/records/routes";

export default class ApiRouter {
  public static routes(): Router {
    const router = Router();

    router.use("/auth", AuthRouter.routes());
    router.use("/record", RecordsRouter.routes());

    return router;
  }
}
