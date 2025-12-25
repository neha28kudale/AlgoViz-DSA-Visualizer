import { useState, useCallback, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import AlgorithmSelector from "@/components/AlgorithmSelector";
import VisualizerControls from "@/components/VisualizerControls";
import ComplexityBadge from "@/components/ComplexityBadge";
import GraphNodeComponent from "@/components/GraphNode";
import GraphEdgeComponent from "@/components/GraphEdge";
import { GraphInput } from "@/components/CustomInputs";
import {
  sampleGraph,
  bfs,
  dfs,
  dijkstra,
  GraphStep,
} from "@/lib/graphAlgorithms";

const algorithms = [
  { id: "bfs", name: "BFS", time: "O(V + E)", space: "O(V)" },
  { id: "dfs", name: "DFS", time: "O(V + E)", space: "O(V)" },
  { id: "dijkstra", name: "Dijkstra", time: "O(V² or V log V)", space: "O(V)" },
];

const Graph = () => {
  const [selectedAlgo, setSelectedAlgo] = useState("bfs");
  const [startNode, setStartNode] = useState("A");
  const [step, setStep] = useState<GraphStep | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);

  const generatorRef = useRef<Generator<GraphStep> | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const selectedAlgorithm = algorithms.find((a) => a.id === selectedAlgo)!;

  const getGenerator = useCallback(() => {
    switch (selectedAlgo) {
      case "bfs":
        return bfs(sampleGraph.nodes, sampleGraph.edges, startNode);
      case "dfs":
        return dfs(sampleGraph.nodes, sampleGraph.edges, startNode);
      case "dijkstra":
        return dijkstra(sampleGraph.nodes, sampleGraph.edges, startNode);
      default:
        return bfs(sampleGraph.nodes, sampleGraph.edges, startNode);
    }
  }, [selectedAlgo, startNode]);

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

  const isEdgeVisited = (from: string, to: string) => {
    if (!step) return false;
    return step.visitedEdges.some(
      (e) => (e.from === from && e.to === to) || (e.from === to && e.to === from)
    );
  };

  return (
    <Layout title="Graph Algorithms" gradient="gradient-graph">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <AlgorithmSelector
            algorithms={algorithms}
            selected={selectedAlgo}
            onSelect={handleAlgoChange}
            gradient="gradient-graph"
          />
          <ComplexityBadge
            time={selectedAlgorithm.time}
            space={selectedAlgorithm.space}
          />
        </div>

        {/* Start Node Selector */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-xl border border-border">
          <GraphInput
            nodes={sampleGraph.nodes.map((n) => n.id)}
            selectedStart={startNode}
            onStartChange={(node) => {
              reset();
              setStartNode(node);
            }}
          />
          <span className="text-xs text-muted-foreground">
            Select which node to start traversal from
          </span>
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
            viewBox="0 0 400 340"
            className="w-full max-w-lg mx-auto"
            style={{ maxHeight: "340px" }}
          >
            {/* Edges */}
            {sampleGraph.edges.map((edge, i) => (
              <GraphEdgeComponent
                key={i}
                edge={edge}
                nodes={sampleGraph.nodes}
                isVisited={isEdgeVisited(edge.from, edge.to)}
                isHighlighted={false}
              />
            ))}

            {/* Nodes */}
            {sampleGraph.nodes.map((node) => (
              <GraphNodeComponent
                key={node.id}
                node={node}
                isVisited={step?.visitedNodes.includes(node.id) || false}
                isCurrent={step?.currentNode === node.id}
                isInPath={step?.path.includes(node.id) || false}
                distance={
                  selectedAlgo === "dijkstra"
                    ? step?.distances.get(node.id)
                    : undefined
                }
              />
            ))}
          </svg>

          {/* Status message */}
          <div className="mt-4 text-center">
            <p className="text-sm font-medium text-muted-foreground min-h-[20px]">
              {step?.message || "Press play to start visualization"}
            </p>
          </div>

          {/* Data structures visualization */}
          {step && (
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
              {selectedAlgo === "bfs" && step.queue.length > 0 && (
                <div className="bg-muted/50 rounded-lg px-4 py-2">
                  <span className="text-muted-foreground">Queue: </span>
                  <span className="font-mono font-bold">
                    [{step.queue.join(", ")}]
                  </span>
                </div>
              )}
              {selectedAlgo === "dfs" && step.stack.length > 0 && (
                <div className="bg-muted/50 rounded-lg px-4 py-2">
                  <span className="text-muted-foreground">Stack: </span>
                  <span className="font-mono font-bold">
                    [{step.stack.join(", ")}]
                  </span>
                </div>
              )}
              {step.visitedNodes.length > 0 && (
                <div className="bg-muted/50 rounded-lg px-4 py-2">
                  <span className="text-muted-foreground">Visited: </span>
                  <span className="font-mono font-bold">
                    {step.visitedNodes.join(" → ")}
                  </span>
                </div>
              )}
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
            <div className="w-4 h-4 rounded-full bg-viz-current" />
            <span className="text-muted-foreground">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-viz-visited" />
            <span className="text-muted-foreground">Visited</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Graph;
