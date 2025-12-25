// Graph node and edge types
export interface GraphNode {
  id: string;
  x: number;
  y: number;
  label: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
}

export interface GraphStep {
  visitedNodes: string[];
  currentNode: string | null;
  queue: string[];
  stack: string[];
  distances: Map<string, number>;
  path: string[];
  visitedEdges: { from: string; to: string }[];
  message: string;
}

// Sample graphs for visualization
export const sampleGraph: { nodes: GraphNode[]; edges: GraphEdge[] } = {
  nodes: [
    { id: "A", x: 200, y: 50, label: "A" },
    { id: "B", x: 100, y: 150, label: "B" },
    { id: "C", x: 300, y: 150, label: "C" },
    { id: "D", x: 50, y: 280, label: "D" },
    { id: "E", x: 200, y: 280, label: "E" },
    { id: "F", x: 350, y: 280, label: "F" },
  ],
  edges: [
    { from: "A", to: "B", weight: 4 },
    { from: "A", to: "C", weight: 2 },
    { from: "B", to: "D", weight: 3 },
    { from: "B", to: "E", weight: 1 },
    { from: "C", to: "E", weight: 5 },
    { from: "C", to: "F", weight: 2 },
    { from: "D", to: "E", weight: 2 },
    { from: "E", to: "F", weight: 3 },
  ],
};

// Build adjacency list
function buildAdjacencyList(edges: GraphEdge[]): Map<string, { node: string; weight: number }[]> {
  const adj = new Map<string, { node: string; weight: number }[]>();
  
  for (const edge of edges) {
    if (!adj.has(edge.from)) adj.set(edge.from, []);
    if (!adj.has(edge.to)) adj.set(edge.to, []);
    
    adj.get(edge.from)!.push({ node: edge.to, weight: edge.weight || 1 });
    adj.get(edge.to)!.push({ node: edge.from, weight: edge.weight || 1 });
  }
  
  return adj;
}

// BFS Algorithm
export function* bfs(nodes: GraphNode[], edges: GraphEdge[], startNode: string): Generator<GraphStep> {
  const adj = buildAdjacencyList(edges);
  const visited = new Set<string>();
  const queue: string[] = [startNode];
  const visitedNodes: string[] = [];
  const visitedEdges: { from: string; to: string }[] = [];
  
  yield {
    visitedNodes: [],
    currentNode: startNode,
    queue: [startNode],
    stack: [],
    distances: new Map(),
    path: [],
    visitedEdges: [],
    message: `Starting BFS from node ${startNode}`,
  };

  while (queue.length > 0) {
    const current = queue.shift()!;
    
    if (visited.has(current)) continue;
    visited.add(current);
    visitedNodes.push(current);

    yield {
      visitedNodes: [...visitedNodes],
      currentNode: current,
      queue: [...queue],
      stack: [],
      distances: new Map(),
      path: [],
      visitedEdges: [...visitedEdges],
      message: `Visiting node ${current}`,
    };

    const neighbors = adj.get(current) || [];
    for (const { node: neighbor } of neighbors) {
      if (!visited.has(neighbor) && !queue.includes(neighbor)) {
        queue.push(neighbor);
        visitedEdges.push({ from: current, to: neighbor });
        
        yield {
          visitedNodes: [...visitedNodes],
          currentNode: current,
          queue: [...queue],
          stack: [],
          distances: new Map(),
          path: [],
          visitedEdges: [...visitedEdges],
          message: `Adding ${neighbor} to queue`,
        };
      }
    }
  }

  yield {
    visitedNodes: [...visitedNodes],
    currentNode: null,
    queue: [],
    stack: [],
    distances: new Map(),
    path: visitedNodes,
    visitedEdges: [...visitedEdges],
    message: `BFS Complete! Traversal order: ${visitedNodes.join(" → ")}`,
  };
}

