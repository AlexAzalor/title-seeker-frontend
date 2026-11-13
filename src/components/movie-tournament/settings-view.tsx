"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, Loader2, RotateCcw, X } from "lucide-react";
import { ItemsSelector } from "@/components/my-custom-ui/items-list-selector";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Command } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import type { FilterOption, PopularOption, Settings } from "./types";

type Props = {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  genres: FilterOption[];
  specifications: FilterOption[];
  popular: PopularOption[];
  universes: FilterOption[];
  universesLoading?: boolean;
  universesError?: boolean;
  retryUniverses?: () => void;
  optionsLoading: boolean;
  optionsError: boolean;
  popularError?: boolean;
  retryOptions: () => void;
  retryPopular?: () => void;
  availability: { loading: boolean; total: number | null; error: boolean };
  retryAvailability: () => void;
  reset: () => void;
  start: () => void;
};

function FilterPicker({
  label,
  title,
  options,
  selected,
  onToggle,
  excluded,
}: {
  label: string;
  title: string;
  options: FilterOption[];
  selected: string[];
  onToggle: (key: string) => void;
  excluded?: boolean;
}) {
  const t = useTranslations("MovieTournament");
  return (
    <div className="min-w-0 space-y-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="min-h-11 w-full justify-between"
            aria-label={t("filterSelector", { action: label, title })}
          >
            {label} <ChevronDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          collisionPadding={12}
          className="w-[min(20rem,calc(100vw-24px))] p-0"
        >
          <Command>
            <ItemsSelector
              items={options}
              onSelect={(item) => onToggle(item.key)}
              checkIconStyle={selected}
              emptyText={t("noOptions")}
              showMovieCount={false}
            />
          </Command>
        </PopoverContent>
      </Popover>
      <div className="flex min-h-6 flex-wrap gap-1.5">
        {selected.length === 0 ? (
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {t("noneSelected")}
          </span>
        ) : (
          selected.map((key) => (
            <button
              type="button"
              key={key}
              onClick={() => onToggle(key)}
              aria-label={t("removeFilter", {
                name: options.find((item) => item.key === key)?.name ?? key,
              })}
              className={cn(
                "inline-flex min-h-9 max-w-full items-center gap-1 rounded-full border px-2 py-1 text-left text-xs break-words",
                excluded
                  ? "border-danger/40 bg-danger/10 text-red-700 dark:text-red-300"
                  : "border-main-ui-purple/40 bg-main-ui-purple/10 text-main-ui-purple dark:text-indigo-300",
              )}
            >
              <span className="min-w-0 break-words">
                {options.find((item) => item.key === key)?.name ?? key}
              </span>
              <X className="size-3 shrink-0" />
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function FilterSection({
  title,
  options,
  included,
  excluded,
  threshold,
  onChange,
}: {
  title: string;
  options: FilterOption[];
  included: string[];
  excluded: string[];
  threshold: number;
  onChange: (included: string[], excluded: string[], threshold: number) => void;
}) {
  const t = useTranslations("MovieTournament");
  const toggle = (keys: string[], key: string) =>
    keys.includes(key) ? keys.filter((item) => item !== key) : [...keys, key];
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <FilterPicker
          label={t("include")}
          title={title}
          options={options}
          selected={included}
          onToggle={(key) =>
            onChange(
              toggle(included, key),
              excluded.filter((item) => item !== key),
              threshold,
            )
          }
        />
        <FilterPicker
          label={t("exclude")}
          title={title}
          options={options}
          selected={excluded}
          excluded
          onToggle={(key) =>
            onChange(
              included.filter((item) => item !== key),
              toggle(excluded, key),
              threshold,
            )
          }
        />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{t("matchingThreshold")}</span>
          <span>{threshold}%</span>
        </div>
        <Slider
          aria-label={t("thresholdLabel", { title })}
          min={60}
          max={100}
          step={20}
          value={[threshold]}
          onValueChange={([value]) => onChange(included, excluded, value)}
        />
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {t("thresholdHelp")}
        </p>
      </div>
    </section>
  );
}

export function SettingsView(props: Props) {
  const t = useTranslations("MovieTournament");
  const panelEndRef = useRef<HTMLDivElement>(null);
  const [floating, setFloating] = useState(false);
  const { settings, setSettings, availability } = props;
  const enough =
    availability.total !== null && availability.total >= settings.size;
  const ready =
    !props.optionsLoading &&
    !props.optionsError &&
    !availability.loading &&
    !availability.error &&
    enough;

  useEffect(() => {
    const sentinel = panelEndRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => {
      setFloating(
        entry.boundingClientRect.top >
          (entry.rootBounds?.bottom ?? window.innerHeight),
      );
    });
    const updatePosition = () =>
      setFloating(sentinel.getBoundingClientRect().top > window.innerHeight);
    observer.observe(sentinel);
    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition);
    updatePosition();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <header className="space-y-2 text-center">
        {/* <p className="text-main-ui-purple text-sm font-semibold tracking-widest uppercase dark:text-indigo-300">
          {t("eyebrow")}
        </p> */}
        <h1 className="text-3xl font-bold sm:text-4xl">{t("title")}</h1>
        <p className="text-main-ui-purple text-sm font-semibold tracking-widest uppercase dark:text-indigo-300">
          {t("intro")}
        </p>
      </header>
      <Card className="min-w-0 space-y-7 p-4 sm:p-7">
        <fieldset className="space-y-3">
          <legend className="mb-3 text-lg font-semibold">{t("size")}</legend>
          <div className="grid grid-cols-2 gap-3">
            {([16, 32] as const).map((size) => (
              <button
                key={size}
                type="button"
                aria-pressed={settings.size === size}
                onClick={() => setSettings({ ...settings, size })}
                className={cn(
                  "rounded-lg border p-4 text-left transition-colors",
                  settings.size === size
                    ? "border-main-ui-purple bg-main-ui-purple/10 dark:border-indigo-400"
                    : "border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900",
                )}
              >
                <span className="block text-xl font-bold">{size}</span>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  {t("movies")}
                </span>
              </button>
            ))}
          </div>
        </fieldset>
        {props.optionsLoading ? (
          <p role="status">{t("loadingOptions")}</p>
        ) : props.optionsError ? (
          <div role="alert" className="text-danger space-y-2 text-sm">
            <p>{t("optionsError")}</p>
            <Button variant="outline" onClick={props.retryOptions}>
              {t("retry")}
            </Button>
          </div>
        ) : (
          <>
            <FilterSection
              title={t("genres")}
              options={props.genres}
              included={settings.include_genres}
              excluded={settings.exclude_genres}
              threshold={settings.genre_threshold}
              onChange={(include_genres, exclude_genres, genre_threshold) =>
                setSettings({
                  ...settings,
                  include_genres,
                  exclude_genres,
                  genre_threshold,
                })
              }
            />
            <FilterSection
              title={t("specifications")}
              options={props.specifications}
              included={settings.include_specifications}
              excluded={settings.exclude_specifications}
              threshold={settings.specification_threshold}
              onChange={(
                include_specifications,
                exclude_specifications,
                specification_threshold,
              ) =>
                setSettings({
                  ...settings,
                  include_specifications,
                  exclude_specifications,
                  specification_threshold,
                })
              }
            />
          </>
        )}
        <fieldset className="space-y-3">
          <legend className="mb-3 text-lg font-semibold">
            {t("collectionType")}
          </legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {([null, "standalone", "base"] as const).map((value) => (
              <button
                key={value ?? "all"}
                type="button"
                aria-pressed={settings.collection_type === value}
                onClick={() =>
                  setSettings({ ...settings, collection_type: value })
                }
                className={cn(
                  "rounded-lg border p-3 text-left",
                  settings.collection_type === value
                    ? "border-main-ui-purple bg-main-ui-purple/10 dark:border-indigo-400"
                    : "border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900",
                )}
              >
                <span className="block text-sm font-semibold">
                  {t(value ?? "all")}
                </span>
                <span className="mt-1 block text-xs text-neutral-500 dark:text-neutral-400">
                  {t(`${value ?? "all"}Help`)}
                </span>
              </button>
            ))}
          </div>
        </fieldset>
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">{t("popular")}</h2>
          {/* <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {t("popularHelp")}
          </p> */}
          {props.popularError ? (
            <div role="alert" className="text-danger text-sm">
              {t("popularError")}{" "}
              <Button variant="link" onClick={props.retryPopular}>
                {t("retry")}
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {props.popular.map((movie) => (
                <label
                  key={movie.key}
                  className="flex min-h-11 max-w-full cursor-pointer items-center gap-2 rounded-md border border-neutral-200 px-3 py-2 text-sm break-words dark:border-neutral-800"
                >
                  <Checkbox
                    checked={settings.exclude_movies.includes(movie.key)}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        exclude_movies:
                          checked === true
                            ? [...settings.exclude_movies, movie.key]
                            : settings.exclude_movies.filter(
                                (key) => key !== movie.key,
                              ),
                      })
                    }
                  />
                  <span className="min-w-0 break-words">{movie.name}</span>
                </label>
              ))}
              {props.popular.length === 0 && (
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  {t("popularUnavailable")}
                </span>
              )}
            </div>
          )}
        </section>
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">{t("excludeUniverses")}</h2>
          {/* <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {t("excludeUniversesHelp")}
          </p> */}
          {props.universesLoading ? (
            <p role="status" className="text-sm">
              {t("universesLoading")}
            </p>
          ) : props.universesError ? (
            <div role="alert" className="text-danger text-sm">
              {t("universesError")}{" "}
              <Button variant="link" onClick={props.retryUniverses}>
                {t("retry")}
              </Button>
            </div>
          ) : props.universes.length === 0 ? (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {t("universesUnavailable")}
            </p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {props.universes.map((universe) => (
                <label
                  key={universe.key}
                  className="flex min-h-11 max-w-full cursor-pointer items-center gap-2 rounded-md border border-neutral-200 px-3 py-2 text-sm break-words dark:border-neutral-800"
                >
                  <Checkbox
                    checked={settings.exclude_shared_universes.includes(
                      universe.key,
                    )}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        exclude_shared_universes:
                          checked === true
                            ? [
                                ...settings.exclude_shared_universes,
                                universe.key,
                              ]
                            : settings.exclude_shared_universes.filter(
                                (key) => key !== universe.key,
                              ),
                      })
                    }
                  />
                  <span className="min-w-0 break-words">{universe.name}</span>
                </label>
              ))}
            </div>
          )}
        </section>
        <div
          data-testid="tournament-availability-panel"
          className={cn(
            "sticky bottom-0 z-30 space-y-3 rounded-lg border border-neutral-200 bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-[box-shadow,border-color,background-color,transform] duration-300 motion-reduce:transition-none dark:border-neutral-800 dark:bg-neutral-950",
            floating &&
              "border-main-ui-purple/30 -translate-y-1 shadow-lg shadow-neutral-950/15 dark:border-indigo-400/30 dark:shadow-black/50",
          )}
        >
          <div
            aria-live="polite"
            className={cn(
              "rounded-lg border p-4",
              availability.total !== null &&
                (enough
                  ? "border-success/40 bg-success/10"
                  : "border-danger/40 bg-danger/10"),
            )}
          >
            {availability.loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
                {t("checking")}
              </span>
            ) : availability.error ? (
              <div role="alert">
                {t("availabilityError")}{" "}
                <Button variant="link" onClick={props.retryAvailability}>
                  {t("retry")}
                </Button>
              </div>
            ) : availability.total !== null ? (
              <>
                <strong>{t("available", { count: availability.total })}</strong>
                <p className="text-sm">
                  {enough
                    ? t("ready", { count: settings.size })
                    : t("notEnough", { count: settings.size })}
                </p>
              </>
            ) : null}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              size="lg"
              className="w-full sm:flex-1"
              disabled={!ready}
              onClick={props.start}
            >
              {t("start")}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={props.reset}
            >
              <RotateCcw /> {t("resetSettings")}
            </Button>
          </div>
        </div>
        <div
          ref={panelEndRef}
          aria-hidden="true"
          data-testid="tournament-availability-end"
          className="!mt-0 h-px"
        />
      </Card>
    </div>
  );
}
