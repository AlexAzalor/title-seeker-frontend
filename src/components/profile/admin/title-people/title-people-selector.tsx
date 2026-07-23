"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ItemsSelector } from "@/components/my-custom-ui/items-list-selector";
import { ResponsiveWrapper } from "@/components/my-custom-ui/responsive-wrapper";

import {
  getActorFormFields,
  getActors,
  getCharacter,
  getCharacterFormFields,
  getDirectorFormFields,
  getDirectors,
} from "@/app/(app)/services/admin-api";

import {
  FilterEnum,
  type CharacterFormFieldsOut,
  type MainItemMenu,
  type PersonFormWithID,
} from "@/orval_api/model";
import { TitlePeopleEditForm } from "./title-people-edit-form";
import { TitleCharacterEditForm } from "./title-character-edit-form";

const PEOPLE_LIST = [
  { key: FilterEnum.actor, label: "Actors" },
  { key: FilterEnum.director, label: "Directors" },
  { key: FilterEnum.character, label: "Characters" },
];

const peopleConfig = {
  [FilterEnum.actor]: {
    list: getActors,
    fields: getActorFormFields,
    message: "Actors loaded!",
  },
  [FilterEnum.director]: {
    list: getDirectors,
    fields: getDirectorFormFields,
    message: "Directors loaded!",
  },
  [FilterEnum.character]: {
    list: getCharacter,
    message: "Characters loaded!",
  },
} as const;

type PersonFilterItem = {
  item: PersonFormWithID;
  key: typeof FilterEnum.actor | typeof FilterEnum.director;
  itemKey: string;
};

type CharacterFilterItem = {
  item: CharacterFormFieldsOut;
  key: typeof FilterEnum.character;
  itemKey: string;
};

export const TitlePeopleSelector = () => {
  const [selectedFilterType, setSelectedFilterType] =
    useState<FilterEnum | null>(null);

  const [filterList, setFilterList] = useState<MainItemMenu[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<PersonFilterItem[]>(
    [],
  );
  const [selectedCharacters, setSelectedCharacters] = useState<
    CharacterFilterItem[]
  >([]);

  const selectFilterType = async (filterKey: FilterEnum) => {
    setSelectedFilters([]);
    setSelectedCharacters([]);
    setFilterList([]);
    setSelectedFilterType(filterKey);

    if (filterKey === FilterEnum.character) {
      const config = peopleConfig[FilterEnum.character];

      try {
        const res = await config.list();

        if (Array.isArray(res)) {
          setFilterList(res);
          toast.info(config.message);
        } else {
          toast.error("No data found for this filter type");
        }
      } catch (error) {
        console.error("Error loading filter data:", error);
        toast.error("Failed to load filter data");
      }
      return;
    }

    const config =
      peopleConfig[
        filterKey as typeof FilterEnum.actor | typeof FilterEnum.director
      ];

    try {
      const res = await config.list();

      if (Array.isArray(res)) {
        setFilterList(res);
        toast.info(config.message);
      } else {
        toast.error("No data found for this filter type");
      }
    } catch (error) {
      console.error("Error loading filter data:", error);
      toast.error("Failed to load filter data");
    }
  };

  const selectFilterItem = useCallback(
    async (key: string) => {
      if (!selectedFilterType) {
        toast.error("Please select a filter type first");
        return;
      }

      // Check if item is already selected and toggle if so
      if (selectedFilters.some((e) => e.itemKey === key)) {
        setSelectedFilters((prev) => prev.filter((e) => e.itemKey !== key));
        return;
      }
      if (selectedCharacters.some((e) => e.itemKey === key)) {
        setSelectedCharacters((prev) => prev.filter((e) => e.itemKey !== key));
        return;
      }

      // Find the item in filterList to get the numeric id
      const listItem = filterList.find((e) => e.key === key);
      if (!listItem) {
        toast.error("Item not found");
        return;
      }

      const config =
        peopleConfig[selectedFilterType as keyof typeof peopleConfig];

      try {
        if (selectedFilterType === FilterEnum.character) {
          const res = await getCharacterFormFields(listItem.id);

          if (res.status === 200 && res.data) {
            const characterItem: CharacterFilterItem = {
              item: res.data,
              key: FilterEnum.character,
              itemKey: key,
            };

            setSelectedCharacters((prev) => [...prev, characterItem]);
          } else {
            toast.error(`${res.status}: ${res.message}`);
          }
        } else {
          const personConfig =
            config as (typeof peopleConfig)[typeof FilterEnum.actor];
          const res = await personConfig.fields(listItem.id);

          if (res.status === 200 && res.data) {
            setSelectedFilters((prev) => [
              ...prev,
              {
                item: res.data,
                key: selectedFilterType as
                  | typeof FilterEnum.actor
                  | typeof FilterEnum.director,
                itemKey: key,
              },
            ]);
          } else {
            toast.error(`${res.status}: ${res.message}`);
          }
        }
      } catch (error) {
        console.error("Error selecting filter item:", error);
        toast.error("Failed to load filter item data");
      }
    },
    [selectedFilterType, selectedFilters, selectedCharacters, filterList],
  );

  const filterTitle =
    PEOPLE_LIST.find((e) => e.key === selectedFilterType)?.label ||
    "Select a filter first";

  const selectedFilterKeys = [
    ...selectedFilters.map((e) => e.itemKey),
    ...selectedCharacters.map((e) => e.itemKey),
  ];

  return (
    <div aria-label="title-people-selector">
      <div className="mb-6 flex flex-col justify-center gap-3 lg:flex-row">
        <Select onValueChange={selectFilterType}>
          <SelectTrigger
            id="people-type"
            className="max-w-100 self-center justify-self-center"
          >
            <SelectValue placeholder="Select a people type" />
          </SelectTrigger>
          <SelectContent>
            {PEOPLE_LIST.map((item) => (
              <SelectItem key={item.key} value={item.key}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ResponsiveWrapper title={filterTitle}>
          <ItemsSelector
            items={filterList}
            emptyText="No items found"
            onSelect={({ key }) => {
              selectFilterItem(key);
            }}
            checkIconStyle={selectedFilterKeys}
          />
        </ResponsiveWrapper>
      </div>

      {!!selectedCharacters.length &&
        selectedCharacters.map(({ itemKey, item }) => (
          <TitleCharacterEditForm key={itemKey} filterItem={item} />
        ))}

      {!!selectedFilters.length &&
        selectedFilters.map(({ itemKey, item, key }) => (
          <TitlePeopleEditForm key={itemKey} filterItem={item} type={key} />
        ))}
    </div>
  );
};
