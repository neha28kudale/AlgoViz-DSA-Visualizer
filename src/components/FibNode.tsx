import { cn } from "@/lib/utils";

interface FibNodeProps {
  n: number;
  value?: number;
  isComputing: boolean;
  isCurrent: boolean;
  x: number;
  y: number;
}

const FibNode = ({ n, value, isComputing, isCurrent, x, y }: FibNodeProps) => {
  return (
    <g className="transition-all duration-300">
      {isCurrent && (
        <circle
          cx={x}
          cy={y}
          r={24}
          className="fill-dp/30 animate-pulse"
        />
      )}
      
      <circle
        cx={x}
        cy={y}
        r={18}
        className={cn(
          "transition-all duration-200 stroke-2",
          isCurrent
            ? "fill-dp stroke-dp"
            : isComputing
            ? "fill-viz-comparing stroke-viz-comparing"
            : value !== undefined
            ? "fill-viz-sorted stroke-viz-sorted"
            : "fill-card stroke-border"
        )}
      />
      
      <text
        x={x}
        y={y - 3}
        textAnchor="middle"
        className={cn(
          "text-xs font-bold",
          isCurrent || isComputing || value !== undefined
            ? "fill-white"
            : "fill-foreground"
        )}
      >
        F({n})
      </text>
      
      {value !== undefined && (
        <text
          x={x}
          y={y + 8}
          textAnchor="middle"
          className="text-[10px] fill-white/80"
        >
          = {value}
        </text>
      )}
    </g>
  );
};

export default FibNode;
