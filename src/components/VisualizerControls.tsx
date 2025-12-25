import { Play, Pause, RotateCcw, SkipForward, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface VisualizerControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStep: () => void;
  onShuffle: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  disabled?: boolean;
}

const VisualizerControls = ({
  isPlaying,
  onPlay,
  onPause,
  onReset,
  onStep,
  onShuffle,
  speed,
  onSpeedChange,
  disabled = false,
}: VisualizerControlsProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-xl border border-border">
      <div className="flex items-center gap-2">
        {isPlaying ? (
          <Button
            variant="outline"
            size="icon"
            onClick={onPause}
            disabled={disabled}
            className="rounded-full"
          >
            <Pause className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="default"
            size="icon"
            onClick={onPlay}
            disabled={disabled}
            className="rounded-full"
          >
            <Play className="h-4 w-4" />
          </Button>
        )}
        
        <Button
          variant="outline"
          size="icon"
          onClick={onStep}
          disabled={disabled || isPlaying}
          className="rounded-full"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onReset}
          disabled={disabled}
          className="rounded-full"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onShuffle}
          disabled={disabled || isPlaying}
          className="rounded-full"
        >
          <Shuffle className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-3 min-w-[200px]">
        <span className="text-sm text-muted-foreground whitespace-nowrap">Speed:</span>
        <Slider
          value={[speed]}
          onValueChange={(value) => onSpeedChange(value[0])}
          min={1}
          max={10}
          step={1}
          className="flex-1"
        />
        <span className="text-sm font-medium w-6">{speed}x</span>
      </div>
    </div>
  );
};

export default VisualizerControls;
