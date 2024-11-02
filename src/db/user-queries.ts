import prisma from "../config/prisma-config.js";
import { NodeWithSubNodes } from "../types/node-types.js";
import { CreateUserRequest } from "../types/user-types.js";
import { getNodeTree } from "./node-queries.js";

export const createUser = async ({ username, password }: CreateUserRequest) => {
  return await prisma.user.create({
    data: {
      username,
      password,
    },
  });
};

export const getUserData = async (userId: number) => {
  const user = await prisma.user.findFirst({
    where: {
      userId,
    },
  });

  if (!user) {
    return null;
  }

  const nodeTree = await getNodeTree(userId);

  if (!nodeTree) {
    return null;
  }

  return {
    user,
    drive: nodeTree,
  };
};
