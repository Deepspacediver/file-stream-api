import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import schemaParser from "../helpers/schema-parser.js";
import { RegisterSchema } from "../schema/register-schema.js";
import { createUser } from "../db/user-queries.js";

export const createUserPOST = asyncHandler(async (req, res, next) => {
  schemaParser(RegisterSchema, req);
  const { username, password } = req.body;

  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      return next(err);
    }

    const user = await createUser({ username, password: hash });
    if (!user) {
      throw new Error("Failed to created user");
    }

    req.login(user, (err) => {
      if (err) {
        next(err);
      }
      res.json({ message: "You have successfully registered." });
    });
  });
});
