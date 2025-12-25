import { useState, useCallback, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import AlgorithmSelector from "@/components/AlgorithmSelector";
import VisualizerControls from "@/components/VisualizerControls";
import ComplexityBadge from "@/components/ComplexityBadge";
import ArrayBar from "@/components/ArrayBar";
import CustomArrayInput from "@/components/CustomArrayInput";
import {
  bubbleSort,
  selectionSort,
  insertionSort,
  quickSort,
  mergeSort,
  heapSort,
  SortingStep,
} from "@/lib/sortingAlgorithms";
const algorithms = [
  { id: "bubble", name: "Bubble Sort", time: "O(n²)", space: "O(1)" },
  { id: "selection", name: "Selection Sort", time: "O(n²)", space: "O(1)" },
  { id: "insertion", name: "Insertion Sort", time: "O(n²)", space: "O(1)" },
  { id: "quick", name: "Quick Sort", time: "O(n log n)", space: "O(log n)" },
  { id: "merge", name: "Merge Sort", time: "O(n log n)", space: "O(n)" },
  { id: "heap", name: "Heap Sort", time: "O(n log n)", space: "O(1)" },
];

const generateRandomArray = (size = 15) => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
};

const Sorting = () => {
  const [selectedAlgo, setSelectedAlgo] = useState("bubble");
  const [array, setArray] = useState(() => generateRandomArray());
  const [comparing, setComparing] = useState<number[]>([]);
  const [swapping, setSwapping] = useState<number[]>([]);
  const [sorted, setSorted] = useState<number[]>([]);
  const [pivot, setPivot] = useState<number | undefined>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);

  const generatorRef = useRef<Generator<SortingStep> | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const selectedAlgorithm = algorithms.find((a) => a.id === selectedAlgo)!;

  const getGenerator = useCallback((arr: number[]) => {
    switch (selectedAlgo) {
      case "bubble":
        return bubbleSort(arr);
      case "selection":
        return selectionSort(arr);
      case "insertion":
        return insertionSort(arr);
      case "quick":
        return quickSort([...arr]);
      case "merge":
        return mergeSort([...arr]);
      case "heap":
        return heapSort(arr);
      default:
        return bubbleSort(arr);
    }
  }, [selectedAlgo]);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsPlaying(false);
    setComparing([]);
    setSwapping([]);
    setSorted([]);
    setPivot(undefined);
    generatorRef.current = null;
  }, []);

  const step = useCallback(() => {
    if (!generatorRef.current) {
      generatorRef.current = getGenerator(array);
    }

    const result = generatorRef.current.next();

    if (result.done) {
      setIsPlaying(false);
      setSorted(Array.from({ length: array.length }, (_, i) => i));
      return false;
    }

    const { array: newArray, comparing: comp, swapping: swap, sorted: sort, pivot: piv } = result.value;
    setArray(newArray);
    setComparing(comp);
    setSwapping(swap);
    setSorted(sort);
    setPivot(piv);
    return true;
  }, [array, getGenerator]);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

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
    setArray(generateRandomArray());
  }, [reset]);

  const handleAlgoChange = useCallback((id: string) => {
    reset();
    setSelectedAlgo(id);
  }, [reset]);

  const getBarState = (index: number) => {
    if (sorted.includes(index)) return "sorted";
    if (swapping.includes(index)) return "swapping";
    if (comparing.includes(index)) return "comparing";
    if (pivot === index) return "pivot";
    return "default";
  };

  const maxValue = Math.max(...array);

  return (
    <Layout title="Sorting Algorithms" gradient="gradient-sorting">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <AlgorithmSelector
            algorithms={algorithms}
            selected={selectedAlgo}
            onSelect={handleAlgoChange}
            gradient="gradient-sorting"
          />
          <ComplexityBadge
            time={selectedAlgorithm.time}
            space={selectedAlgorithm.space}
          />
        </div>

        {/* Custom Array Input */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-xl border border-border">
          <span className="text-sm font-medium">Custom Array:</span>
          <CustomArrayInput
            onSubmit={(values) => {
              reset();
              setArray(values);
            }}
            placeholder="e.g., 45, 12, 78, 33, 56"
          />
          <span className="text-xs text-muted-foreground">
            Current: [{array.slice(0, 5).join(", ")}{array.length > 5 ? ", ..." : ""}]
          </span>
        </div>

        <VisualizerControls
          isPlaying={isPlaying}
          onPlay={play}
          onPause={pause}
          onReset={() => { reset(); generatorRef.current = null; }}
          onStep={step}
          onShuffle={shuffle}
          speed={speed}
          onSpeedChange={setSpeed}
        />

        <div className="bg-card rounded-2xl border border-border p-6 min-h-[400px]">
          <div className="flex items-end justify-center gap-1 h-80">
            {array.map((value, index) => (
              <div key={index} className="flex-1 max-w-12 h-full flex flex-col justify-end">
                <ArrayBar
                  value={value}
                  maxValue={maxValue}
                  state={getBarState(index)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary" />
            <span className="text-muted-foreground">Unsorted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-viz-comparing" />
            <span className="text-muted-foreground">Comparing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-viz-swapping" />
            <span className="text-muted-foreground">Swapping</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-viz-sorted" />
            <span className="text-muted-foreground">Sorted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-viz-pivot" />
            <span className="text-muted-foreground">Pivot</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Sorting;
