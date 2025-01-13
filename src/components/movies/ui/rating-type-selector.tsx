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

export const RatingTypeSelector = ({ defaultValue, onValueChange }: Props) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="rating-criteria">Rating Criteria</Label>
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
          <SelectItem value={RatingCriterion.full}>Full</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
