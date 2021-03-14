import { Router } from "express";
import RecordsController from "./controller";
import { permissions } from "../../middleware/permissions";

export default class RecordsRouter {
  public static routes(): Router {
    const router = Router();

    router.get(
      "/",
      permissions(),
      RecordsController.listRecords
    );
    router.post(
      "/",
      permissions(),
      RecordsController.createRecord
    );
    router.get(
      "/:id",
      permissions(),
      RecordsController.lookupRecord,
      RecordsController.readRecord
    );
    router.put(
      "/:id",
      permissions(["Admin, Editor"]),
      RecordsController.updateRecord
    );
    router.delete(
      "/:id",
      permissions(["Admin"]),
      RecordsController.deleteRecord
    );

    return router;
  }
}
