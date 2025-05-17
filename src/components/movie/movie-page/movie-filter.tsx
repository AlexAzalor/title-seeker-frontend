"use client";

import { Suspense, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { InfoIcon } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { cn } from "@/lib/utils";
import { CustomModal } from "../../my-custom-ui/custom-modal";
import { FilterItemOut, MovieFilterItem } from "@/orval_api/model";
import { movieComponents } from "@/lib/constants";

import { TooltipWrapper } from "@/components/my-custom-ui/tooltip-wrapper";
import {
  ACTION_TIME_KEY,
  KEYWORD_KEY,
  SPEC_KEY,
} from "@/components/super-search/filter-fetch-wrapper";
import { Button } from "@/components/ui/button";
import {
  getActionTimes,
  getKeywords,
  getSpecifications,
} from "@/app/services/admin-api";
import { FilterEditForm } from "./filter-edit-form";
import {
  GENRE_KEY,
  SUBGENRE_KEY,
} from "@/components/super-search/genre-selector";
import { FilterItemLink } from "./filter-item-link";

type QueryKeys =
  | typeof GENRE_KEY
  | typeof SUBGENRE_KEY
  | typeof SPEC_KEY
  | typeof KEYWORD_KEY
  | typeof ACTION_TIME_KEY;

type Props = {
  movieKey: string;
  data: MovieFilterItem[];
  filterKey: QueryKeys;
  title: string;
};

const textColor = {
  [GENRE_KEY]: "movie-genre-text",
  [SUBGENRE_KEY]: "movie-subgenre-text",
  [SPEC_KEY]: "movie-spec-text",
  [KEYWORD_KEY]: "movie-keywords-text",
  [ACTION_TIME_KEY]: "movie-act-time-text",
};

export const MovieFilter = ({ movieKey, data, filterKey, title }: Props) => {
  const session = useSession();
  const t = useTranslations("Filters");
  const { isOpen, open, close } = useModal();
  const [filterData, setFilterData] = useState<FilterItemOut[]>([]);

  const getFilterData = async () => {
    if (filterKey === SPEC_KEY) {
      const res = await getSpecifications();

      if (Array.isArray(res)) {
        setFilterData(res);
      }
    }

    if (filterKey === KEYWORD_KEY) {
      const res = await getKeywords();

      if (Array.isArray(res)) {
        setFilterData(res);
      }
    }

    if (filterKey === ACTION_TIME_KEY) {
      const res = await getActionTimes();

      if (Array.isArray(res)) {
        setFilterData(res);
      }
    }
  };

  const handleEdit = () => {
    open();
    getFilterData();
  };

  return (
    <>
      <div>
        <div className="flex items-center gap-1">
          <p
            className={cn(
              "base-neon-text mb-1 text-xl",
              textColor[filterKey as keyof typeof textColor],
            )}
          >
            {t(`${filterKey}.name`)}
          </p>
          <TooltipWrapper content={t(`${filterKey}.description`)}>
            <InfoIcon className="h-4 w-4" />
          </TooltipWrapper>

          {session.data?.user.role === "owner" &&
            [SPEC_KEY, KEYWORD_KEY, ACTION_TIME_KEY].includes(filterKey) && (
              <Button variant="link" className="h-7 p-0" onClick={handleEdit}>
                Edit
              </Button>
            )}
        </div>

        <FilterItemLink data={data} filterKey={filterKey} />
      </div>

      <Suspense>
        <CustomModal isOpen={isOpen} onClose={close}>
          <div className="mb-2 flex items-center justify-center gap-2">
            <p
              className={cn(
                "base-neon-text text-2xl",
                filterKey === SPEC_KEY && "movie-spec-text",
                filterKey === KEYWORD_KEY && "movie-keywords-text",
                filterKey === ACTION_TIME_KEY && "movie-act-time-text",
              )}
            >
              {title}
            </p>
            <TooltipWrapper content={movieComponents[filterKey]}>
              <InfoIcon className="h-4 w-4" />
            </TooltipWrapper>
          </div>
          <FilterEditForm
            movieKey={movieKey}
            filterItems={filterData}
            selectedFilterItems={data}
            filterType={filterKey}
          />
        </CustomModal>
      </Suspense>
    </>
  );
};
