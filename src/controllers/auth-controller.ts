import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

export const getUserFromCookieGET = asyncHandler(async (req, res, _next) => {
  const authCookie =
    (req.cookies as {}) && (req.cookies["auth_cookie"] as string | undefined);
  if (!authCookie) {
    res.status(401).json({ message: "Unauthenticated" });
    return;
  }
  jwt.verify(authCookie, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      res.status(401).json({ message: "Incorrect authentication credentials" });
      return;
    }
    res.json({ user });
  });
});
