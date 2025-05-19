import { memo } from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("Rating");

  return (
    <div className="mb-4 grid w-72 gap-2">
      <Label htmlFor="rating-criteria">{t("ratingType.name")}</Label>
      <Select onValueChange={onValueChange} defaultValue={defaultValue}>
        <SelectTrigger id="rating-criteria">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={RatingCriterion.basic}>{t("basic")}</SelectItem>
          <SelectItem value={RatingCriterion.visual_effects}>
            {t("visual_effects.name")}
          </SelectItem>
          <SelectItem value={RatingCriterion.scare_factor}>
            {t("scare_factor.name")}
          </SelectItem>
          <SelectItem value={RatingCriterion.humor}>
            {" "}
            {t("humor.name")}
          </SelectItem>
          <SelectItem value={RatingCriterion.animation_cartoon}>
            {t("animation_cartoon.name")}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

const RatingTypeSelectorMemo = memo(RatingTypeSelector);

export { RatingTypeSelectorMemo as RatingTypeSelector };
