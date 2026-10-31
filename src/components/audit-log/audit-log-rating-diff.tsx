"use client";

import { useTranslations } from "next-intl";
import { ArrowDown, ArrowRight, ArrowUp, Star } from "lucide-react";

import { cn } from "@/lib/utils";

export type RatingChange = { old: number | null; new: number | null };

const CRITERIA_KEYS = new Set([
  "acting",
  "plot_storyline",
  "script_dialogue",
  "music",
  "enjoyment",
  "production_design",
  "visual_effects",
  "scare_factor",
  "humor",
  "animation_cartoon",
]);

const toNumber = (value: unknown) => {
  if (value == null) return null;
  const n = Number(value);

  return Number.isFinite(n) ? n : null;
};

const toGroup = (value: unknown): Record<string, RatingChange> | undefined => {
  if (typeof value !== "object" || value === null) return undefined;

  const entries = Object.entries(value);

  return entries.length
    ? Object.fromEntries(
        entries.map(([key, v]) => {
          const change = (v ?? {}) as Record<string, unknown>;

          return [
            key,
            { old: toNumber(change.old), new: toNumber(change.new) },
          ];
        }),
      )
    : undefined;
};

export type RatingGroups = {
  user_rating?: Record<string, RatingChange>;
  overall_rating?: Record<string, RatingChange>;
};

/** Supports the grouped shape and the older flat shape (treated as the user's rating). */
export function toRatingChanges(
  changes: Record<string, unknown>,
): RatingGroups | null {
  const isGrouped = "user_rating" in changes || "overall_rating" in changes;

  if (!isGrouped) {
    const flat = toGroup(changes);

    return flat ? { user_rating: flat } : null;
  }

  const result: RatingGroups = {
    user_rating: toGroup(changes.user_rating),
    overall_rating: toGroup(changes.overall_rating),
  };

  return result.user_rating || result.overall_rating ? result : null;
}

const format = (value: number | null) =>
  value === null ? "—" : String(Number(value.toFixed(2)));

const Delta = ({
  change,
  large,
}: {
  change: RatingChange;
  large?: boolean;
}) => {
  const diff =
    change.old !== null && change.new !== null ? change.new - change.old : 0;

  if (diff === 0) return null;

  const Icon = diff > 0 ? ArrowUp : ArrowDown;

  return (
    <span
      className={cn(
        "flex items-center gap-0.5 font-medium",
        large ? "text-sm" : "text-xs",
        diff > 0
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-red-600 dark:text-red-400",
      )}
    >
      <Icon className={large ? "size-4" : "size-3"} />
      {format(Math.abs(diff))}
    </span>
  );
};

const Values = ({
  change,
  large,
  created,
}: {
  change: RatingChange;
  large?: boolean;
  created?: boolean;
}) => (
  <span
    className={cn(
      "flex items-center gap-2 tabular-nums",
      large ? "text-xl font-bold" : "text-sm",
    )}
  >
    {!created && (
      <>
        <span className="text-neutral-500 line-through dark:text-neutral-400">
          {format(change.old)}
        </span>
        <ArrowRight
          className={cn("text-neutral-400", large ? "size-4" : "size-3")}
        />
      </>
    )}
    <span className="font-semibold">{format(change.new)}</span>
    {!created && <Delta change={change} large={large} />}
  </span>
);

type GroupProps = {
  title: string;
  scoreLabel: string;
  changes: Record<string, RatingChange>;
  created?: boolean;
};

const RatingGroup = ({ title, scoreLabel, changes, created }: GroupProps) => {
  const t = useTranslations("AuditLog");
  const { rating, ratings_count, ...criteria } = changes;

  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
        {title}
      </h4>

      {rating && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <Star className="size-5 fill-amber-400 text-amber-400" />
            {scoreLabel}
          </span>
          <Values change={rating} large created={created} />
        </div>
      )}

      {(ratings_count || Object.keys(criteria).length > 0) && (
        <ul className="flex flex-col divide-y divide-neutral-200 rounded-lg border border-neutral-200 px-3 dark:divide-neutral-800 dark:border-neutral-800">
          {ratings_count && (
            <li className="flex items-center justify-between gap-3 py-2">
              <span className="text-sm text-neutral-600 dark:text-neutral-300">
                {t("votes")}
              </span>
              <span className="flex items-center gap-2 text-sm tabular-nums">
                <span className="text-neutral-500 dark:text-neutral-400">
                  {format(ratings_count.old)}
                </span>
                <ArrowRight className="size-3 text-neutral-400" />
                <span className="font-semibold">
                  {format(ratings_count.new)}
                </span>
                <span className="text-neutral-500">{t("votesUnit")}</span>
              </span>
            </li>
          )}

          {Object.entries(criteria).map(([key, change]) => (
            <li
              key={key}
              className="flex items-center justify-between gap-3 py-2"
            >
              <span className="text-sm text-neutral-600 dark:text-neutral-300">
                {CRITERIA_KEYS.has(key) ? t(`criteria.${key}`) : key}
              </span>
              <Values change={change} created={created} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

type Props = {
  changes: RatingGroups;
  userName: string;
  /** A first rating has no previous values, so only the new ones are shown for the user's rating. */
  created?: boolean;
};

export const RatingDiff = ({ changes, userName, created }: Props) => {
  const t = useTranslations("AuditLog");

  return (
    <div className="flex flex-col gap-4">
      {changes.user_rating && (
        <RatingGroup
          title={t("userRating", { name: userName })}
          scoreLabel={t("criteria.rating")}
          changes={changes.user_rating}
          created={created}
        />
      )}
      {changes.overall_rating && (
        <RatingGroup
          title={t("overallRating")}
          scoreLabel={t("averageRating")}
          changes={changes.overall_rating}
        />
      )}
    </div>
  );
};
