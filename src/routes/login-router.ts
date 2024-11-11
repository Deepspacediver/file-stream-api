import { User } from "@prisma/client";
import { Router } from "express";
import passport from "passport";
import { setAuthCookie } from "../helpers/auth-helpers.js";

const loginRouter = Router();

loginRouter.post("/", (req, res, next) => {
  passport.authenticate("local", function (err: Error, user: User, _info: any) {
    if (err) {
      res.status(500).json({ error: "Internal server error" });
    }
    if (!user) {
      res.status(400).json({ error: "Incorrect login credentials" });
    }
    req.login(user, (err) => {
      if (err) {
        next(err);
      }
      setAuthCookie(user, res);
      res.json({ message: "You have successfully logged in" });
    });
  })(req, res, next);
});

export default loginRouter;
