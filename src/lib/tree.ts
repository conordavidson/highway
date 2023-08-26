/* eslint-disable fp/no-mutation */
/* eslint-disable fp/no-mutating-methods */
type Node = {
  id: string;
  parentId: null | string;
  updatedAt: Date;
};

type NodeWithChildren = Node & {
  children: NodeWithChildren[];
};

type NodeWithChildrenAndLevel = NodeWithChildren & {
  level: number;
};

const sortNodes = (nodes: NodeWithChildren[]) => {
  return nodes.sort((a, b) => {
    if (a.updatedAt < b.updatedAt) return -1;
    if (a.updatedAt > b.updatedAt) return 1;
    return 0;
  });
};

const sortChildrenAndAddLevels = (
  nodes: NodeWithChildren[],
  level: number,
): NodeWithChildrenAndLevel[] => {
  return sortNodes(nodes).map((node) => {
    return { ...node, level, children: sortChildrenAndAddLevels(node.children, level + 1) };
  });
};

export const make = (nodes: Node[]): NodeWithChildrenAndLevel[] => {
  const map = nodes.reduce((all: Record<string, NodeWithChildren>, node) => {
    all[node.id] = { ...node, children: [] };
    return all;
  }, {});

  const roots: NodeWithChildren[] = [];

  nodes.forEach((node) => {
    const nodeFromMap = map[node.id];
    if (node.parentId) {
      const parentFromMap = map[node.parentId];
      parentFromMap.children.push(nodeFromMap);
      return;
    }
    roots.push(nodeFromMap);
  });

  return sortChildrenAndAddLevels(roots, 0);
};
