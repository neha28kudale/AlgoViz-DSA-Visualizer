import { cn } from "@/lib/utils";
import { GraphNode } from "@/lib/graphAlgorithms";

interface GraphNodeComponentProps {
  node: GraphNode;
  isVisited: boolean;
  isCurrent: boolean;
  isInPath: boolean;
  distance?: number;
}

const GraphNodeComponent = ({
  node,
  isVisited,
  isCurrent,
  isInPath,
  distance,
}: GraphNodeComponentProps) => {
  return (
    <g>
      {/* Glow effect for current node */}
      {isCurrent && (
        <circle
          cx={node.x}
          cy={node.y}
          r={32}
          className="fill-viz-current/30 animate-pulse"
        />
      )}
      
      {/* Main node circle */}
      <circle
        cx={node.x}
        cy={node.y}
        r={24}
        className={cn(
          "transition-all duration-300 stroke-2",
          isCurrent
            ? "fill-viz-current stroke-viz-current"
            : isInPath
            ? "fill-viz-path stroke-viz-path"
            : isVisited
            ? "fill-viz-visited stroke-viz-visited"
            : "fill-card stroke-border"
        )}
      />
      
      {/* Node label */}
      <text
        x={node.x}
        y={node.y}
        textAnchor="middle"
        dominantBaseline="central"
        className={cn(
          "text-sm font-bold pointer-events-none",
          isCurrent || isVisited || isInPath
            ? "fill-white"
            : "fill-foreground"
        )}
      >
        {node.label}
      </text>
      
      {/* Distance label for Dijkstra */}
      {distance !== undefined && (
        <text
          x={node.x}
          y={node.y + 35}
          textAnchor="middle"
          className="text-xs font-mono fill-muted-foreground"
        >
          {distance === Infinity ? "∞" : distance}
        </text>
      )}
    </g>
  );
};

export default GraphNodeComponent;
