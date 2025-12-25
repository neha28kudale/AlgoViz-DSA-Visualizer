import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Search, GitBranch, TreePine, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import CategoryCard from "@/components/CategoryCard";
import HeroAnimation from "@/components/HeroAnimation";

const categories = [
  {
    title: "Sorting",
    description: "Bubble, Quick, Merge, Insertion, Selection, Heap",
    icon: BarChart3,
    count: 6,
    gradient: "gradient-sorting",
    path: "/sorting",
  },
  {
    title: "Searching",
    description: "Linear Search, Binary Search",
    icon: Search,
    count: 2,
    gradient: "gradient-searching",
    path: "/searching",
  },
  {
    title: "Graph",
    description: "BFS, DFS, Dijkstra's Shortest Path",
    icon: GitBranch,
    count: 3,
    gradient: "gradient-graph",
    path: "/graph",
  },
  {
    title: "Tree",
    description: "Inorder, Preorder, Postorder, Level Order",
    icon: TreePine,
    count: 4,
    gradient: "gradient-tree",
    path: "/tree",
  },
  {
    title: "Dynamic Programming",
    description: "Fibonacci, Knapsack, LCS",
    icon: Layers,
    count: 3,
    gradient: "gradient-dp",
    path: "/dp",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-body">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" />
        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
          <nav className="flex items-center justify-between mb-12">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-primary">
              AlgoViz
            </h1>
            <Button variant="outline" className="rounded-full" asChild>
              <Link to="/sorting">
                Start Learning <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Learn <span className="text-primary">Algorithms</span> Through{" "}
                <span className="text-secondary">Interactive</span> Visualizations
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                Watch sorting, searching, graph traversal, and dynamic programming 
                algorithms come alive with step-by-step animations.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="rounded-full text-lg px-8" asChild>
                  <Link to="/sorting">
                    Explore Algorithms <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="text-center">
                  <p className="font-display text-3xl font-bold text-primary">18</p>
                  <p className="text-sm text-muted-foreground">Algorithms</p>
                </div>
                <div className="h-10 w-px bg-border" />
                <div className="text-center">
                  <p className="font-display text-3xl font-bold text-secondary">5</p>
                  <p className="text-sm text-muted-foreground">Categories</p>
                </div>
                <div className="h-10 w-px bg-border" />
                <div className="text-center">
                  <p className="font-display text-3xl font-bold text-accent">∞</p>
                  <p className="text-sm text-muted-foreground">Fun</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <HeroAnimation />
            </div>
          </div>
        </div>
      </header>

      {/* Categories Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Choose Your Adventure
          </h3>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Dive into different algorithm categories and master DSA concepts 
            through visual learning
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.title}
              {...category}
              delay={index * 100}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground font-body">
            Built with 💜 for DSA learners everywhere
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
