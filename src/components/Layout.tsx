import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  gradient?: string;
}

const Layout = ({ children, title, gradient = "gradient-sorting" }: LayoutProps) => {
  const location = useLocation();
  
  const navItems = [
    { path: "/sorting", label: "Sorting", gradient: "gradient-sorting" },
    { path: "/searching", label: "Searching", gradient: "gradient-searching" },
    { path: "/graph", label: "Graph", gradient: "gradient-graph" },
    { path: "/tree", label: "Tree", gradient: "gradient-tree" },
    { path: "/dp", label: "DP", gradient: "gradient-dp" },
  ];

  return (
    <div className="min-h-screen bg-background font-body">
      <header className={cn("relative overflow-hidden", gradient)}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 py-6 relative z-10">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                asChild
              >
                <Link to="/">
                  <Home className="h-5 w-5" />
                </Link>
              </Button>
              <h1 className="font-display text-2xl font-bold text-white">
                {title}
              </h1>
            </div>
            
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "text-white/80 hover:text-white hover:bg-white/20 rounded-full",
                    location.pathname === item.path && "bg-white/20 text-white"
                  )}
                  asChild
                >
                  <Link to={item.path}>{item.label}</Link>
                </Button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
