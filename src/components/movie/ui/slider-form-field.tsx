import {
  FieldError,
  FieldValues,
  Path,
  UseFormGetValues,
  UseFormRegister,
} from "react-hook-form";
import { Slider } from "@/components/ui/slider";

type Props<
  TFormValues extends FieldValues,
  TFieldName extends Path<TFormValues>,
> = {
  name: TFieldName;
  register: UseFormRegister<TFormValues>;
  error: FieldError | undefined;
  value?: string;
  defaultValue: UseFormGetValues<TFormValues>;
  onClickButton: () => void;
};

export const SliderFormField = <
  TFormValues extends FieldValues,
  TFieldName extends Path<TFormValues>,
>({
  name,
  defaultValue,
  register,
  error,
  onClickButton,
}: Props<TFormValues, TFieldName>) => {
  return (
    <div className="mt-7 flex items-center gap-2">
      <div className="relative w-full">
        <Slider
          defaultValue={[defaultValue(name)]}
          step={10}
          // @ts-expect-error - The `max` type is different from the `Slider` component and `React Hook Form`
          max={100}
          {...register(name)}
        />

        {error && (
          <div className="absolute text-sm text-red-500">{error.message}</div>
        )}
      </div>

      <button type="button" onClick={onClickButton}>
        X
      </button>
    </div>
  );
};
