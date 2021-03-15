import { Router } from "express";
import RecordsController from "./controller";
import { authorize } from "../auth/middleware";

export default class RecordsRouter {
  public static routes(): Router {
    const router = Router();

    router.get(
      "/",
      authorize(),
      RecordsController.listRecords
    );
    router.post(
      "/",
      authorize(),
      RecordsController.createRecord
    );
    router.get(
      "/:id",
      authorize(),
      RecordsController.readRecord
    );
    router.put(
      "/:id",
      authorize(),
      RecordsController.updateRecord
    );
    router.delete(
      "/:id",
      authorize(),
      RecordsController.deleteRecord
    );

    return router;
  }
}
