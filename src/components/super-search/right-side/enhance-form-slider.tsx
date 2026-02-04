import { Fragment } from "react";
import {
  type Control,
  Controller,
  type FieldArrayWithId,
} from "react-hook-form";
import { z } from "zod";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { EnhanceSearchSchema } from "@/types/search-params-schema";

type FormData = z.infer<typeof EnhanceSearchSchema>;

type Props = {
  name: "genres" | "subgenres" | "specifications" | "keywords" | "action_times";
  control: Control<FormData>;
  itemsList: FieldArrayWithId<FormData, "genres", "id">[];
};

export const EnhancedFormSlider = ({ name, itemsList, control }: Props) => {
  return (
    <>
      {itemsList.map((field, index) => (
        <Fragment key={field.id}>
          <p className="font-bold">{field.name}</p>

          <Controller
            control={control}
            name={`${name}.${index}.percentage_match`}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <span>{value.join(" - ")}</span>
                <Slider
                  range
                  defaultValue={value}
                  onValueChange={onChange}
                  step={10}
                  max={100}
                  min={10}
                  minStepsBetweenThumbs={1}
                />
                {error && (
                  <span className="text-danger text-sm">{error.message}</span>
                )}
              </>
            )}
          />
        </Fragment>
      ))}

      <Separator className="my-4" />
    </>
  );
};
