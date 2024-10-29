import { getUserNodeTree } from "@prisma/client/sql";
import { Node } from "../types/node-types.js";
import prisma from "../config/prisma-config.js";
import { NodeWithSubNodes } from "../types/node-types.js";
import transfromNodesToFolderTree from "../helpers/transform-to-folder-tree.js";

export const getUserStructuredNodes = async (
  userId: number
): Promise<NodeWithSubNodes | {}> => {
  const result = await prisma.node.findFirst({
    where: {
      userId,
      parentNodeId: null,
    },
    select: {
      nodeId: true,
    },
  });
  if (!result) {
    return {};
  }
  const { nodeId } = result;

  const userNodes = (await prisma.$queryRawTyped(
    getUserNodeTree(userId, nodeId)
  )) as Node[];

  const structuredNodes = transfromNodesToFolderTree(userNodes);

  return structuredNodes;
};
