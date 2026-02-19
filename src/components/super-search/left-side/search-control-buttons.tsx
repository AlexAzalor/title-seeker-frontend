"use client";

import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useSubgenreStore } from "@/lib/store";

import { syncSearchParameters, manageSearchParameters } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const SearchControl = {
  exactMatch: "exact_match",
  innerExactMatch: "inner_exact_match",
} as const;

export const SearchControlButtons = () => {
  const router = useRouter();
  const t = useTranslations("SuperSearch");
  const { setSubgenres } = useSubgenreStore();
  const currentSearchParams = useSearchParams();

  const currentExactMatch = currentSearchParams.get(SearchControl.exactMatch);
  const currentInnerExactMatch = currentSearchParams.get(
    SearchControl.innerExactMatch,
  );

  const clearAllFilters = () => {
    const { refreshPage } = syncSearchParameters(router);
    refreshPage();
    setSubgenres([]);
  };

  function handleExactMatch() {
    manageSearchParameters(
      SearchControl.exactMatch,
      "true",
      currentSearchParams.has(SearchControl.exactMatch) ? "true" : "",
      currentSearchParams,
      router,
    );
  }

  function handleInnerExactMatch() {
    manageSearchParameters(
      SearchControl.innerExactMatch,
      "true",
      currentSearchParams.has(SearchControl.innerExactMatch) ? "true" : "",
      currentSearchParams,
      router,
    );
  }

  return (
    <>
      <Button
        className="mb-2 cursor-pointer font-bold lg:mb-0"
        variant="destructive"
        onClick={clearAllFilters}
        disabled={currentSearchParams.size === 0}
      >
        {t("clear")}
      </Button>

      <Label
        onClick={handleExactMatch}
        className="flex w-max cursor-pointer items-center gap-3 text-xl"
        title={t("exactMatchTooltip")}
      >
        <span>{t("exactMatch")}</span>
        <Checkbox checked={!!currentExactMatch} className="cursor-pointer" />
      </Label>

      <Label
        onClick={handleInnerExactMatch}
        className="flex w-max cursor-pointer items-center gap-3 text-xl"
        title={t("innerEMTooltip")}
      >
        <span>{t("innerExactMatch")}</span>
        <Checkbox
          checked={!!currentInnerExactMatch}
          className="cursor-pointer"
        />
      </Label>
    </>
  );
};
