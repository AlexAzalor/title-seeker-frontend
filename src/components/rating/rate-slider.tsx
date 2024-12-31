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
    <div className="flex items-center gap-3">
      <Slider
        defaultValue={defaultValue}
        value={value}
        max={max}
        step={0.01}
        className={cn("h-3 w-[60%]", className)}
        {...props}
      />
      <span>{value && value}</span>
    </div>
  );
}
