import { cn } from "@/lib/utils";

interface DPTableCellProps {
  value: number;
  row: number;
  col: number;
  isCurrent: boolean;
  isHighlighted: boolean;
  rowLabel?: string;
  colLabel?: string;
}

const DPTableCell = ({
  value,
  row,
  col,
  isCurrent,
  isHighlighted,
}: DPTableCellProps) => {
  return (
    <div
      className={cn(
        "w-10 h-10 flex items-center justify-center text-sm font-mono border transition-all duration-200",
        isCurrent
          ? "bg-dp text-white border-dp scale-110 shadow-lg z-10"
          : isHighlighted
          ? "bg-viz-comparing/20 border-viz-comparing"
          : "bg-card border-border"
      )}
    >
      {value}
    </div>
  );
};

export default DPTableCell;
