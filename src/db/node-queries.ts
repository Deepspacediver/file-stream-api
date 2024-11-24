import { queryNodesFromNodeId } from "@prisma/client/sql";
import { CreateNodeLinkProps, Node } from "../types/node-types.js";
import prisma from "../config/prisma-config.js";
import transfromNodesToFolderTree from "../helpers/transform-to-folder-tree.js";
import { NodeType } from "@prisma/client";
import { randomUUID } from "crypto";

export const createSharedNode = async ({
  nodeIdToShare,
  expiryDate,
  userId,
}: CreateNodeLinkProps) => {
  const nodeToBeShared = await prisma.node.findFirst({
    where: {
      nodeId: nodeIdToShare,
    },
  });

  if (nodeToBeShared?.type === NodeType.FILE) {
    throw new Error("Only folders can be shared");
  }

  const linkHash = randomUUID();
  const sharedNode = await prisma.nodeShareLink.create({
    data: {
      sharedNodeId: nodeIdToShare,
      linkHash,
      expiryDate,
      userId,
    },
  });
  const link = `${process.env.CLIENT_URL}/shared/${sharedNode.linkHash}`;
  return link;
};

export const getSharedNodeTree = async (linkHash: string) => {
  const nodeLink = await prisma.nodeShareLink.findFirst({
    where: {
      linkHash,
    },
  });
  if (!nodeLink) {
    throw new Error("Folder with given link does not exists");
  }
  if (nodeLink.expiryDate < new Date()) {
    throw new Error("Link has expired");
  }
  const nodes = (await prisma.$queryRawTyped(
    queryNodesFromNodeId(nodeLink.sharedNodeId)
  )) as Node[] | null;

  if (!nodes) {
    return null;
  }

  return transfromNodesToFolderTree(nodes);
};
