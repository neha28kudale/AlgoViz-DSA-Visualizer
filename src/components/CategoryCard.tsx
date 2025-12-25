import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  count: number;
  gradient: string;
  path: string;
  delay?: number;
}

const CategoryCard = ({
  title,
  description,
  icon: Icon,
  count,
  gradient,
  path,
  delay = 0,
}: CategoryCardProps) => {
  return (
    <Link
      to={path}
      className={cn(
        "group relative overflow-hidden rounded-2xl p-6 transition-all duration-300",
        "hover:scale-105 hover:shadow-2xl",
        "animate-slide-up"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={cn("absolute inset-0", gradient)} />
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
      
      <div className="relative z-10 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Icon className="h-6 w-6" />
          </div>
          <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
            {count} algorithms
          </span>
        </div>
        
        <h4 className="font-display text-2xl font-bold mb-2">{title}</h4>
        <p className="text-white/80 text-sm leading-relaxed">{description}</p>
        
        <div className="mt-4 flex items-center text-sm font-medium">
          <span className="group-hover:translate-x-2 transition-transform">
            Explore →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
