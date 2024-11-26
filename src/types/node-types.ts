import { NodeType } from "@prisma/client";

export type Node = {
  node_id: number;
  parent_node_id: number | null;
  type: NodeType;
  name: string;
  fileLink?: string;
  filePublicId?: string;
};

export type NodeWithSubNodes = Node & { children?: NodeWithSubNodes[] };

export type CreateNode = {
  name: string;
  type: NodeType;
  parentNodeId: number;
  fileLink?: string;
  userId?: number;
  filePublicId?: string;
};

export type CreateNodeLinkProps = {
  nodeIdToShare: number;
  expiryDate: Date;
  userId: number;
};
