import { cn } from "@/lib/utils";

interface TreeNodeComponentProps {
  id: string;
  value: number;
  x: number;
  y: number;
  isVisited: boolean;
  isCurrent: boolean;
}

const TreeNodeComponent = ({
  id,
  value,
  x,
  y,
  isVisited,
  isCurrent,
}: TreeNodeComponentProps) => {
  return (
    <g className="transition-all duration-300">
      {/* Glow effect for current node */}
      {isCurrent && (
        <circle
          cx={x}
          cy={y}
          r={28}
          className="fill-tree/30 animate-pulse"
        />
      )}
      
      {/* Main node circle */}
      <circle
        cx={x}
        cy={y}
        r={22}
        className={cn(
          "transition-all duration-300 stroke-2",
          isCurrent
            ? "fill-tree stroke-tree"
            : isVisited
            ? "fill-viz-visited stroke-viz-visited"
            : "fill-card stroke-border"
        )}
      />
      
      {/* Node value */}
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        className={cn(
          "text-sm font-bold pointer-events-none",
          isCurrent || isVisited ? "fill-white" : "fill-foreground"
        )}
      >
        {value}
      </text>
    </g>
  );
};

export default TreeNodeComponent;
