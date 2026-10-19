"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Minus, MoveVertical, Plus, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

type SimilarEntry = {
  rank: number;
  key: string;
  title: Record<string, string>;
  poster?: string | null;
  similarity_score: number;
};

export type SimilarChanges = { old: SimilarEntry[]; new: SimilarEntry[] };

const isEntry = (v: unknown): v is SimilarEntry =>
  typeof v === "object" &&
  v !== null &&
  typeof (v as SimilarEntry).key === "string" &&
  typeof (v as SimilarEntry).rank === "number";

export function toSimilarChanges(
  changes: Record<string, unknown>,
): SimilarChanges | null {
  const v = changes?.similar_movies as
    | { old?: unknown; new?: unknown }
    | undefined;

  if (
    v &&
    Array.isArray(v.old) &&
    Array.isArray(v.new) &&
    v.old.every(isEntry) &&
    v.new.every(isEntry)
  ) {
    return { old: v.old as SimilarEntry[], new: v.new as SimilarEntry[] };
  }

  return null;
}

type Status = "added" | "removed" | "moved" | "unchanged";

const ROW_STYLES: Record<Status, string> = {
  added: "border-emerald-500/30 bg-emerald-500/5",
  removed: "border-red-500/30 bg-red-500/5",
  moved: "border-amber-500/30 bg-amber-500/5",
  unchanged: "border-neutral-200 opacity-60 dark:border-neutral-800",
};

const BADGE_STYLES = {
  added: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  removed: "bg-red-500/15 text-red-700 dark:text-red-400",
  moved: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
};

const ICONS = { added: Plus, removed: Minus, moved: MoveVertical };

type ColumnProps = {
  label: string;
  variant: "old" | "new";
  entries: SimilarEntry[];
  other: SimilarEntry[];
  posterUrl: string;
};

const Column = ({ label, variant, entries, other, posterUrl }: ColumnProps) => {
  const t = useTranslations("AuditLog");
  const locale = useLocale();
  const otherByKey = new Map(other.map((e) => [e.key, e]));

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

      <ol className="flex flex-col gap-1.5">
        {[...entries]
          .sort((a, b) => a.rank - b.rank)
          .map((entry) => {
            const counterpart = otherByKey.get(entry.key);
            const status: Status = !counterpart
              ? variant === "new"
                ? "added"
                : "removed"
              : counterpart.rank !== entry.rank && variant === "new"
                ? "moved"
                : "unchanged";
            const Icon = status === "unchanged" ? null : ICONS[status];

            return (
              <li
                key={entry.key}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-2 py-1.5",
                  ROW_STYLES[status],
                )}
              >
                <span className="w-5 shrink-0 text-center text-xs text-neutral-400">
                  {entry.rank}
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

                <Link
                  prefetch={false}
                  href={`/movies/${entry.key}`}
                  target="_blank"
                  className={cn(
                    "min-w-0 flex-1 truncate text-sm font-medium hover:underline",
                    status === "removed" && "line-through",
                  )}
                >
                  {entry.title?.[locale] ?? entry.title?.en ?? entry.key}
                </Link>

                {status === "moved" && counterpart && (
                  <span className="flex items-center gap-0.5 text-xs text-neutral-500">
                    {counterpart.rank}
                    <ArrowRight className="size-3" />
                    {entry.rank}
                  </span>
                )}

                {Icon && status !== "unchanged" && (
                  <span
                    className={cn(
                      "flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                      BADGE_STYLES[status],
                    )}
                  >
                    <Icon className="size-3" />
                    {t(`status.${status}`)}
                  </span>
                )}

                <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-xs tabular-nums dark:bg-neutral-800">
                  {Number(entry.similarity_score.toFixed(2))}
                </span>
              </li>
            );
          })}
      </ol>
    </div>
  );
};

export const SimilarDiff = ({
  changes,
  posterUrl,
}: {
  changes: SimilarChanges;
  posterUrl: string;
}) => {
  const t = useTranslations("AuditLog");
  const isFirstRun = changes.old.length === 0;

  return (
    <div className="flex flex-col gap-3">
      {isFirstRun && (
        <p className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
          <Sparkles className="size-4" />
          {t("firstGenerated")}
        </p>
      )}

      <div className={cn("grid gap-3", !isFirstRun && "lg:grid-cols-2")}>
        {!isFirstRun && (
          <Column
            label={t("oldChart")}
            variant="old"
            entries={changes.old}
            other={changes.new}
            posterUrl={posterUrl}
          />
        )}
        <Column
          label={t("newChart")}
          variant="new"
          entries={changes.new}
          other={changes.old}
          posterUrl={posterUrl}
        />
      </div>
    </div>
  );
};
