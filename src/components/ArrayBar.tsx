import { cn } from "@/lib/utils";

interface ArrayBarProps {
  value: number;
  maxValue: number;
  state: "default" | "comparing" | "swapping" | "sorted" | "pivot" | "current";
  showValue?: boolean;
}

const ArrayBar = ({ value, maxValue, state, showValue = true }: ArrayBarProps) => {
  const heightPercent = (value / maxValue) * 100;

  const stateColors = {
    default: "bg-primary",
    comparing: "bg-viz-comparing",
    swapping: "bg-viz-swapping",
    sorted: "bg-viz-sorted",
    pivot: "bg-viz-pivot",
    current: "bg-viz-current",
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          "w-full rounded-t-lg transition-all duration-200",
          stateColors[state]
        )}
        style={{ height: `${heightPercent}%`, minHeight: "20px" }}
      />
      {showValue && (
        <span className="text-xs font-medium text-muted-foreground">{value}</span>
      )}
    </div>
  );
};

export default ArrayBar;
