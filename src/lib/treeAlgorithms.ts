// Tree node types
export interface TreeNode {
  id: string;
  value: number;
  left?: TreeNode;
  right?: TreeNode;
  x?: number;
  y?: number;
}

export interface TreeStep {
  visitedNodes: string[];
  currentNode: string | null;
  path: number[];
  message: string;
  highlightEdge?: { from: string; to: string };
}

// Sample binary tree for visualization
export function createSampleTree(): TreeNode {
  return {
    id: "1",
    value: 50,
    left: {
      id: "2",
      value: 30,
      left: {
        id: "4",
        value: 20,
        left: { id: "8", value: 10 },
        right: { id: "9", value: 25 },
      },
      right: {
        id: "5",
        value: 40,
      },
    },
    right: {
      id: "3",
      value: 70,
      left: {
        id: "6",
        value: 60,
      },
      right: {
        id: "7",
        value: 80,
        right: { id: "10", value: 90 },
      },
    },
  };
}

// Calculate positions for tree visualization
export function calculateTreePositions(root: TreeNode, width: number, height: number): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();
  const levelHeight = height / 5;
  
  function getTreeDepth(node: TreeNode | undefined): number {
    if (!node) return 0;
    return 1 + Math.max(getTreeDepth(node.left), getTreeDepth(node.right));
  }

  const depth = getTreeDepth(root);
  
  function calculatePos(node: TreeNode | undefined, level: number, left: number, right: number) {
    if (!node) return;
    
    const x = (left + right) / 2;
    const y = level * levelHeight + 40;
    positions.set(node.id, { x, y });
    
    const gap = (right - left) / 4;
    calculatePos(node.left, level + 1, left, x - gap/2);
    calculatePos(node.right, level + 1, x + gap/2, right);
  }
  
  calculatePos(root, 0, 0, width);
  return positions;
}

// Inorder Traversal (Left, Root, Right)
export function* inorderTraversal(root: TreeNode): Generator<TreeStep> {
  const visitedNodes: string[] = [];
  const path: number[] = [];

  yield {
    visitedNodes: [],
    currentNode: root.id,
    path: [],
    message: "Starting Inorder Traversal (Left → Root → Right)",
  };

  function* traverse(node: TreeNode | undefined, parent?: string): Generator<TreeStep> {
    if (!node) return;

    // Visit left subtree
    if (node.left) {
      yield {
        visitedNodes: [...visitedNodes],
        currentNode: node.id,
        path: [...path],
        message: `Going left from ${node.value}`,
        highlightEdge: { from: node.id, to: node.left.id },
      };
      yield* traverse(node.left, node.id);
    }

    // Visit current node
    visitedNodes.push(node.id);
    path.push(node.value);
    yield {
      visitedNodes: [...visitedNodes],
      currentNode: node.id,
      path: [...path],
      message: `Visit ${node.value} (Root)`,
    };

    // Visit right subtree
    if (node.right) {
      yield {
        visitedNodes: [...visitedNodes],
        currentNode: node.id,
        path: [...path],
        message: `Going right from ${node.value}`,
        highlightEdge: { from: node.id, to: node.right.id },
      };
      yield* traverse(node.right, node.id);
    }
  }

  yield* traverse(root);

  yield {
    visitedNodes: [...visitedNodes],
    currentNode: null,
    path: [...path],
    message: `Inorder Complete! Order: ${path.join(" → ")}`,
  };
}

// Preorder Traversal (Root, Left, Right)
export function* preorderTraversal(root: TreeNode): Generator<TreeStep> {
  const visitedNodes: string[] = [];
  const path: number[] = [];

  yield {
    visitedNodes: [],
    currentNode: root.id,
    path: [],
    message: "Starting Preorder Traversal (Root → Left → Right)",
  };

  function* traverse(node: TreeNode | undefined): Generator<TreeStep> {
    if (!node) return;

    // Visit current node first
    visitedNodes.push(node.id);
    path.push(node.value);
    yield {
      visitedNodes: [...visitedNodes],
      currentNode: node.id,
      path: [...path],
      message: `Visit ${node.value} (Root first)`,
    };

    // Visit left subtree
    if (node.left) {
      yield {
        visitedNodes: [...visitedNodes],
        currentNode: node.id,
        path: [...path],
        message: `Going left from ${node.value}`,
        highlightEdge: { from: node.id, to: node.left.id },
      };
      yield* traverse(node.left);
    }

    // Visit right subtree
    if (node.right) {
      yield {
        visitedNodes: [...visitedNodes],
        currentNode: node.id,
        path: [...path],
        message: `Going right from ${node.value}`,
        highlightEdge: { from: node.id, to: node.right.id },
      };
      yield* traverse(node.right);
    }
  }

  yield* traverse(root);

  yield {
    visitedNodes: [...visitedNodes],
    currentNode: null,
    path: [...path],
    message: `Preorder Complete! Order: ${path.join(" → ")}`,
  };
}

