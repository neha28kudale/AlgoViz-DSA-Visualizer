import { useEffect, useState } from "react";

const HeroAnimation = () => {
  const [bars, setBars] = useState<number[]>([40, 70, 30, 90, 50, 80, 20, 60]);
  const [comparing, setComparing] = useState<number[]>([]);
  const [sorted, setSorted] = useState<number[]>([]);

  useEffect(() => {
    let step = 0;
    const animations = [
      { compare: [0, 1], swap: false },
      { compare: [1, 2], swap: true },
      { compare: [2, 3], swap: false },
      { compare: [3, 4], swap: true },
      { compare: [4, 5], swap: false },
      { compare: [5, 6], swap: true },
      { compare: [6, 7], swap: false },
    ];

    const interval = setInterval(() => {
      if (step >= animations.length) {
        setSorted([0, 1, 2, 3, 4, 5, 6, 7]);
        setTimeout(() => {
          setBars([40, 70, 30, 90, 50, 80, 20, 60]);
          setSorted([]);
          step = 0;
        }, 2000);
        return;
      }

      const { compare, swap } = animations[step];
      setComparing(compare);

      if (swap) {
        setBars((prev) => {
          const newBars = [...prev];
          [newBars[compare[0]], newBars[compare[1]]] = [newBars[compare[1]], newBars[compare[0]]];
          return newBars;
        });
      }

      step++;
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
      <div className="relative bg-card rounded-3xl p-8 shadow-xl border border-border">
        <div className="flex items-end justify-center gap-2 h-48">
          {bars.map((height, index) => (
            <div
              key={index}
              className={`w-8 rounded-t-lg transition-all duration-300 ${
                sorted.includes(index)
                  ? "bg-viz-sorted"
                  : comparing.includes(index)
                  ? "bg-viz-comparing"
                  : "bg-primary"
              }`}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <div className="mt-6 text-center">
          <p className="font-display text-lg font-semibold text-foreground">
            Bubble Sort in Action
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Comparing and swapping elements
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroAnimation;
