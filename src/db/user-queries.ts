import { NodeType } from "@prisma/client";
import prisma from "../config/prisma-config.js";
import { CreateUserRequest } from "../types/user-types.js";
import { getNodeTree } from "./node-queries.js";

export const createUser = async ({ username, password }: CreateUserRequest) => {
  return await prisma.user.create({
    data: {
      username,
      password,
      mainNode: {
        create: {
          name: "Home",
          type: NodeType.FOLDER,
        },
      },
    },
  });
};

export const getUserData = async (userId: number) => {
  const user = await prisma.user.findFirst({
    where: {
      userId,
    },
    select: {
      userId: true,
      username: true,
    },
  });
  if (!user) {
    return null;
  }

  return user;
};

export const getUserDataWithNodeTree = async (userId: number) => {
  const user = await getUserData(userId);
  if (!user) {
    return null;
  }

  const nodeTree = (await getNodeTree(userId)) ?? null;
  return {
    userId: user.userId,
    username: user.username,
    drive: nodeTree,
  };
};
