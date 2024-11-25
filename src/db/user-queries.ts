import { NodeType } from "@prisma/client";
import prisma from "../config/prisma-config.js";
import { Node } from "../types/node-types.js";
import { CreateUserRequest } from "../types/user-types.js";
import {
  queryFilesFromNode,
  queryUserFolders,
  queryUserNodes,
} from "@prisma/client/sql";
import { CreateNode, NodeWithSubNodes } from "../types/node-types.js";
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
  const { parentNodeId, name, type, userId, fileLink } = data;
  const isNodeFile = type === NodeType.FILE;

  const createdNode = await prisma.node.create({
    data: {
      parentNodeId,
      name,
      type,
      userId,
      ...(isNodeFile && { fileLink }),
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

export const getNodeTree = async (
  userId: number
): Promise<NodeWithSubNodes | null> => {
  const userNodes = (await prisma.$queryRawTyped(
    queryUserNodes(userId)
  )) as unknown as Node[] | null;

  if (!userNodes) {
    return null;
  }

  const nodeTree = transfromNodesToFolderTree(userNodes);

  return nodeTree;
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

export const getUserFolders = async (userId: number) => {
  const folders = await prisma.$queryRawTyped(queryUserFolders(userId));
  const mappedFolders = folders.map(({ node_id, name }) => ({
    nodeId: node_id,
    name,
  }));

  return mappedFolders;
};
