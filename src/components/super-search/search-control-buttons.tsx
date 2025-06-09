"use client";

import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

import { syncSearchParameters, manageSearchParameters } from "@/lib/utils";

export const GENRE_KEY = "genre";
export const SUBGENRE_KEY = "subgenre";
export const EXACT_MATCH_KEY = "exact_match";

export const SearchControlButtons = () => {
  const router = useRouter();
  const t = useTranslations("SuperSearch");

  const currentSearchParams = useSearchParams();

  const currentExactMatch = currentSearchParams.get(EXACT_MATCH_KEY);

  const clearAllFilters = () => {
    const { refreshPage } = syncSearchParameters(router);
    refreshPage();
  };

  function handleExactMatch() {
    manageSearchParameters(
      EXACT_MATCH_KEY,
      "true",
      currentSearchParams.has(EXACT_MATCH_KEY) ? "true" : "",
      currentSearchParams,
      router,
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Button
        className="mb-4 cursor-pointer text-black"
        variant="destructive"
        onClick={clearAllFilters}
      >
        {t("clear")}
      </Button>

      <Label
        onClick={handleExactMatch}
        className="my-2 flex w-max cursor-pointer items-center gap-3 text-xl"
      >
        <span>{t("exactMatch")}</span>
        <Checkbox checked={!!currentExactMatch} className="cursor-pointer" />
      </Label>
    </div>
  );
};
