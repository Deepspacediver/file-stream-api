import { queryUserNodes } from "@prisma/client/sql";
import { CreateNode, Node, NodeWithSubNodes } from "../types/node-types.js";
import prisma from "../config/prisma-config.js";
import transfromNodesToFolderTree from "../helpers/transform-to-folder-tree.js";
import { NodeType } from "@prisma/client";

export const getNodeTree = async (
  userId: number
): Promise<NodeWithSubNodes | null> => {
  const userNodes = (await prisma.$queryRawTyped(queryUserNodes(userId))) as
    | Node[]
    | null;

  if (!userNodes) {
    return null;
  }

  const nodeTree = transfromNodesToFolderTree(userNodes);

  return nodeTree;
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