// Postorder Traversal (Left, Right, Root)
export function* postorderTraversal(root: TreeNode): Generator<TreeStep> {
  const visitedNodes: string[] = [];
  const path: number[] = [];

  yield {
    visitedNodes: [],
    currentNode: root.id,
    path: [],
    message: "Starting Postorder Traversal (Left → Right → Root)",
  };

  function* traverse(node: TreeNode | undefined): Generator<TreeStep> {
    if (!node) return;

    // Visit left subtree
    if (node.left) {
      yield {
        visitedNodes: [...visitedNodes],
        currentNode: node.id,
        path: [...path],
        message: `Going left from ${node.value}`,
        highlightEdge: { from: node.id, to: node.left.id },
      };
      yield* traverse(node.left);
    }

    // Visit right subtree
    if (node.right) {
      yield {
        visitedNodes: [...visitedNodes],
        currentNode: node.id,
        path: [...path],
        message: `Going right from ${node.value}`,
        highlightEdge: { from: node.id, to: node.right.id },
      };
      yield* traverse(node.right);
    }

    // Visit current node last
    visitedNodes.push(node.id);
    path.push(node.value);
    yield {
      visitedNodes: [...visitedNodes],
      currentNode: node.id,
      path: [...path],
      message: `Visit ${node.value} (Root last)`,
    };
  }

  yield* traverse(root);

  yield {
    visitedNodes: [...visitedNodes],
    currentNode: null,
    path: [...path],
    message: `Postorder Complete! Order: ${path.join(" → ")}`,
  };
}

// Level Order Traversal (BFS)
export function* levelOrderTraversal(root: TreeNode): Generator<TreeStep> {
  const visitedNodes: string[] = [];
  const path: number[] = [];
  const queue: TreeNode[] = [root];

  yield {
    visitedNodes: [],
    currentNode: root.id,
    path: [],
    message: "Starting Level Order Traversal (BFS - level by level)",
  };

  while (queue.length > 0) {
    const node = queue.shift()!;
    visitedNodes.push(node.id);
    path.push(node.value);

    yield {
      visitedNodes: [...visitedNodes],
      currentNode: node.id,
      path: [...path],
      message: `Visit ${node.value} at current level`,
    };

    if (node.left) {
      queue.push(node.left);
      yield {
        visitedNodes: [...visitedNodes],
        currentNode: node.id,
        path: [...path],
        message: `Adding left child ${node.left.value} to queue`,
        highlightEdge: { from: node.id, to: node.left.id },
      };
    }

    if (node.right) {
      queue.push(node.right);
      yield {
        visitedNodes: [...visitedNodes],
        currentNode: node.id,
        path: [...path],
        message: `Adding right child ${node.right.value} to queue`,
        highlightEdge: { from: node.id, to: node.right.id },
      };
    }
  }

  yield {
    visitedNodes: [...visitedNodes],
    currentNode: null,
    path: [...path],
    message: `Level Order Complete! Order: ${path.join(" → ")}`,
  };
}

// Get all nodes as flat array
export function flattenTree(root: TreeNode): TreeNode[] {
  const nodes: TreeNode[] = [];
  
  function collect(node: TreeNode | undefined) {
    if (!node) return;
    nodes.push(node);
    collect(node.left);
    collect(node.right);
  }
  
  collect(root);
  return nodes;
}

// Get all edges
export function getTreeEdges(root: TreeNode): { from: string; to: string; fromValue: number; toValue: number }[] {
  const edges: { from: string; to: string; fromValue: number; toValue: number }[] = [];
  
  function collect(node: TreeNode | undefined) {
    if (!node) return;
    if (node.left) {
      edges.push({ from: node.id, to: node.left.id, fromValue: node.value, toValue: node.left.value });
      collect(node.left);
    }
    if (node.right) {
      edges.push({ from: node.id, to: node.right.id, fromValue: node.value, toValue: node.right.value });
      collect(node.right);
    }
  }
  
  collect(root);
  return edges;
}
