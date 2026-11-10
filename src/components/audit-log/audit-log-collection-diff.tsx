"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Minus, MoveVertical, Plus, Repeat } from "lucide-react";

import { cn } from "@/lib/utils";

type CollectionEntry = {
  key: string;
  title: Record<string, string>;
  poster: string | null;
  relation_type: string;
  order: number | null;
};

type CollectionChanges = { old: CollectionEntry[]; new: CollectionEntry[] };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isEntry = (value: unknown): value is CollectionEntry =>
  isRecord(value) &&
  typeof value.key === "string" &&
  isRecord(value.title) &&
  Object.values(value.title).every((title) => typeof title === "string") &&
  (typeof value.poster === "string" || value.poster === null) &&
  typeof value.relation_type === "string" &&
  (typeof value.order === "number" || value.order === null);

export function toCollectionChanges(
  changes: Record<string, unknown>,
): CollectionChanges | null {
  const collection = changes.collection;

  if (
    isRecord(collection) &&
    Array.isArray(collection.old) &&
    Array.isArray(collection.new) &&
    collection.old.every(isEntry) &&
    collection.new.every(isEntry)
  ) {
    return { old: collection.old, new: collection.new };
  }

  return null;
}

const RELATION_TYPES = [
  "base",
  "sequel",
  "prequel",
  "spin_off",
  "remake",
  "reboot",
  "crossover",
  "alternative_timeline",
  "shared_universe",
] as const;

type ColumnProps = {
  label: string;
  variant: "old" | "new";
  entries: CollectionEntry[];
  other: CollectionEntry[];
  posterUrl: string;
};

const Column = ({ label, variant, entries, other, posterUrl }: ColumnProps) => {
  const t = useTranslations("AuditLog");
  const locale = useLocale();
  const otherByKey = new Map(other.map((entry) => [entry.key, entry]));
  // The backend trims unchanged entries, so an empty side alone is ambiguous.
  const isCollectionTransition = other.some(
    (entry) => entry.relation_type === "base",
  );
  const relationLabel = (value: string) => {
    const type = RELATION_TYPES.find((relation) => relation === value);
    return type ? t(`collectionRelations.${type}`) : value.replaceAll("_", " ");
  };

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p
        className={cn(
          "text-xs font-semibold tracking-wide uppercase",
          variant === "old"
            ? "text-red-600 dark:text-red-400"
            : "text-emerald-600 dark:text-emerald-400",
        )}
      >
        {label}
      </p>

      {entries.length === 0 ? (
        <p className="text-sm text-neutral-400 italic">
          {isCollectionTransition
            ? t(
                variant === "old"
                  ? "collectionCreatedFromStandalone"
                  : "collectionDissolvedToStandalone",
              )
            : t("emptyValue")}
        </p>
      ) : (
        <ol className="flex flex-col gap-1.5">
          {entries.map((entry) => {
            const counterpart = otherByKey.get(entry.key);
            const added = !counterpart && variant === "new";
            const removed = !counterpart && variant === "old";
            const moved =
              variant === "new" &&
              counterpart &&
              counterpart.order !== entry.order;
            const relationChanged =
              variant === "new" &&
              counterpart &&
              counterpart.relation_type !== entry.relation_type;
            const title = entry.title[locale] || entry.title.en || entry.key;

            return (
              <li
                key={entry.key}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-2 py-1.5",
                  added
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : removed
                      ? "border-red-500/30 bg-red-500/5"
                      : moved || relationChanged
                        ? "border-amber-500/30 bg-amber-500/5"
                        : "border-neutral-200 dark:border-neutral-800",
                )}
              >
                <span className="w-5 shrink-0 text-center text-xs text-neutral-400">
                  {entry.order ?? "—"}
                </span>
                {entry.poster ? (
                  <Image
                    src={`${posterUrl}/posters/${entry.poster}`}
                    alt=""
                    width={32}
                    height={48}
                    className="h-12 w-8 shrink-0 rounded object-cover"
                    blurDataURL="/static/blur-image.webp"
                    placeholder="blur"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-12 w-8 shrink-0 rounded bg-neutral-100 dark:bg-neutral-800" />
                )}
                <div className="min-w-0 flex-1">
                  <Link
                    prefetch={false}
                    href={`/movies/${entry.key}`}
                    target="_blank"
                    title={title}
                    className={cn(
                      "block truncate text-sm font-medium hover:underline",
                      removed && "line-through",
                    )}
                  >
                    {title}
                  </Link>
                  {!relationChanged ? (
                    <p className="text-xs text-neutral-500">
                      {relationLabel(entry.relation_type)}
                    </p>
                  ) : (
                    <p className="flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400">
                      <Repeat className="size-3" />
                      <span>{relationLabel(counterpart.relation_type)}</span>
                      <ArrowRight className="size-3" />
                      <span>{relationLabel(entry.relation_type)}</span>
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1 text-xs">
                  {(added || removed) && (
                    <span
                      className={cn(
                        "flex items-center gap-1 rounded-full px-2 py-0.5 font-medium",
                        added
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                          : "bg-red-500/15 text-red-700 dark:text-red-400",
                      )}
                    >
                      {added ? (
                        <Plus className="size-3" />
                      ) : (
                        <Minus className="size-3" />
                      )}
                      {t(added ? "status.added" : "status.removed")}
                    </span>
                  )}
                  {moved && (
                    <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400">
                      <MoveVertical className="size-3" />
                      <ArrowRight className="size-3" />
                      {entry.order ?? "—"}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};

export const CollectionDiff = ({
  changes,
  posterUrl,
}: {
  changes: CollectionChanges;
  posterUrl: string;
}) => {
  const t = useTranslations("AuditLog");

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <Column
        label={t("before")}
        variant="old"
        entries={changes.old}
        other={changes.new}
        posterUrl={posterUrl}
      />
      <Column
        label={t("after")}
        variant="new"
        entries={changes.new}
        other={changes.old}
        posterUrl={posterUrl}
      />
    </div>
  );
};
