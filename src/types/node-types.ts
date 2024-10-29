import { NodeType } from "@prisma/client";

export type Node = {
  node_id: number;
  parent_node_id: number | null;
  type: NodeType;
  name: string;
};

export type NodeWithSubNodes = Node & { children?: NodeWithSubNodes[] };
