import { Router } from "express";
import RecordsController from "./controller";
import { permissions } from "../../middleware/permissions";

export default class RecordsRouter {
  public static routes(): Router {
    const router = Router();

    router.post("/", permissions(), RecordsController.create);
    router.get("/", permissions(), RecordsController.read);
    router.put("/", permissions(["Admin, Editor"]), RecordsController.update);
    router.delete("/", permissions(["Admin"]), RecordsController.deleteRecord);

    return router;
  }
}
