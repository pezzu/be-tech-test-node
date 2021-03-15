import { Router } from "express";
import { Validator } from "express-json-validator-middleware";
import RecordsController from "./controller";
import { authorize } from "../auth/middleware";
import { RecordSchema } from "./schema";

const validator = new Validator({ allErrors: true });

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
      validator.validate({ body: RecordSchema }),
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
      validator.validate({ body: RecordSchema }),
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
