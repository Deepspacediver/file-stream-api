import { RequestHandler } from "express";

const isAuthenticated: RequestHandler = (req, res, next) => {
  if (!!req.user) {
    next();
  }
  res
    .status(401)
    .json({ error: "You need to be logged in to access this resource" });
};

export default isAuthenticated;
