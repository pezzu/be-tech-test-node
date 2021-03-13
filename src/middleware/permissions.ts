import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';

export function permissions(users: Array<string> = []) {
  return function (req: Request, res: Response, next: NextFunction) {
    const token = req.headers.token;

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({ msg: "Not Authenticated" });
      } else if (users.length === 0 || users.includes(decoded)) {
        next();
      } else {
        res.status(401);
      }
    });
  };
}
