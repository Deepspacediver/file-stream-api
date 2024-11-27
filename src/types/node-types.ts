import { NodeType, Node as PrismaNode } from "@prisma/client";

export type Node = {
  node_id: number;
  parent_node_id: number | null;
  type: NodeType;
  userId: number;
  name: string;
  fileLink?: string;
  filePublicId?: string;
};

export type CreateNode = {
  name: string;
  type: NodeType;
  parentNodeId: number;
  fileLink?: string;
  userId: number;
  filePublicId?: string;
};

export type Folder = Pick<
  PrismaNode,
  "name" | "nodeId" | "parentNodeId" | "userId"
>;

export type FolderWithSubFolders = Folder & {
  children: FolderWithSubFolders[];
};

export type CreateNodeLinkProps = {
  nodeIdToShare: number;
  expiryDate: Date;
  userId: number;
};
