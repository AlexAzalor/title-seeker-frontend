import { memo } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props<T extends string> = {
  items: { value: string; label: string }[];
  label: string;
  defaultValue: T;
  onValueChange: (value: T) => void;
};

const RatingTypeSelector = <T extends string>({
  items,
  label,
  defaultValue,
  onValueChange,
}: Props<T>) => {
  return (
    <div className="mb-4 grid max-w-72 gap-2">
      <Label htmlFor="rating-criteria">{label}</Label>
      <Select onValueChange={onValueChange} defaultValue={defaultValue}>
        <SelectTrigger id="rating-criteria">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const RatingTypeSelectorMemo = memo(
  RatingTypeSelector,
) as typeof RatingTypeSelector;

export { RatingTypeSelectorMemo as RatingTypeSelector };
