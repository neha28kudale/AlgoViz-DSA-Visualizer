import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface AlgorithmSelectorProps {
  algorithms: {
    id: string;
    name: string;
    icon?: LucideIcon;
    time: string;
    space: string;
  }[];
  selected: string;
  onSelect: (id: string) => void;
  gradient?: string;
}

const AlgorithmSelector = ({
  algorithms,
  selected,
  onSelect,
  gradient = "bg-primary",
}: AlgorithmSelectorProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {algorithms.map((algo) => (
        <button
          key={algo.id}
          onClick={() => onSelect(algo.id)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
            selected === algo.id
              ? cn(gradient, "text-white shadow-lg scale-105")
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          {algo.name}
        </button>
      ))}
    </div>
  );
};

export default AlgorithmSelector;
