import asyncHandler from "express-async-handler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserWithoutPassword } from "../types/user-types.js";

declare module "jsonwebtoken" {
  export interface JwtPayload {
    role: string;
  }
}
export const getUserFromCookieGET = asyncHandler(async (req, res, _next) => {
  const authCookie =
    (req.cookies as {}) && (req.cookies["auth_cookie"] as string | undefined);
  if (!authCookie) {
    res.status(401).json({ message: "Unauthenticated" });
    return;
  }
  jwt.verify(authCookie, process.env.JWT_SECRET!, (err, payload) => {
    if (err) {
      res.status(401).json({ message: "Incorrect authentication credentials" });
      return;
    }
    const user = (payload as JwtPayload).user as UserWithoutPassword;
    res.json({ username: user.username, userId: user.userId });
  });
});

export const logoutPOST = asyncHandler(async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
      return;
    }
    res.cookie("auth_cookie", "", { expires: new Date() });
    res.json({ message: "You have been successfully logged out" });
  });
});
