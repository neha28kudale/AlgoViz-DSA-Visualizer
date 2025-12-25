import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { z } from "zod";

interface GraphInputProps {
  nodes: string[];
  selectedStart: string;
  onStartChange: (node: string) => void;
}

const GraphInput = ({ nodes, selectedStart, onStartChange }: GraphInputProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium whitespace-nowrap">Start Node:</span>
      <Select value={selectedStart} onValueChange={onStartChange}>
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {nodes.map((node) => (
            <SelectItem key={node} value={node}>
              {node}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

interface DPInputProps {
  type: "fibonacci" | "knapsack" | "lcs";
  onFibChange?: (n: number) => void;
  onKnapsackChange?: (weights: number[], values: number[], capacity: number) => void;
  onLCSChange?: (str1: string, str2: string) => void;
  currentValues: {
    fibN?: number;
    weights?: number[];
    values?: number[];
    capacity?: number;
    str1?: string;
    str2?: string;
  };
}

const fibSchema = z.number().int().min(1).max(15);
const capacitySchema = z.number().int().min(1).max(20);
const stringSchema = z.string().max(10, "String too long (max 10 chars)");

const DPInput = ({ type, onFibChange, onKnapsackChange, onLCSChange, currentValues }: DPInputProps) => {
  const [fibN, setFibN] = useState(currentValues.fibN?.toString() || "8");
  const [weights, setWeights] = useState(currentValues.weights?.join(", ") || "2, 3, 4, 5");
  const [values, setValues] = useState(currentValues.values?.join(", ") || "3, 4, 5, 6");
  const [capacity, setCapacity] = useState(currentValues.capacity?.toString() || "5");
  const [str1, setStr1] = useState(currentValues.str1 || "AGCAT");
  const [str2, setStr2] = useState(currentValues.str2 || "GAC");

  const handleFibSubmit = () => {
    const n = parseInt(fibN, 10);
    const validation = fibSchema.safeParse(n);
    if (!validation.success) {
      toast.error("Please enter a number between 1 and 15");
      return;
    }
    onFibChange?.(n);
    toast.success(`Computing Fibonacci(${n})`);
  };

  const handleKnapsackSubmit = () => {
    const w = weights.split(/[,\s]+/).map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    const v = values.split(/[,\s]+/).map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    const c = parseInt(capacity, 10);

    if (w.length === 0 || v.length === 0) {
      toast.error("Please enter valid weights and values");
      return;
    }
    if (w.length !== v.length) {
      toast.error("Weights and values must have the same count");
      return;
    }
    if (w.length > 6) {
      toast.error("Maximum 6 items allowed for visualization");
      return;
    }
    const capValidation = capacitySchema.safeParse(c);
    if (!capValidation.success) {
      toast.error("Capacity must be between 1 and 20");
      return;
    }
    if (w.some(x => x < 1 || x > 10) || v.some(x => x < 1 || x > 20)) {
      toast.error("Weights: 1-10, Values: 1-20");
      return;
    }
    onKnapsackChange?.(w, v, c);
    toast.success("Knapsack parameters updated");
  };

  const handleLCSSubmit = () => {
    const s1Validation = stringSchema.safeParse(str1);
    const s2Validation = stringSchema.safeParse(str2);
    if (!s1Validation.success || !s2Validation.success) {
      toast.error("Strings must be 1-10 characters");
      return;
    }
    if (str1.length === 0 || str2.length === 0) {
      toast.error("Both strings are required");
      return;
    }
    // Only allow letters
    if (!/^[A-Za-z]+$/.test(str1) || !/^[A-Za-z]+$/.test(str2)) {
      toast.error("Only letters allowed");
      return;
    }
    onLCSChange?.(str1.toUpperCase(), str2.toUpperCase());
    toast.success("LCS strings updated");
  };

  if (type === "fibonacci") {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium">n =</span>
        <Input
          type="number"
          value={fibN}
          onChange={(e) => setFibN(e.target.value.slice(0, 2))}
          className="w-20"
          min={1}
          max={15}
        />
        <Button size="sm" onClick={handleFibSubmit} variant="secondary">
          Set
        </Button>
        <span className="text-xs text-muted-foreground">(1-15)</span>
      </div>
    );
  }

  if (type === "knapsack") {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium">Weights:</span>
          <Input
            value={weights}
            onChange={(e) => setWeights(e.target.value.slice(0, 50))}
            className="w-28"
            placeholder="2,3,4"
          />
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium">Values:</span>
          <Input
            value={values}
            onChange={(e) => setValues(e.target.value.slice(0, 50))}
            className="w-28"
            placeholder="3,4,5"
          />
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium">Cap:</span>
          <Input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value.slice(0, 2))}
            className="w-16"
            min={1}
            max={20}
          />
        </div>
        <Button size="sm" onClick={handleKnapsackSubmit} variant="secondary">
          Set
        </Button>
      </div>
    );
  }

  if (type === "lcs") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium">String 1:</span>
          <Input
            value={str1}
            onChange={(e) => setStr1(e.target.value.toUpperCase().slice(0, 10))}
            className="w-24"
            placeholder="AGCAT"
          />
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium">String 2:</span>
          <Input
            value={str2}
            onChange={(e) => setStr2(e.target.value.toUpperCase().slice(0, 10))}
            className="w-24"
            placeholder="GAC"
          />
        </div>
        <Button size="sm" onClick={handleLCSSubmit} variant="secondary">
          Set
        </Button>
      </div>
    );
  }

  return null;
};

export { GraphInput, DPInput };
