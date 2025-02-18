import {
  queryFolderWithinSharedNode,
  queryNodesFromNodeId,
} from "@prisma/client/sql";
import { CreateNodeLinkProps, Folder } from "../types/node-types.js";
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
  )) as unknown as Folder[] | null;

  if (!nodes) {
    return null;
  }
  return transfromNodesToFolderTree(nodes, nodeLink.sharedNodeId);
};

export const getSharedNodeWithContent = async (
  linkHash: string,
  nodeId: number | null
) => {
  const sharedNodeLink = await prisma.nodeShareLink.findFirst({
    where: {
      linkHash,
    },
  });

  if (!sharedNodeLink) {
    throw new Error("Folder with given link does not exists");
  }
  if (sharedNodeLink.expiryDate < new Date()) {
    throw new Error("Link has expired");
  }

  if (nodeId) {
    const searchedFolderWithinSharedNode = await prisma.$queryRawTyped(
      queryFolderWithinSharedNode(linkHash, nodeId)
    );
    if (!searchedFolderWithinSharedNode.length) {
      throw new Error(
        "Specified folder has not been found within shared folder"
      );
    }
  }

  const sharedNode = await prisma.node.findFirst({
    where: {
      nodeId: nodeId ?? sharedNodeLink.sharedNodeId,
    },
    select: {
      name: true,
      nodeId: true,
      parentNodeId: true,
      userId: true,
      childNode: true,
    },
  });

  return {
    name: sharedNode?.name,
    nodeId: sharedNode?.nodeId,
    parentNodeId: sharedNode?.parentNodeId,
    userId: sharedNode?.userId,
    content: sharedNode?.childNode,
  };
};
