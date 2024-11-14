import { User } from "@prisma/client";
import { Router } from "express";
import passport from "passport";
import { setAuthCookie } from "../helpers/auth-helpers.js";
import { getUserFromCookieGET } from "../controllers/auth-controller.js";

const authRouter = Router();

authRouter.post("/login", (req, res, next) => {
  passport.authenticate("local", function (err: Error, user: User, _info: any) {
    if (err) {
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (!user) {
      res.status(400).json({ error: "Incorrect login credentials" });
      return;
    }
    req.login(user, (err) => {
      if (err) {
        next(err);
      }
      setAuthCookie(user, res);
      res.json({ user: { username: user.username, userId: user.userId } });
    });
  })(req, res, next);
});

authRouter.get("/me", getUserFromCookieGET);

export default authRouter;
