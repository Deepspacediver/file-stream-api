import { Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

export const setAuthCookie = (user: User, res: Response) => {
  const jwtPayload = { userId: user.userId, username: user.username };
  const token = jwt.sign({ user: jwtPayload }, process.env.JWT_SECRET!);
  res.cookie("auth_cookie", token, { httpOnly: true, maxAge: 1800000 });
};
