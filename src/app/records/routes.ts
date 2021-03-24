import { Router } from "express";
import { Validator } from "express-json-validator-middleware";
import RecordsController from "./controller";
import { authorize, validateMethodAccess } from "../auth/middleware";
import { RecordSchema } from "./schema";

const validator = new Validator({ allErrors: true });

export default class RecordsRouter {
  public static routes(): Router {
    const router = Router();

    router.get(
      "/",
      authorize(),
      validateMethodAccess("READ"),
      RecordsController.listRecords
    );
    router.post(
      "/",
      authorize(),
      validateMethodAccess("CREATE"),
      validator.validate({ body: RecordSchema }),
      RecordsController.createRecord
    );
    router.get(
      "/:id",
      authorize(),
      validateMethodAccess("READ"),
      RecordsController.readRecord
    );
    router.put(
      "/:id",
      authorize(),
      validateMethodAccess("UPDATE"),
      validator.validate({ body: RecordSchema }),
      RecordsController.updateRecord
    );
    router.delete(
      "/:id",
      authorize(),
      validateMethodAccess("DELETE"),
      RecordsController.deleteRecord
    );

    return router;
  }
}