// DFS Algorithm
export function* dfs(nodes: GraphNode[], edges: GraphEdge[], startNode: string): Generator<GraphStep> {
  const adj = buildAdjacencyList(edges);
  const visited = new Set<string>();
  const stack: string[] = [startNode];
  const visitedNodes: string[] = [];
  const visitedEdges: { from: string; to: string }[] = [];

  yield {
    visitedNodes: [],
    currentNode: startNode,
    queue: [],
    stack: [startNode],
    distances: new Map(),
    path: [],
    visitedEdges: [],
    message: `Starting DFS from node ${startNode}`,
  };

  while (stack.length > 0) {
    const current = stack.pop()!;
    
    if (visited.has(current)) continue;
    visited.add(current);
    visitedNodes.push(current);

    yield {
      visitedNodes: [...visitedNodes],
      currentNode: current,
      queue: [],
      stack: [...stack],
      distances: new Map(),
      path: [],
      visitedEdges: [...visitedEdges],
      message: `Visiting node ${current}`,
    };

    const neighbors = adj.get(current) || [];
    for (const { node: neighbor } of [...neighbors].reverse()) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
        visitedEdges.push({ from: current, to: neighbor });
        
        yield {
          visitedNodes: [...visitedNodes],
          currentNode: current,
          queue: [],
          stack: [...stack],
          distances: new Map(),
          path: [],
          visitedEdges: [...visitedEdges],
          message: `Adding ${neighbor} to stack`,
        };
      }
    }
  }

  yield {
    visitedNodes: [...visitedNodes],
    currentNode: null,
    queue: [],
    stack: [],
    distances: new Map(),
    path: visitedNodes,
    visitedEdges: [...visitedEdges],
    message: `DFS Complete! Traversal order: ${visitedNodes.join(" → ")}`,
  };
}

// Dijkstra's Algorithm
export function* dijkstra(nodes: GraphNode[], edges: GraphEdge[], startNode: string): Generator<GraphStep> {
  const adj = buildAdjacencyList(edges);
  const distances = new Map<string, number>();
  const visited = new Set<string>();
  const visitedNodes: string[] = [];
  const visitedEdges: { from: string; to: string }[] = [];
  const previous = new Map<string, string>();

  // Initialize distances
  for (const node of nodes) {
    distances.set(node.id, node.id === startNode ? 0 : Infinity);
  }

  yield {
    visitedNodes: [],
    currentNode: startNode,
    queue: [],
    stack: [],
    distances: new Map(distances),
    path: [],
    visitedEdges: [],
    message: `Initializing distances. ${startNode} = 0, others = ∞`,
  };

  while (visited.size < nodes.length) {
    // Find minimum distance node
    let minDist = Infinity;
    let current: string | null = null;
    
    for (const [node, dist] of distances) {
      if (!visited.has(node) && dist < minDist) {
        minDist = dist;
        current = node;
      }
    }

    if (current === null || minDist === Infinity) break;

    visited.add(current);
    visitedNodes.push(current);

    yield {
      visitedNodes: [...visitedNodes],
      currentNode: current,
      queue: [],
      stack: [],
      distances: new Map(distances),
      path: [],
      visitedEdges: [...visitedEdges],
      message: `Processing node ${current} with distance ${minDist}`,
    };

    const neighbors = adj.get(current) || [];
    for (const { node: neighbor, weight } of neighbors) {
      if (!visited.has(neighbor)) {
        const newDist = (distances.get(current) || 0) + weight;
        const oldDist = distances.get(neighbor) || Infinity;
        
        if (newDist < oldDist) {
          distances.set(neighbor, newDist);
          previous.set(neighbor, current);
          visitedEdges.push({ from: current, to: neighbor });

          yield {
            visitedNodes: [...visitedNodes],
            currentNode: current,
            queue: [],
            stack: [],
            distances: new Map(distances),
            path: [],
            visitedEdges: [...visitedEdges],
            message: `Updated distance to ${neighbor}: ${oldDist === Infinity ? '∞' : oldDist} → ${newDist}`,
          };
        }
      }
    }
  }

  // Build shortest paths
  const shortestDistances = Array.from(distances.entries())
    .map(([node, dist]) => `${node}: ${dist === Infinity ? '∞' : dist}`)
    .join(', ');

  yield {
    visitedNodes: [...visitedNodes],
    currentNode: null,
    queue: [],
    stack: [],
    distances: new Map(distances),
    path: visitedNodes,
    visitedEdges: [...visitedEdges],
    message: `Dijkstra Complete! Shortest distances from ${startNode}: ${shortestDistances}`,
  };
}
