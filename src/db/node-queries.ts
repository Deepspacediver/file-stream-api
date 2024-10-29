import { queryUserNodes } from "@prisma/client/sql";
import { Node, NodeWithSubNodes } from "../types/node-types.js";
import prisma from "../config/prisma-config.js";
import transfromNodesToFolderTree from "../helpers/transform-to-folder-tree.js";

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
