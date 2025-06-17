"use client";

import { Suspense, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { checkIfAdmin } from "@/middleware";
import { InfoIcon } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { cn } from "@/lib/utils";

import {
  FilterEnum,
  FilterItemOut,
  GenreOut,
  MovieFilterItem,
} from "@/orval_api/model";

import { TooltipWrapper } from "@/components/my-custom-ui/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import {
  getActionTimes,
  getGenresSubgenres,
  getKeywords,
  getSpecifications,
  getSubgenresList,
} from "@/app/services/admin-api";
import { FilterEditForm } from "./filter-edit-form";
import { FilterItemLink } from "./filter-item-link";
import { GenreEditForm } from "./genre-edit-form";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const CustomModal = dynamic(() => import("../../my-custom-ui/custom-modal"));

type Props = {
  movieKey: string;
  data: MovieFilterItem[];
  filterKey: FilterEnum;
  subgenres?: MovieFilterItem[];
};

const textColor = {
  [FilterEnum.genre]: "movie-genre-text",
  [FilterEnum.subgenre]: "movie-subgenre-text",
  [FilterEnum.specification]: "movie-spec-text",
  [FilterEnum.keyword]: "movie-keywords-text",
  [FilterEnum.action_time]: "movie-act-time-text",
};

export const MovieFilter = ({
  movieKey,
  data,
  filterKey,
  subgenres,
}: Props) => {
  const session = useSession();
  const t = useTranslations("Filters");
  const { isOpen, open, close } = useModal();
  const [filterData, setFilterData] = useState<FilterItemOut[]>([]);
  const [genreList, setGenreList] = useState<GenreOut[]>([]);

  const getFilterData = async () => {
    if (filterKey === FilterEnum.genre) {
      const res = await getGenresSubgenres(movieKey);

      if (res.status === 200 && res.data) {
        setGenreList(res.data.genres);
        return;
      }
    }

    if (filterKey === FilterEnum.subgenre) {
      const res = await getSubgenresList();

      if (Array.isArray(res)) {
        setFilterData(res);
        return;
      }
    }

    if (filterKey === FilterEnum.specification) {
      const res = await getSpecifications();

      if (Array.isArray(res)) {
        setFilterData(res);
        return;
      }
    }

    if (filterKey === FilterEnum.keyword) {
      const res = await getKeywords();

      if (Array.isArray(res)) {
        setFilterData(res);
        return;
      }
    }

    if (filterKey === FilterEnum.action_time) {
      const res = await getActionTimes();

      if (Array.isArray(res)) {
        setFilterData(res);
        return;
      }
    }

    toast.error("Error");
  };

  const handleEdit = () => {
    open();
    getFilterData();
  };

  const isFilter =
    filterKey === FilterEnum.specification ||
    filterKey === FilterEnum.keyword ||
    filterKey === FilterEnum.action_time;

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

          {checkIfAdmin(session.data?.user.role) &&
            filterKey !== FilterEnum.subgenre && (
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
                filterKey === FilterEnum.genre && "movie-genre-text",
                filterKey === FilterEnum.specification && "movie-spec-text",
                filterKey === FilterEnum.keyword && "movie-keywords-text",
                filterKey === FilterEnum.action_time && "movie-act-time-text",
              )}
            >
              {t(`${filterKey}.name`)}
            </p>
            <TooltipWrapper content={t(`${filterKey}.description`)}>
              <InfoIcon className="h-4 w-4" />
            </TooltipWrapper>
          </div>

          {genreList.length && subgenres && (
            <GenreEditForm
              movieKey={movieKey}
              allGenres={genreList}
              selectedGenres={data}
              selectedSubgenres={subgenres}
            />
          )}

          {isFilter && (
            <FilterEditForm
              movieKey={movieKey}
              filterItems={filterData}
              selectedFilterItems={data}
              filterType={filterKey}
            />
          )}
        </CustomModal>
      </Suspense>
    </>
  );
};
