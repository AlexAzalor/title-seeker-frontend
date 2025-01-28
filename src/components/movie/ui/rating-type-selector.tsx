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
  defaultValue: RatingCriterion;
  onValueChange: (value: RatingCriterion) => void;
};

const RatingTypeSelector = ({ defaultValue, onValueChange }: Props) => {
  return (
    <div className="mb-4 grid w-72 gap-2">
      <Label htmlFor="rating-criteria">Rating Type</Label>
      <Select onValueChange={onValueChange} defaultValue={defaultValue}>
        <SelectTrigger id="rating-criteria">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={RatingCriterion.basic}>Basic</SelectItem>
          <SelectItem value={RatingCriterion.visual_effects}>
            Visual Effects
          </SelectItem>
          <SelectItem value={RatingCriterion.scare_factor}>
            Scary Factor
          </SelectItem>
          <SelectItem value={RatingCriterion.humor}>Humor</SelectItem>
          <SelectItem value={RatingCriterion.animation_cartoon}>
            Animation/Cartoon
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

const RatingTypeSelectorMemo = memo(RatingTypeSelector);

export { RatingTypeSelectorMemo as RatingTypeSelector };
