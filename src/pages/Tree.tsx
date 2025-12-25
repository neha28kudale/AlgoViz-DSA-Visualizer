import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import Layout from "@/components/Layout";
import AlgorithmSelector from "@/components/AlgorithmSelector";
import VisualizerControls from "@/components/VisualizerControls";
import ComplexityBadge from "@/components/ComplexityBadge";
import TreeNodeComponent from "@/components/TreeNode";
import TreeEdgeComponent from "@/components/TreeEdge";
import {
  createSampleTree,
  calculateTreePositions,
  inorderTraversal,
  preorderTraversal,
  postorderTraversal,
  levelOrderTraversal,
  flattenTree,
  getTreeEdges,
  TreeStep,
} from "@/lib/treeAlgorithms";

const algorithms = [
  { id: "inorder", name: "Inorder", time: "O(n)", space: "O(h)" },
  { id: "preorder", name: "Preorder", time: "O(n)", space: "O(h)" },
  { id: "postorder", name: "Postorder", time: "O(n)", space: "O(h)" },
  { id: "levelorder", name: "Level Order", time: "O(n)", space: "O(w)" },
];

const Tree = () => {
  const [selectedAlgo, setSelectedAlgo] = useState("inorder");
  const [step, setStep] = useState<TreeStep | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);

  const generatorRef = useRef<Generator<TreeStep> | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const tree = useMemo(() => createSampleTree(), []);
  const positions = useMemo(() => calculateTreePositions(tree, 400, 320), [tree]);
  const nodes = useMemo(() => flattenTree(tree), [tree]);
  const edges = useMemo(() => getTreeEdges(tree), [tree]);

  const selectedAlgorithm = algorithms.find((a) => a.id === selectedAlgo)!;

  const getGenerator = useCallback(() => {
    switch (selectedAlgo) {
      case "inorder":
        return inorderTraversal(tree);
      case "preorder":
        return preorderTraversal(tree);
      case "postorder":
        return postorderTraversal(tree);
      case "levelorder":
        return levelOrderTraversal(tree);
      default:
        return inorderTraversal(tree);
    }
  }, [selectedAlgo, tree]);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(false);
    setStep(null);
    generatorRef.current = null;
  }, []);

  const doStep = useCallback(() => {
    if (!generatorRef.current) {
      generatorRef.current = getGenerator();
    }

    const result = generatorRef.current.next();
    if (result.done) {
      setIsPlaying(false);
      return false;
    }

    setStep(result.value);
    return true;
  }, [getGenerator]);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        if (!doStep()) setIsPlaying(false);
      }, 1000 / speed);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, doStep]);

  const handleAlgoChange = useCallback(
    (id: string) => {
      reset();
      setSelectedAlgo(id);
    },
    [reset]
  );

  const isEdgeHighlighted = (from: string, to: string) => {
    if (!step?.highlightEdge) return false;
    return step.highlightEdge.from === from && step.highlightEdge.to === to;
  };

  const isEdgeVisited = (from: string, to: string) => {
    if (!step) return false;
    return step.visitedNodes.includes(from) && step.visitedNodes.includes(to);
  };

  return (
    <Layout title="Tree Traversals" gradient="gradient-tree">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <AlgorithmSelector
            algorithms={algorithms}
            selected={selectedAlgo}
            onSelect={handleAlgoChange}
            gradient="gradient-tree"
          />
          <ComplexityBadge
            time={selectedAlgorithm.time}
            space={selectedAlgorithm.space}
          />
        </div>

        <VisualizerControls
          isPlaying={isPlaying}
          onPlay={play}
          onPause={pause}
          onReset={reset}
          onStep={doStep}
          onShuffle={reset}
          speed={speed}
          onSpeedChange={setSpeed}
        />

        <div className="bg-card rounded-2xl border border-border p-6 min-h-[400px]">
          <svg
            viewBox="0 0 400 320"
            className="w-full max-w-lg mx-auto"
            style={{ maxHeight: "320px" }}
          >
            {/* Edges */}
            {edges.map((edge, i) => {
              const fromPos = positions.get(edge.from);
              const toPos = positions.get(edge.to);
              if (!fromPos || !toPos) return null;
              return (
                <TreeEdgeComponent
                  key={i}
                  fromX={fromPos.x}
                  fromY={fromPos.y}
                  toX={toPos.x}
                  toY={toPos.y}
                  isHighlighted={isEdgeHighlighted(edge.from, edge.to)}
                  isVisited={isEdgeVisited(edge.from, edge.to)}
                />
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const pos = positions.get(node.id);
              if (!pos) return null;
              return (
                <TreeNodeComponent
                  key={node.id}
                  id={node.id}
                  value={node.value}
                  x={pos.x}
                  y={pos.y}
                  isVisited={step?.visitedNodes.includes(node.id) || false}
                  isCurrent={step?.currentNode === node.id}
                />
              );
            })}
          </svg>

          {/* Status message */}
          <div className="mt-4 text-center">
            <p className="text-sm font-medium text-muted-foreground min-h-[20px]">
              {step?.message || "Press play to start traversal"}
            </p>
          </div>

          {/* Traversal path */}
          {step && step.path.length > 0 && (
            <div className="mt-4 flex justify-center">
              <div className="bg-muted/50 rounded-lg px-4 py-2">
                <span className="text-muted-foreground text-sm">
                  Traversal Order:{" "}
                </span>
                <span className="font-mono font-bold text-sm">
                  {step.path.join(" → ")}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-card border-2 border-border" />
            <span className="text-muted-foreground">Unvisited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-tree" />
            <span className="text-muted-foreground">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-viz-visited" />
            <span className="text-muted-foreground">Visited</span>
          </div>
        </div>

        {/* Traversal explanation */}
        <div className="bg-muted/30 rounded-xl p-4 text-center">
          <p className="text-sm text-muted-foreground">
            {selectedAlgo === "inorder" && "Inorder: Left → Root → Right (gives sorted order for BST)"}
            {selectedAlgo === "preorder" && "Preorder: Root → Left → Right (useful for copying trees)"}
            {selectedAlgo === "postorder" && "Postorder: Left → Right → Root (useful for deleting trees)"}
            {selectedAlgo === "levelorder" && "Level Order: BFS traversal, level by level (uses Queue)"}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Tree;
