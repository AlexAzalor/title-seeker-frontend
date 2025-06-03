import {
  FieldError,
  FieldValues,
  Path,
  UseFormGetValues,
  UseFormRegister,
} from "react-hook-form";
import { Slider } from "@/components/ui/slider";
import { CircleArrowDown, CircleArrowUp, CircleX } from "lucide-react";

type Props<
  TFormValues extends FieldValues,
  TFieldName extends Path<TFormValues>,
> = {
  name: TFieldName;
  register: UseFormRegister<TFormValues>;
  error: FieldError | undefined;
  value?: string;
  defaultValue: UseFormGetValues<TFormValues>;
  removItem?: () => void;
  step?: number;
  max?: number;
  moveUp?: () => void;
  moveDown?: () => void;
  min?: number;
};

export const SliderFormField = <
  TFormValues extends FieldValues,
  TFieldName extends Path<TFormValues>,
>({
  name,
  defaultValue,
  register,
  error,
  removItem,
  step = 10,
  max = 100,
  moveUp,
  moveDown,
  min = 0,
}: Props<TFormValues, TFieldName>) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-full">
        <Slider
          defaultValue={[defaultValue(name)]}
          step={step}
          // @ts-expect-error - The `max` type is different from the `Slider` component and `React Hook Form`
          max={max}
          // @ts-expect-error - The `max` type is different from the `Slider` component and `React Hook Form`
          min={min}
          {...register(name)}
        />

        {error && (
          <div className="error-message absolute -bottom-6 text-sm">
            {error.message}
          </div>
        )}
      </div>

      {moveUp && (
        <button type="button" className="" onClick={moveUp}>
          <CircleArrowUp className="h-6 w-6 transition-transform hover:scale-110" />
        </button>
      )}

      {moveDown && (
        <button type="button" onClick={moveDown}>
          <CircleArrowDown className="h-6 w-6 transition-transform hover:scale-110" />
        </button>
      )}

      {removItem && (
        <button type="button" onClick={removItem}>
          <CircleX
            color="red"
            className="h-5 w-5 transition-transform hover:scale-110"
          />
        </button>
      )}
    </div>
  );
};
