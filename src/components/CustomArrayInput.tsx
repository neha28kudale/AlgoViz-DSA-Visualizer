import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { z } from "zod";

interface CustomArrayInputProps {
  onSubmit: (values: number[]) => void;
  placeholder?: string;
  maxLength?: number;
  maxValue?: number;
}

const arraySchema = z.string().max(200, "Input too long");

const CustomArrayInput = ({
  onSubmit,
  placeholder = "e.g., 5, 3, 8, 1, 9",
  maxLength = 20,
  maxValue = 99,
}: CustomArrayInputProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    const validation = arraySchema.safeParse(input);
    if (!validation.success) {
      toast.error("Input is too long");
      return;
    }

    const values = input
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter((s) => s !== "")
      .map((s) => parseInt(s, 10));

    if (values.some((v) => isNaN(v))) {
      toast.error("Please enter valid numbers separated by commas");
      return;
    }

    if (values.length === 0) {
      toast.error("Please enter at least one number");
      return;
    }

    if (values.length > maxLength) {
      toast.error(`Maximum ${maxLength} numbers allowed`);
      return;
    }

    if (values.some((v) => v < 1 || v > maxValue)) {
      toast.error(`Numbers must be between 1 and ${maxValue}`);
      return;
    }

    onSubmit(values);
    toast.success(`Array updated with ${values.length} elements`);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value.slice(0, 200))}
        placeholder={placeholder}
        className="w-48 md:w-64"
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <Button size="sm" onClick={handleSubmit} variant="secondary">
        Set Array
      </Button>
    </div>
  );
};

export default CustomArrayInput;
