import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ComplexityBadgeProps {
  time: string;
  space: string;
  className?: string;
}

const ComplexityBadge = ({ time, space, className }: ComplexityBadgeProps) => {
  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      <Badge variant="secondary" className="font-mono text-xs">
        Time: {time}
      </Badge>
      <Badge variant="outline" className="font-mono text-xs">
        Space: {space}
      </Badge>
    </div>
  );
};

export default ComplexityBadge;
