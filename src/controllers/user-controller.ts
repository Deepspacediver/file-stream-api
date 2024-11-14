import asyncHandler from "express-async-handler";
import schemaParser from "../helpers/schema-parser.js";
import {
  CreateUserSchema,
  UserDataSchema,
} from "../schema/request-schemas/user-schema.js";
import { createUser, getUserDataWithNodeTree } from "../db/user-queries.js";
import bcrypt from "bcryptjs";
import { setAuthCookie } from "../helpers/auth-helpers.js";

export const getUserDataWithNodeTreeGET = asyncHandler(async (req, res) => {
  schemaParser(UserDataSchema, req);
  const { userId } = req.params;
  const data = await getUserDataWithNodeTree(+userId);
  if (!data) {
    res.status(404).json({ error: "User does not exist" });
    return;
  }
  res.json(data);
});

export const createUserPOST = asyncHandler(async (req, res, next) => {
  schemaParser(CreateUserSchema, req);

  const { username, password } = req.body;
  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      return next(err);
    }

    const user = await createUser({ username, password: hash });
    if (!user) {
      return next(new Error("Failed to created user"));
    }

    req.login(user, (err) => {
      if (err) {
        next(err);
      }
      setAuthCookie(user, res);
      res.json({ username: user.username, userId: user.userId });
    });
  });
});
