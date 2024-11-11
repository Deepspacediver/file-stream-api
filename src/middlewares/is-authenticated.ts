import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const isAuthenticated: RequestHandler = (req, res, next) => {
  const authCookie =
    (req.cookies as {}) && (req.cookies["authCookie"] as string | undefined);
  if (!authCookie) {
    res.status(401).json({ message: "Unauthenticated" });
    return;
  }

  jwt.verify(authCookie, process.env.JWT_SECRET!, (err, _user) => {
    if (err) {
      res.status(403).json({ message: "Unauthorized" });
    }
    next();
  });
};

export default isAuthenticated;
