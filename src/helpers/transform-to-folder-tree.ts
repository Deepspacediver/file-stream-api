import { NodeType } from "@prisma/client";

type Node = {
  node_id: number;
  parent_node_id: number | null;
  type: NodeType;
  name: string;
};

type NodeWithSubNodes = Node & { children?: NodeWithSubNodes[] };

const getIndexedNodes = (array: Node[]) => {
  const indexedNodes: Record<string, number> = array.reduce(
    (acc, curr, index) => {
      return {
        ...acc,
        [curr.node_id]: index,
      };
    },
    {}
  );
  return indexedNodes;
};

const transfromNodesToFolderTree = (nodes: Node[]): NodeWithSubNodes => {
  const indexedNodes = getIndexedNodes(nodes);

  nodes.forEach((node) => {
    if (!node.parent_node_id) {
      return;
    }
    const parentNodeKey = String(node.parent_node_id);
    const parentNodeIndex = indexedNodes[parentNodeKey];
    const parentNode = nodes[parentNodeIndex] as NodeWithSubNodes;
    if (!!parentNode.children) {
      parentNode.children.push(node);
      return;
    }
    parentNode.children = [node];
  });

  return nodes[0];
};

export default transfromNodesToFolderTree;
