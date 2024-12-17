import { Folder, FolderWithSubFolders } from "../types/node-types.js";

const getIndexedNodes = (array: Folder[]) => {
  const indexedNodes: Record<string, number> = array.reduce(
    (acc, curr, index) => {
      return {
        ...acc,
        [curr.nodeId]: index,
      };
    },
    {}
  );
  return indexedNodes;
};

const transfromNodesToFolderTree = (
  nodes: Folder[],
  searchedNodeId?: number
): FolderWithSubFolders | null => {
  const indexedNodes = getIndexedNodes(nodes);

  nodes.forEach((node) => {
    if (searchedNodeId ? node.nodeId === searchedNodeId : !node.parentNodeId) {
      return;
    }
    const parentNodeKey = String(node.parentNodeId);
    const parentNodeIndex = indexedNodes[parentNodeKey];
    const parentNode = nodes[parentNodeIndex] as FolderWithSubFolders;
    if (!!parentNode.children) {
      parentNode.children.push(node as FolderWithSubFolders);
      return;
    }
    parentNode.children = [node as FolderWithSubFolders];
  });

  return (
    (nodes.find((node) =>
      searchedNodeId ? node.nodeId === searchedNodeId : !node.parentNodeId
    ) as FolderWithSubFolders | undefined) ?? null
  );
};

export default transfromNodesToFolderTree;
