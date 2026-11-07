"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, ChevronRight, Minus, Plus, Repeat } from "lucide-react";

import { cn } from "@/lib/utils";
import { getPercentageMatchClasses } from "@/components/movie/utils";

type L10n = Record<string, string>;

type GenreEntry = {
  key: string;
  name: L10n;
  percentage_match: number;
  genre?: { key: string; name: L10n };
};

/** `changes` key -> super-search query param used to link entries. */
const SECTIONS = [
  { key: "genres", param: "genre" },
  { key: "subgenres", param: "subgenre" },
  { key: "specifications", param: "specification" },
  { key: "keywords", param: "keyword" },
  { key: "action_times", param: "action_time" },
] as const;

type SectionKey = (typeof SECTIONS)[number]["key"];

export type GenresChanges = Partial<
  Record<SectionKey, { old: GenreEntry[]; new: GenreEntry[] }>
>;

const isEntry = (v: unknown): v is GenreEntry =>
  typeof v === "object" &&
  v !== null &&
  typeof (v as GenreEntry).key === "string" &&
  typeof (v as GenreEntry).name === "object";

function toSection(value: unknown) {
  const v = value as { old?: unknown; new?: unknown } | undefined;

  if (
    v &&
    Array.isArray(v.old) &&
    Array.isArray(v.new) &&
    v.old.every(isEntry) &&
    v.new.every(isEntry)
  ) {
    return { old: v.old as GenreEntry[], new: v.new as GenreEntry[] };
  }
}

export function toGenresChanges(
  changes: Record<string, unknown>,
): GenresChanges | null {
  const result: GenresChanges = {};

  for (const { key } of SECTIONS) {
    const section = toSection(changes?.[key]);

    if (section) result[key] = section;
  }

  return Object.keys(result).length ? result : null;
}

type Status = "added" | "removed" | "changed" | "unchanged";

type Row = { entry: GenreEntry; previous?: GenreEntry; status: Status };

function diffEntries(oldList: GenreEntry[], newList: GenreEntry[]): Row[] {
  const oldByKey = new Map(oldList.map((e) => [e.key, e]));
  const newKeys = new Set(newList.map((e) => e.key));

  return [
    ...newList.map((entry): Row => {
      const previous = oldByKey.get(entry.key);

      if (!previous) return { entry, status: "added" };

      return {
        entry,
        previous,
        status:
          previous.percentage_match !== entry.percentage_match
            ? "changed"
            : "unchanged",
      };
    }),
    ...oldList
      .filter((e) => !newKeys.has(e.key))
      .map((entry): Row => ({ entry, status: "removed" })),
  ];
}

const ROW_STYLES: Record<Status, string> = {
  added: "border-emerald-500/30 bg-emerald-500/5",
  removed: "border-red-500/30 bg-red-500/5",
  changed: "border-amber-500/30 bg-amber-500/5",
  unchanged: "border-neutral-200 opacity-60 dark:border-neutral-800",
};

const STATUS_ICONS = { added: Plus, removed: Minus, changed: Repeat };

const STATUS_BADGE_STYLES = {
  added: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  removed: "bg-red-500/15 text-red-700 dark:text-red-400",
  changed: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
};

const Percentage = ({ value }: { value: number }) => (
  <span
    className={cn(
      "rounded-full px-2 py-0.5 text-xs font-bold text-black",
      getPercentageMatchClasses(value),
    )}
  >
    {value}%
  </span>
);

type SectionProps = {
  title: string;
  rows: Row[];
  param: string;
  isSubgenre?: boolean;
};

const Section = ({ title, rows, param, isSubgenre }: SectionProps) => {
  const t = useTranslations("AuditLog");
  const locale = useLocale();
  const localize = (name: L10n) => name?.[locale] ?? name?.en ?? "";

  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
        {title}
      </h4>

      <ul className="flex flex-col gap-1.5">
        {rows.map(({ entry, previous, status }) => {
          const Icon = status === "unchanged" ? null : STATUS_ICONS[status];

          return (
            <li
              key={`${entry.key}-${status}`}
              className={cn(
                "flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2",
                ROW_STYLES[status],
              )}
            >
              <span
                className={cn(
                  "flex flex-wrap items-center gap-1 text-sm font-medium",
                  status === "removed" && "line-through",
                )}
              >
                {isSubgenre && entry.genre && (
                  <>
                    <Link
                      href={`/super-search/?genre=${entry.genre.key}`}
                      target="_blank"
                      className="text-neutral-500 hover:underline dark:text-neutral-400"
                    >
                      {localize(entry.genre.name)}
                    </Link>
                    <ChevronRight className="size-3.5 text-neutral-400" />
                  </>
                )}
                <Link
                  href={`/super-search/?${param}=${entry.key}`}
                  target="_blank"
                  className="hover:underline"
                >
                  {localize(entry.name)}
                </Link>
              </span>

              <span className="flex items-center gap-2">
                {status === "changed" && previous && (
                  <>
                    <Percentage value={previous.percentage_match} />
                    <ArrowRight className="size-3 text-neutral-400" />
                  </>
                )}
                <Percentage value={entry.percentage_match} />

                {Icon && status !== "unchanged" && (
                  <span
                    className={cn(
                      "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                      STATUS_BADGE_STYLES[status],
                    )}
                  >
                    <Icon className="size-3" />
                    {t(
                      `status.${status === "changed" ? "changedValue" : status}`,
                    )}
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const GenresDiff = ({ changes }: { changes: GenresChanges }) => {
  const t = useTranslations("AuditLog");

  return (
    <div className="flex flex-col gap-4">
      {SECTIONS.map(({ key, param }) => {
        const section = changes[key];

        return (
          section && (
            <Section
              key={key}
              title={t(`sections.${key}`)}
              rows={diffEntries(section.old, section.new)}
              param={param}
              isSubgenre={key === "subgenres"}
            />
          )
        );
      })}
    </div>
  );
};
