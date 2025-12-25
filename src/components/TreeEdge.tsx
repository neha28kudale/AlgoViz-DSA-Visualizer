import { cn } from "@/lib/utils";

interface TreeEdgeComponentProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  isHighlighted: boolean;
  isVisited: boolean;
}

const TreeEdgeComponent = ({
  fromX,
  fromY,
  toX,
  toY,
  isHighlighted,
  isVisited,
}: TreeEdgeComponentProps) => {
  return (
    <line
      x1={fromX}
      y1={fromY + 22}
      x2={toX}
      y2={toY - 22}
      className={cn(
        "transition-all duration-300",
        isHighlighted
          ? "stroke-tree stroke-[3]"
          : isVisited
          ? "stroke-viz-visited stroke-2"
          : "stroke-border stroke-2"
      )}
    />
  );
};

export default TreeEdgeComponent;
