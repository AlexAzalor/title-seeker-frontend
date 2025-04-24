import { useSession } from "next-auth/react";
import { memo } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { MIN_RATE, RATING_TOOLTIP } from "./utils";
import { TooltipWrapper } from "../../my-custom-ui/tooltip-wrapper";
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
  onValueChange: (value: number[], key: RatingType) => void;
};

function RateSlider({
  title,
  type,
  showValue,
  className,
  max,
  value,
  defaultValue,
  onValueChange,
}: Props) {
  const session = useSession();

  return (
    <div>
      <div className="mb-1 flex items-center gap-1">
        <span>{title}</span>

        <TooltipWrapper content={RATING_TOOLTIP[type] || "Rate the movie"}>
          <InfoIcon className="h-4 w-4" />
        </TooltipWrapper>

        <div className="flex items-end gap-1 lg:hidden">
          {showValue && <span className="">{value}</span>}
          {showValue && <span className="text-sm font-normal">({max})</span>}
        </div>
      </div>

      <div className="relative mb-1 flex items-center gap-3">
        <Slider
          defaultValue={[defaultValue]}
          disabled={session.status !== "authenticated"}
          value={[value]}
          min={MIN_RATE}
          max={max}
          step={0.01}
          className={cn("h-3 lg:mr-10", className)}
          onValueChange={(value) => onValueChange(value, type)}
        />

        {showValue && (
          <span className="absolute right-0 hidden lg:block">{value}</span>
        )}
        {showValue && (
          <span className="absolute -right-9 hidden text-sm font-normal lg:block">
            ({max})
          </span>
        )}
      </div>
    </div>
  );
}

const RateSliderMemo = memo(RateSlider);

export { RateSliderMemo as RateSlider };
