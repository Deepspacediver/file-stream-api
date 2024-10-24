import { Router } from "express";
import passport from "passport";

const loginRouter = Router();
loginRouter.post(
  "/",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/",
  })
);

export default loginRouter;
