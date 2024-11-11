import { Response } from "express";
import { UserWithoutPassword } from "../types/user-types.js";
import jwt from "jsonwebtoken";

export const setAuthCookie = (user: UserWithoutPassword, res: Response) => {
  const jwtPayload = { user_id: user.userId, username: user.username };
  const token = jwt.sign({ user: jwtPayload }, process.env.JWT_SECRET!);
  res.cookie("auth_cookie", token, { httpOnly: true, maxAge: 900000 });
};
