import { Router } from "express";
import AuthController from "./controller";

export default class AuthRouter {
  public static routes(): Router {
    const router = Router();

    router.post("/", AuthController.authenticate);

    return router;
  }
}
