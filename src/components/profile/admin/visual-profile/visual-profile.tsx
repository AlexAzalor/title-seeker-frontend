"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryFormIn, VisualProfileForm } from "@/orval_api/model";
import { useState } from "react";
import { VisualProfileCriterionForm } from "./visual-profile-form";
import { Separator } from "@/components/ui/separator";

type Props = {
  categories: VisualProfileForm[];
};

export const VisualProfileEditPage = ({ categories }: Props) => {
  const [criteria, setCriteria] = useState<CategoryFormIn[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFormIn>();

  const selectCategory = (key: string) => {
    const category = categories.find((e) => e.key === key);

    if (category?.criteria) {
      setSelectedCategory(category);
      setCriteria(category.criteria);
    }
  };

  const handleCategoryChange = (key: string) => {
    selectCategory(key);
  };

  return (
    <div aria-label="visual-profile-edit-page">
      <div className="mx-auto w-100">
        <Select onValueChange={handleCategoryChange}>
          <SelectTrigger id="rating-criteria">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((item) => (
              <SelectItem
                title={item.description_en}
                key={item.key}
                value={item.key}
              >
                {item.name_en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCategory && (
        <VisualProfileCriterionForm
          type="category"
          key={selectedCategory.key}
          criterion={selectedCategory}
          oldCriterionKey={selectedCategory.key}
        />
      )}
      <Separator className="my-5" />
      {criteria.map((criterion) => (
        <VisualProfileCriterionForm
          type="criterion"
          key={criterion.key}
          criterion={criterion}
          oldCriterionKey={criterion.key}
        />
      ))}
    </div>
  );
};
