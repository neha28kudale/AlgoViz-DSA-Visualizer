import { cn } from "@/lib/utils";
import { GraphNode, GraphEdge } from "@/lib/graphAlgorithms";

interface GraphEdgeComponentProps {
  edge: GraphEdge;
  nodes: GraphNode[];
  isVisited: boolean;
  isHighlighted: boolean;
}

const GraphEdgeComponent = ({
  edge,
  nodes,
  isVisited,
  isHighlighted,
}: GraphEdgeComponentProps) => {
  const fromNode = nodes.find((n) => n.id === edge.from);
  const toNode = nodes.find((n) => n.id === edge.to);

  if (!fromNode || !toNode) return null;

  const midX = (fromNode.x + toNode.x) / 2;
  const midY = (fromNode.y + toNode.y) / 2;

  return (
    <g>
      <line
        x1={fromNode.x}
        y1={fromNode.y}
        x2={toNode.x}
        y2={toNode.y}
        className={cn(
          "transition-all duration-300",
          isHighlighted
            ? "stroke-viz-current stroke-[3]"
            : isVisited
            ? "stroke-viz-visited stroke-2"
            : "stroke-border stroke-2"
        )}
      />
      
      {/* Weight label */}
      {edge.weight && (
        <g>
          <circle
            cx={midX}
            cy={midY}
            r={12}
            className="fill-background stroke-border"
          />
          <text
            x={midX}
            y={midY}
            textAnchor="middle"
            dominantBaseline="central"
            className="text-xs font-mono fill-muted-foreground"
          >
            {edge.weight}
          </text>
        </g>
      )}
    </g>
  );
};

export default GraphEdgeComponent;
