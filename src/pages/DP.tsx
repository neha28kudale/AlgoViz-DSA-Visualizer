import { useState, useCallback, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import AlgorithmSelector from "@/components/AlgorithmSelector";
import VisualizerControls from "@/components/VisualizerControls";
import ComplexityBadge from "@/components/ComplexityBadge";
import DPTableCell from "@/components/DPTableCell";
import { DPInput } from "@/components/CustomInputs";
import { fibonacciDP, knapsackDP, lcsDP, DPStep, FibStep } from "@/lib/dpAlgorithms";

const algorithms = [
  { id: "fibonacci", name: "Fibonacci", time: "O(n)", space: "O(n)" },
  { id: "knapsack", name: "0/1 Knapsack", time: "O(n×W)", space: "O(n×W)" },
  { id: "lcs", name: "LCS", time: "O(m×n)", space: "O(m×n)" },
];

const DP = () => {
  const [selectedAlgo, setSelectedAlgo] = useState("fibonacci");
  const [dpStep, setDpStep] = useState<DPStep | null>(null);
  const [fibStep, setFibStep] = useState<FibStep | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);

  // Custom input states
  const [fibN, setFibN] = useState(8);
  const [knapsackData, setKnapsackData] = useState({
    weights: [2, 3, 4, 5],
    values: [3, 4, 5, 6],
    capacity: 5,
  });
  const [lcsData, setLcsData] = useState({ str1: "AGCAT", str2: "GAC" });

  const generatorRef = useRef<Generator<DPStep | FibStep> | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const selectedAlgorithm = algorithms.find((a) => a.id === selectedAlgo)!;

  const getGenerator = useCallback(() => {
    switch (selectedAlgo) {
      case "fibonacci":
        return fibonacciDP(fibN);
      case "knapsack":
        return knapsackDP(knapsackData.weights, knapsackData.values, knapsackData.capacity);
      case "lcs":
        return lcsDP(lcsData.str1, lcsData.str2);
      default:
        return fibonacciDP(fibN);
    }
  }, [selectedAlgo, fibN, knapsackData, lcsData]);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(false);
    setDpStep(null);
    setFibStep(null);
    generatorRef.current = null;
  }, []);

  const doStep = useCallback(() => {
    if (!generatorRef.current) {
      generatorRef.current = getGenerator() as Generator<DPStep | FibStep>;
    }

    const result = generatorRef.current.next();
    if (result.done) {
      setIsPlaying(false);
      return false;
    }

    if (selectedAlgo === "fibonacci") {
      setFibStep(result.value as FibStep);
    } else {
      setDpStep(result.value as DPStep);
    }
    return true;
  }, [getGenerator, selectedAlgo]);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        if (!doStep()) setIsPlaying(false);
      }, 1200 / speed);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, doStep]);

  const handleAlgoChange = useCallback(
    (id: string) => {
      reset();
      setSelectedAlgo(id);
    },
    [reset]
  );

  const renderFibonacci = () => {
    const memoValues = fibStep?.values || new Map();
    const fibNumbers = Array.from({ length: fibN + 1 }, (_, i) => i);

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap justify-center gap-2">
          {fibNumbers.map((n) => (
            <div
              key={n}
              className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${
                fibStep?.currentN === n
                  ? "bg-dp text-white scale-110 shadow-lg"
                  : fibStep?.computing.includes(n)
                  ? "bg-viz-comparing text-white"
                  : memoValues.has(n)
                  ? "bg-viz-sorted text-white"
                  : "bg-muted"
              }`}
            >
              <span className="text-xs font-medium opacity-75">F({n})</span>
              <span className="text-lg font-bold">
                {memoValues.has(n) ? memoValues.get(n) : "?"}
              </span>
            </div>
          ))}
        </div>

        {fibStep && fibStep.callStack.length > 0 && (
          <div className="flex justify-center">
            <div className="bg-muted/50 rounded-lg px-4 py-2">
              <span className="text-muted-foreground text-sm">Call Stack: </span>
              <span className="font-mono font-bold text-sm">
                {fibStep.callStack.map((n) => `F(${n})`).join(" → ")}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderKnapsack = () => {
    const table = dpStep?.table || [];

    return (
      <div className="overflow-x-auto">
        <div className="inline-block min-w-max">
          <div className="flex gap-1 mb-1">
            <div className="w-10 h-10 flex items-center justify-center text-xs text-muted-foreground" />
            {Array.from({ length: knapsackData.capacity + 1 }, (_, i) => (
              <div
                key={i}
                className="w-10 h-10 flex items-center justify-center text-xs font-medium text-muted-foreground bg-muted/50 rounded"
              >
                W={i}
              </div>
            ))}
          </div>

          {table.map((row, i) => (
            <div key={i} className="flex gap-1 mb-1">
              <div className="w-10 h-10 flex items-center justify-center text-xs font-medium text-muted-foreground bg-muted/50 rounded">
                {i === 0 ? "∅" : `I${i}`}
              </div>
              {row.map((value, j) => (
                <DPTableCell
                  key={j}
                  value={value}
                  row={i}
                  col={j}
                  isCurrent={dpStep?.currentCell?.row === i && dpStep?.currentCell?.col === j}
                  isHighlighted={dpStep?.highlightCells.some((c) => c.row === i && c.col === j) || false}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
          {knapsackData.weights.map((w, i) => (
            <div key={i} className="bg-muted/50 rounded px-2 py-1">
              Item {i + 1}: w={w}, v={knapsackData.values[i]}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLCS = () => {
    const table = dpStep?.table || [];

    return (
      <div className="overflow-x-auto">
        <div className="inline-block min-w-max">
          <div className="flex gap-1 mb-1">
            <div className="w-10 h-10" />
            <div className="w-10 h-10 flex items-center justify-center text-xs text-muted-foreground bg-muted/50 rounded">
              ∅
            </div>
            {lcsData.str2.split("").map((char, i) => (
              <div
                key={i}
                className="w-10 h-10 flex items-center justify-center text-sm font-bold text-secondary bg-muted/50 rounded"
              >
                {char}
              </div>
            ))}
          </div>

          {table.map((row, i) => (
            <div key={i} className="flex gap-1 mb-1">
              <div className="w-10 h-10 flex items-center justify-center text-sm font-bold text-primary bg-muted/50 rounded">
                {i === 0 ? "∅" : lcsData.str1[i - 1]}
              </div>
              {row.map((value, j) => (
                <DPTableCell
                  key={j}
                  value={value}
                  row={i}
                  col={j}
                  isCurrent={dpStep?.currentCell?.row === i && dpStep?.currentCell?.col === j}
                  isHighlighted={dpStep?.highlightCells.some((c) => c.row === i && c.col === j) || false}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-center gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">String 1: </span>
            <span className="font-mono font-bold text-primary">{lcsData.str1}</span>
          </div>
          <div>
            <span className="text-muted-foreground">String 2: </span>
            <span className="font-mono font-bold text-secondary">{lcsData.str2}</span>
          </div>
        </div>
      </div>
    );
  };

  const getMessage = () => {
    if (selectedAlgo === "fibonacci") {
      return fibStep?.message || "Press play to compute Fibonacci";
    }
    return dpStep?.message || "Press play to start DP visualization";
  };

  return (
    <Layout title="Dynamic Programming" gradient="gradient-dp">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <AlgorithmSelector
            algorithms={algorithms}
            selected={selectedAlgo}
            onSelect={handleAlgoChange}
            gradient="gradient-dp"
          />
          <ComplexityBadge
            time={selectedAlgorithm.time}
            space={selectedAlgorithm.space}
          />
        </div>

        {/* Custom Inputs */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-xl border border-border">
          {selectedAlgo === "fibonacci" && (
            <DPInput
              type="fibonacci"
              onFibChange={(n) => {
                reset();
                setFibN(n);
              }}
              currentValues={{ fibN }}
            />
          )}
          {selectedAlgo === "knapsack" && (
            <DPInput
              type="knapsack"
              onKnapsackChange={(weights, values, capacity) => {
                reset();
                setKnapsackData({ weights, values, capacity });
              }}
              currentValues={knapsackData}
            />
          )}
          {selectedAlgo === "lcs" && (
            <DPInput
              type="lcs"
              onLCSChange={(str1, str2) => {
                reset();
                setLcsData({ str1, str2 });
              }}
              currentValues={lcsData}
            />
          )}
        </div>

        <VisualizerControls
          isPlaying={isPlaying}
          onPlay={play}
          onPause={pause}
          onReset={reset}
          onStep={doStep}
          onShuffle={reset}
          speed={speed}
          onSpeedChange={setSpeed}
        />

        <div className="bg-card rounded-2xl border border-border p-6 min-h-[400px]">
          <div className="flex flex-col items-center justify-center">
            {selectedAlgo === "fibonacci" && renderFibonacci()}
            {selectedAlgo === "knapsack" && renderKnapsack()}
            {selectedAlgo === "lcs" && renderLCS()}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm font-medium text-muted-foreground min-h-[20px]">
              {getMessage()}
            </p>
          </div>

          {((selectedAlgo === "fibonacci" && fibStep?.result !== undefined) ||
            (selectedAlgo !== "fibonacci" && dpStep?.result !== undefined)) && (
            <div className="mt-4 flex justify-center">
              <div className="bg-viz-sorted text-white rounded-lg px-6 py-3">
                <span className="font-bold text-lg">
                  Result:{" "}
                  {selectedAlgo === "fibonacci" ? fibStep?.result : dpStep?.result}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-muted" />
            <span className="text-muted-foreground">Not computed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-dp" />
            <span className="text-muted-foreground">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-viz-comparing" />
            <span className="text-muted-foreground">Looking up</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-viz-sorted" />
            <span className="text-muted-foreground">Computed</span>
          </div>
        </div>

        <div className="bg-muted/30 rounded-xl p-4 text-center">
          <p className="text-sm text-muted-foreground">
            {selectedAlgo === "fibonacci" && "Memoization: Store computed values to avoid redundant calculations"}
            {selectedAlgo === "knapsack" && "Optimal Substructure: Max value at (i, w) depends on including or excluding item i"}
            {selectedAlgo === "lcs" && "Overlapping Subproblems: LCS(i, j) reuses LCS(i-1, j-1), LCS(i-1, j), LCS(i, j-1)"}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default DP;
