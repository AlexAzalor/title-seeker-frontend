import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { MIN_RATE, RATING_TOOLTIP } from "./utils";
import { TooltipWrapper } from "../custom/tooltip-wrapper";
import { InfoIcon } from "lucide-react";
import { UserRatingCriteria } from "@/orval_api/model";

// type SliderProps = React.ComponentProps<typeof Slider>;
// https://github.com/shadcn-ui/ui/blob/main/apps/www/app/(app)/examples/playground/components/temperature-selector.tsx
export type RatingType = keyof UserRatingCriteria;

type Props = {
  title: string;
  type: RatingType;
  value: number;
  showValue: boolean;
  defaultValue: number;
  max: number;
  className?: string;
  onValueChange: (value: number[]) => void;
};

export function RateSlider({
  title,
  type,
  showValue,
  className,
  max,
  value,
  defaultValue,
  onValueChange,
}: Props) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-1">
        <span>{title}</span>
        <TooltipWrapper content={RATING_TOOLTIP[type] || "Rate the movie"}>
          <InfoIcon className="h-4 w-4" />
        </TooltipWrapper>
      </div>

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
        {showValue && (
          <span className="absolute -right-9 text-sm font-normal">({max})</span>
        )}
      </div>
    </div>
  );
}
