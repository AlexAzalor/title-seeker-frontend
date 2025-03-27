import { memo } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RelatedMovie } from "@/orval_api/model";
import { FieldError, Controller, Control } from "react-hook-form";
import { RelatedMovieType } from "@/types/zod-scheme";

type Props = {
  defaultValue?: RelatedMovie;
  onValueChange?: (value: RelatedMovie) => void;
  name: "base_movie_key" | "collection_order" | "relation_type";
  error: FieldError | undefined;
  control: Control<RelatedMovieType>;
};

const TYPE_LIST = [
  { value: RelatedMovie.base, label: "Base" },
  { value: RelatedMovie.sequel, label: "Sequel" },
  { value: RelatedMovie.prequel, label: "Prequel" },
  { value: RelatedMovie.spin_off, label: "Spin-off" },
  { value: RelatedMovie.remake, label: "Remake" },
  { value: RelatedMovie.reboot, label: "Reboot" },
  { value: RelatedMovie.crossover, label: "Crossover" },
  { value: RelatedMovie.alternative_timeline, label: "Alternative Timeline" },
  { value: RelatedMovie.shared_universe, label: "Shared Universe" },
];

const TypeSelector = ({ defaultValue, name, control }: Props) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange }, fieldState: { error } }) => (
        <div className="mb-4 grid w-72 gap-2">
          <Label htmlFor="rating-criteria">Rating Type</Label>
          <Select onValueChange={onChange} defaultValue={defaultValue}>
            <SelectTrigger id="rating-criteria">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {TYPE_LIST.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && (
            <span className="text-sm text-red-500">{error.message}</span>
          )}
        </div>
      )}
    />
  );
};

const TypeSelectorMemo = memo(TypeSelector);

export { TypeSelectorMemo as TypeSelector };
