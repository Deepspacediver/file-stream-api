import { NodeType } from "@prisma/client";
import prisma from "../config/prisma-config.js";
import { Node } from "../types/node-types.js";
import { CreateUserRequest } from "../types/user-types.js";
import { queryFilesFromNode, queryUserNodes } from "@prisma/client/sql";
import { CreateNode } from "../types/node-types.js";
import cloudinary from "../config/cloudinary-config.js";
import transfromNodesToFolderTree from "../helpers/transform-to-folder-tree.js";

export const createUser = async ({ username, password }: CreateUserRequest) => {
  return await prisma.user.create({
    data: {
      username,
      password,
      nodes: {
        create: {
          name: "Drive",
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

export const createNode = async (data: CreateNode) => {
  const { parentNodeId, name, type, userId, fileLink, filePublicId } = data;
  const isNodeFile = type === NodeType.FILE;

  const createdNode = await prisma.node.create({
    data: {
      parentNodeId,
      name,
      type,
      userId,
      ...(isNodeFile && { fileLink }),
      ...(!!filePublicId && { filePublicId }),
    },
    select: {
      parentNodeId: true,
      name: true,
      type: true,
      userId: true,
      fileLink: true,
      nodeId: true,
    },
  });
  return createdNode;
};

export const updateNodeName = async (nodeId: number, newName: string) => {
  const updatedNode = await prisma.node.update({
    where: {
      nodeId,
    },
    data: {
      name: newName,
    },
  });

  return updatedNode;
};

export const deleteNode = async (nodeId: number) => {
  const fileNodesWithinDeletedNode = (await prisma.$queryRawTyped(
    queryFilesFromNode(nodeId)
  )) as unknown as Array<{ file_public_id: string }>;

  const publicIdArray = fileNodesWithinDeletedNode.map(
    ({ file_public_id }) => file_public_id
  );

  await prisma.node.delete({
    where: {
      nodeId,
      AND: {
        parentNodeId: {
          not: null,
        },
      },
    },
  });
  await cloudinary.api.delete_resources(publicIdArray);
};

export const getUserFolders = async (userId: number) => {
  const folders = await prisma.node.findMany({
    where: {
      userId,
      type: NodeType.FOLDER,
    },
    select: {
      nodeId: true,
      name: true,
      userId: true,
      parentNodeId: true,
    },
    orderBy: {
      parentNodeId: "desc",
    },
  });
  return folders;
};

export const getUserFolderTree = async (userId: number) => {
  const userFolders = await getUserFolders(userId);
  const folderTree = transfromNodesToFolderTree(userFolders);

  return folderTree;
};

export const gerUserFolderContent = async ({
  userId,
  folderId,
}: {
  folderId: number;
  userId: number;
}) => {
  const folderNodes = await prisma.node.findMany({
    where: {
      parentNodeId: folderId,
      userId,
    },
    select: {
      nodeId: true,
      fileLink: true,
      type: true,
      name: true,
    },
  });

  const folderName = await prisma.node.findFirst({
    where: {
      nodeId: folderId,
      userId,
    },
    select: {
      name: true,
    },
  });

  return {
    name: folderName?.name,
    content: folderNodes,
  };
};
