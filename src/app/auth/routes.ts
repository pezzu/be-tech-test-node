import { Router } from "express";
import { Validator } from "express-json-validator-middleware";
import AuthController from "./controller";
import { AuthSchema, CreateUserSchema } from "./schema";

const validator = new Validator({ allErrors: true });

export default class AuthRouter {
  public static routes(): Router {
    const router = Router();

    router.post(
      "/",
      validator.validate({ body: AuthSchema }),
      AuthController.authenticate
    );

    router.post(
      "/signup",
      validator.validate({ body: CreateUserSchema }),
      AuthController.createUser
    );

    return router;
  }
}
