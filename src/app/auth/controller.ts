import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const users = {
  admin: "admin",
  editor: "verysecretpassword",
  tester: "123,",
};

export default class AuthController {
  public static authenticate(req: Request, res: Response): void {
    const { user, password } = req.body;

    if (users[user] === password) {
      var token = jwt.sign({ user }, process.env.SECRET);
      res.cookie("token", token, { expires: new Date(360000 + Date.now()) });

      res.json({ status: "ok" });
    } else {
      // new AuthError(401, "invalid...")
      res.status(401).json({
        status: "Not Authenticated",
        msg: "Invalid user or passowrd",
      });
    }
  }
}
