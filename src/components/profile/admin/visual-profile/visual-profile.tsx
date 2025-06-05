"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  VisualProfileFieldWithUUID,
  VisualProfileForm,
  VisualProfileFormIn,
} from "@/orval_api/model";
import { useState } from "react";
import { VisualProfileEditForm } from "./visual-profile-edit-form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { VisualProfileCreateForm } from "./visual-profile-create-form";
import { PlusCircle } from "lucide-react";

const EMPTY_CRITERION = {
  key: "",
  name_en: "",
  name_uk: "",
  description_en: "",
  description_uk: "",
};
const EMPTY_VP: VisualProfileFormIn = {
  ...EMPTY_CRITERION,
  criteria: [
    EMPTY_CRITERION,
    EMPTY_CRITERION,
    EMPTY_CRITERION,
    EMPTY_CRITERION,
    EMPTY_CRITERION,
  ],
};

type Props = {
  categories: VisualProfileForm[];
};

export const VisualProfileEditPage = ({ categories }: Props) => {
  const [criteria, setCriteria] = useState<VisualProfileFieldWithUUID[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<VisualProfileFieldWithUUID>();
  const [addNewVisualProfile, setAddNewVisualProfile] =
    useState<VisualProfileFormIn>();

  const selectCategory = (uuid: string) => {
    const category = categories.find((e) => e.uuid === uuid);

    if (category?.criteria) {
      setAddNewVisualProfile(undefined);
      setSelectedCategory(category);
      setCriteria(category.criteria);
    }
  };

  const handleCategoryChange = (uuid: string) => {
    selectCategory(uuid);
  };

  const handleAddNewVisualProfile = () => {
    setCriteria([]);
    setSelectedCategory(undefined);
    setAddNewVisualProfile(EMPTY_VP);
  };

  return (
    <div aria-label="visual-profile-edit-page">
      <div className="flex flex-col justify-center gap-3 lg:flex-row">
        <Select onValueChange={handleCategoryChange}>
          <SelectTrigger
            id="rating-criteria"
            className="ml-auto max-w-100 self-center justify-self-center"
          >
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((item, index) => (
              <SelectItem
                title={item.description_en}
                key={index}
                value={item.uuid}
              >
                {item.name_en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={handleAddNewVisualProfile}
          className="bg-main-ui-purple hover:bg-main-ui-purple/80 dark:bg-main-ui-purple dark:text-white-dark dark:hover:bg-main-ui-purple/80 my-4 ml-auto w-max transition-colors lg:my-2"
        >
          <PlusCircle />
          Add new Visual Profile
        </Button>
      </div>

      {selectedCategory && (
        <VisualProfileEditForm
          type="category"
          key={selectedCategory.key}
          criterion={selectedCategory}
        />
      )}

      <Separator className="my-5" hidden={!criteria.length} />

      {criteria.map((criterion) => (
        <VisualProfileEditForm
          type="criterion"
          key={criterion.key}
          criterion={criterion}
        />
      ))}

      <Separator className="my-5" hidden={!addNewVisualProfile} />

      {addNewVisualProfile && <VisualProfileCreateForm category={EMPTY_VP} />}
    </div>
  );
};
