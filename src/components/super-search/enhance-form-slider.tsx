import { Fragment } from "react";
import { Control, Controller, FieldArrayWithId } from "react-hook-form";
import { Slider } from "../ui/slider";
import { EnhanceSearchType } from "@/types/zod-scheme";
import { Separator } from "../ui/separator";

type FormData = {
  genres: EnhanceSearchType[];
  subgenres: EnhanceSearchType[];
  specifications: EnhanceSearchType[];
  keywords: EnhanceSearchType[];
  action_times: EnhanceSearchType[];
};

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
          <p>{field.name}</p>

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
                  step={1}
                  max={100}
                  minStepsBetweenThumbs={10}
                />
                {error && (
                  <span className="text-sm text-red-500">{error.message}</span>
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
