import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

type SliderProps = React.ComponentProps<typeof Slider>;
// https://github.com/shadcn-ui/ui/blob/main/apps/www/app/(app)/examples/playground/components/temperature-selector.tsx
export function RateSlider({
  className,
  max,
  defaultValue,
  value,
  ...props
}: SliderProps) {
  return (
    <div className="relative mb-1 flex items-center gap-3">
      <Slider
        defaultValue={defaultValue}
        value={value}
        max={max}
        step={0.01}
        className={cn("mr-10 h-3", className)}
        {...props}
      />
      <span className="absolute right-0">{value && value}</span>
    </div>
  );
}
