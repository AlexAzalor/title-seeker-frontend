import { memo } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RatingCriterion } from "@/orval_api/model";

type Props = {
  items: { value: string; label: string }[];
  label: string;
  defaultValue: RatingCriterion;
  onValueChange: (value: RatingCriterion) => void;
};

const RatingTypeSelector = ({
  items,
  label,
  defaultValue,
  onValueChange,
}: Props) => {
  return (
    <div className="mb-4 grid w-72 gap-2">
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

const RatingTypeSelectorMemo = memo(RatingTypeSelector);

export { RatingTypeSelectorMemo as RatingTypeSelector };
