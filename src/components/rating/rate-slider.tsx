import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { MIN_RATE } from "./utils";

// type SliderProps = React.ComponentProps<typeof Slider>;
// https://github.com/shadcn-ui/ui/blob/main/apps/www/app/(app)/examples/playground/components/temperature-selector.tsx
type Props = {
  value: number;
  showValue: boolean;
  defaultValue: number;
  max: number;
  className?: string;
  onValueChange: (value: number[]) => void;
};

export function RateSlider({
  showValue,
  className,
  max,
  value,
  defaultValue,
  onValueChange,
}: Props) {
  return (
    <div className="relative mb-1 flex items-center gap-3">
      <Slider
        defaultValue={[defaultValue]}
        value={[value]}
        min={MIN_RATE}
        max={max}
        step={0.01}
        className={cn("mr-10 h-3", className)}
        onValueChange={onValueChange}
        // disabled={showValue}
      />

      {showValue && <span className="absolute right-0">{value}</span>}
    </div>
  );
}
