import { useState, useCallback, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import AlgorithmSelector from "@/components/AlgorithmSelector";
import VisualizerControls from "@/components/VisualizerControls";
import ComplexityBadge from "@/components/ComplexityBadge";
import CustomArrayInput from "@/components/CustomArrayInput";
import { Input } from "@/components/ui/input";
import { linearSearch, binarySearch, SearchStep } from "@/lib/searchingAlgorithms";
import { cn } from "@/lib/utils";

const algorithms = [
  { id: "linear", name: "Linear Search", time: "O(n)", space: "O(1)" },
  { id: "binary", name: "Binary Search", time: "O(log n)", space: "O(1)" },
];

const generateRandomArray = (size = 12) => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1);
};

const Searching = () => {
  const [selectedAlgo, setSelectedAlgo] = useState("linear");
  const [array, setArray] = useState(() => generateRandomArray());
  const [displayArray, setDisplayArray] = useState<number[]>(array);
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState<number>(-1);
  const [left, setLeft] = useState<number | undefined>();
  const [right, setRight] = useState<number | undefined>();
  const [found, setFound] = useState<boolean | null>(null);
  const [checked, setChecked] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);

  const generatorRef = useRef<Generator<SearchStep> | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const selectedAlgorithm = algorithms.find((a) => a.id === selectedAlgo)!;

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsPlaying(false);
    setCurrent(-1);
    setLeft(undefined);
    setRight(undefined);
    setFound(null);
    setChecked([]);
    generatorRef.current = null;
    setDisplayArray(selectedAlgo === "binary" ? [...array].sort((a, b) => a - b) : array);
  }, [array, selectedAlgo]);

  const step = useCallback(() => {
    const targetNum = parseInt(target);
    if (isNaN(targetNum)) return false;

    if (!generatorRef.current) {
      const arr = selectedAlgo === "binary" ? [...array].sort((a, b) => a - b) : array;
      setDisplayArray(arr);
      generatorRef.current = selectedAlgo === "linear" 
        ? linearSearch(arr, targetNum)
        : binarySearch(array, targetNum);
    }

    const result = generatorRef.current.next();

    if (result.done) {
      setIsPlaying(false);
      return false;
    }

    const { current: curr, left: l, right: r, found: f, checked: c, array: arr } = result.value;
    setDisplayArray(arr);
    setCurrent(curr);
    setLeft(l);
    setRight(r);
    setChecked(c);
    
    if (f !== undefined && curr !== -1 && f) {
      setFound(true);
      setIsPlaying(false);
      return false;
    } else if (result.value.current === -1) {
      setFound(false);
      setIsPlaying(false);
      return false;
    }
    
    return true;
  }, [array, selectedAlgo, target]);

  const play = useCallback(() => {
    if (!target || isNaN(parseInt(target))) return;
    setIsPlaying(true);
  }, [target]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        const continued = step();
        if (!continued) {
          setIsPlaying(false);
        }
      }, 1000 / speed);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, speed, step]);

  const shuffle = useCallback(() => {
    reset();
    const newArray = generateRandomArray();
    setArray(newArray);
    setDisplayArray(selectedAlgo === "binary" ? [...newArray].sort((a, b) => a - b) : newArray);
  }, [reset, selectedAlgo]);

  const handleAlgoChange = useCallback((id: string) => {
    reset();
    setSelectedAlgo(id);
    setDisplayArray(id === "binary" ? [...array].sort((a, b) => a - b) : array);
  }, [reset, array]);

  const getCellState = (index: number) => {
    if (found && current === index) return "found";
    if (current === index) return "current";
    if (checked.includes(index)) return "checked";
    if (left !== undefined && right !== undefined && index >= left && index <= right) return "range";
    return "default";
  };

  return (
    <Layout title="Searching Algorithms" gradient="gradient-searching">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <AlgorithmSelector
            algorithms={algorithms}
            selected={selectedAlgo}
            onSelect={handleAlgoChange}
            gradient="gradient-searching"
          />
          <ComplexityBadge
            time={selectedAlgorithm.time}
            space={selectedAlgorithm.space}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-xl border border-border">
          <span className="text-sm font-medium">Custom Array:</span>
          <CustomArrayInput
            onSubmit={(values) => {
              reset();
              setArray(values);
              setDisplayArray(selectedAlgo === "binary" ? [...values].sort((a, b) => a - b) : values);
            }}
            placeholder="e.g., 15, 23, 8, 42, 16"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-xl border border-border">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Target:</span>
            <Input
              type="number"
              value={target}
              onChange={(e) => {
                setTarget(e.target.value.slice(0, 3));
                reset();
              }}
              placeholder="Enter number"
              className="w-32"
            />
          </div>
          {selectedAlgo === "binary" && (
            <p className="text-sm text-muted-foreground">
              (Array will be sorted for binary search)
            </p>
          )}
          <span className="text-xs text-muted-foreground">
            Array: [{displayArray.slice(0, 5).join(", ")}{displayArray.length > 5 ? ", ..." : ""}]
          </span>
        </div>

        <VisualizerControls
          isPlaying={isPlaying}
          onPlay={play}
          onPause={pause}
          onReset={reset}
          onStep={step}
          onShuffle={shuffle}
          speed={speed}
          onSpeedChange={setSpeed}
          disabled={!target || isNaN(parseInt(target))}
        />

        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex flex-wrap justify-center gap-2">
            {displayArray.map((value, index) => (
              <div
                key={index}
                className={cn(
                  "w-16 h-16 flex items-center justify-center rounded-xl text-lg font-bold transition-all duration-200",
                  getCellState(index) === "found" && "bg-viz-sorted text-white scale-110 shadow-lg",
                  getCellState(index) === "current" && "bg-viz-current text-white scale-105",
                  getCellState(index) === "checked" && "bg-muted text-muted-foreground",
                  getCellState(index) === "range" && "bg-secondary text-secondary-foreground",
                  getCellState(index) === "default" && "bg-primary/20 text-foreground"
                )}
              >
                {value}
              </div>
            ))}
          </div>

          {found !== null && (
            <div className={cn(
              "mt-6 text-center p-4 rounded-xl",
              found ? "bg-viz-sorted/20 text-viz-sorted" : "bg-destructive/20 text-destructive"
            )}>
              <p className="text-lg font-bold">
                {found ? `🎉 Found ${target} at index ${current}!` : `😔 ${target} not found in array`}
              </p>
            </div>
          )}

          {left !== undefined && right !== undefined && current >= 0 && !found && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Search range: [{left}, {right}] | Checking index: {current}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary/20" />
            <span className="text-muted-foreground">Unchecked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-viz-current" />
            <span className="text-muted-foreground">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-muted" />
            <span className="text-muted-foreground">Checked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-viz-sorted" />
            <span className="text-muted-foreground">Found</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Searching;
