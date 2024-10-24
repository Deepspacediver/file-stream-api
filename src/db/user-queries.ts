import prisma from "../config/prisma-config.js";
import { CreateUserRequest } from "../types/user-types.js";

export const createUser = async ({ username, password }: CreateUserRequest) => {
  return await prisma.user.create({
    data: {
      username,
      password,
    },
  });
};
