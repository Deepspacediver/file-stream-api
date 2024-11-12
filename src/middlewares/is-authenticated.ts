import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const isAuthenticated: RequestHandler = (req, res, next) => {
  const authCookie =
    (req.cookies as {}) && (req.cookies["auth_cookie"] as string | undefined);
  console.log(authCookie);
  if (!authCookie) {
    res.status(401).json({ message: "Unauthenticated" });
    return;
  }

  jwt.verify(authCookie, process.env.JWT_SECRET!, (err, _user) => {
    if (err) {
      res.status(401).json({ message: "Incorrect authentication credentials" });
    }
    next();
  });
};

export default isAuthenticated;
