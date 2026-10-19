"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowRight,
  Banknote,
  Clapperboard,
  Clock,
  Copy,
  Eye,
  FileText,
  Languages,
  Pencil,
  Hourglass,
  Layers,
  ListChecks,
  Radar,
  Star,
  Tags,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { AuditLogOut } from "@/orval_api/model";
import { BoxOfficeDiff } from "@/components/audit-log/audit-log-box-office-diff";
import {
  SimilarDiff,
  toSimilarChanges,
} from "@/components/audit-log/audit-log-similar-diff";
import {
  GenresDiff,
  toGenresChanges,
} from "@/components/audit-log/audit-log-genres-diff";
import {
  VisualProfileDiff,
  toVisualProfileChanges,
} from "@/components/audit-log/audit-log-visual-profile-diff";
import {
  RatingDiff,
  toRatingChanges,
} from "@/components/audit-log/audit-log-rating-diff";
import {
  PeopleDiff,
  toPersonEntries,
} from "@/components/audit-log/audit-log-people-diff";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const COLLAPSED_MAX_LENGTH = 240;

/** Maps `<entity>.<field>.<action>` to a translation key in `AuditLog.events`. */
const EVENT_LABEL_KEYS: Record<string, string> = {
  "movie.description.updated": "descriptionUpdated",
  "movie.actors.updated": "actorsUpdated",
  "movie.directors.updated": "directorsUpdated",
  "movie.rating.updated": "ratingUpdated",
  "movie.rating.created": "ratingCreated",
  "movie.visual_profile.updated": "visualProfileUpdated",
  "movie.box_office.updated": "boxOfficeUpdated",
  "movie.similar_movies.updated": "similarMoviesUpdated",
  "movie.genres.updated": "genresUpdated",
  "movie.specifications.updated": "specificationsUpdated",
  "movie.keywords.updated": "keywordsUpdated",
  "movie.action_times.updated": "actionTimesUpdated",
  "movie.visited": "movieVisited",
};

const EVENT_ICONS: Record<string, LucideIcon> = {
  "movie.description.updated": FileText,
  "movie.actors.updated": Users,
  "movie.directors.updated": Clapperboard,
  "movie.rating.updated": Star,
  "movie.rating.created": Star,
  "movie.visual_profile.updated": Radar,
  "movie.box_office.updated": Banknote,
  "movie.similar_movies.updated": Copy,
  "movie.genres.updated": Layers,
  "movie.specifications.updated": ListChecks,
  "movie.keywords.updated": Tags,
  "movie.action_times.updated": Hourglass,
  "movie.visited": Eye,
};

/** Events whose `changes` hold lists of filter entries with a match percentage. */
const FILTER_EVENTS = new Set([
  "movie.genres.updated",
  "movie.specifications.updated",
  "movie.keywords.updated",
  "movie.action_times.updated",
]);

/** Events whose `changes` hold lists of people instead of text. */
const PEOPLE_EVENTS: Record<string, "actors" | "directors"> = {
  "movie.actors.updated": "actors",
  "movie.directors.updated": "directors",
};

const LANGUAGE_LABELS: Record<string, string> = {
  en: "English",
  uk: "Українська",
};

/** Event types whose `changes` keys are language codes. */
const LANGUAGE_KEYED_EVENTS = new Set(["movie.description.updated"]);

type Change = { old: unknown; new: unknown };

const toText = (value: unknown) =>
  typeof value === "string" ? value : value == null ? "" : String(value);

function toChangeEntries(changes: AuditLogOut["changes"]) {
  return Object.entries(changes ?? {}).map(([key, value]): [string, Change] => {
    const v = (value ?? {}) as Record<string, unknown>;

    return [key, { old: v.old, new: v.new }];
  });
}

/** `created_at` is naive UTC, so append "Z" before parsing. */
export function parseUtcDate(value: string) {
  const hasTimezone = /(Z|[+-]\d{2}:?\d{2})$/i.test(value);

  return new Date(hasTimezone ? value : `${value}Z`);
}

function formatVisitedAt(value: string, locale: string) {
  const date = parseUtcDate(value);

  if (Number.isNaN(date.getTime())) return value;

  const time = date.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  if (locale === "uk") {
    const dateParts = new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).formatToParts(date);
    const day = dateParts.find((part) => part.type === "day")?.value;
    const month = dateParts.find((part) => part.type === "month")?.value;
    const year = dateParts.find((part) => part.type === "year")?.value;

    if (!day || !month || !year) {
      return `${date.toLocaleDateString(locale)}, о ${time}`;
    }

    return `${day} ${month} ${year} року о ${time}`;
  }

  const dateLabel = date.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `${dateLabel}, at ${time}`;
}

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
];

function formatRelativeTime(date: Date, locale: string) {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000);

  for (const [unit, seconds] of RELATIVE_UNITS) {
    if (Math.abs(diffSeconds) >= seconds) {
      return rtf.format(Math.round(diffSeconds / seconds), unit);
    }
  }

  return rtf.format(Math.min(diffSeconds, 0), "second");
}

type ValuePanelProps = {
  label: string;
  value: string;
  variant: "old" | "new";
};

const ValuePanel = ({ label, value, variant }: ValuePanelProps) => {
  const t = useTranslations("AuditLog");
  const [expanded, setExpanded] = useState(false);
  const isLong = value.length > COLLAPSED_MAX_LENGTH || value.includes("\n\n");
  const isOld = variant === "old";

  return (
    <div
      className={cn(
        "min-w-0 flex-1 rounded-lg border p-3",
        isOld
          ? "border-red-500/25 bg-red-500/5"
          : "border-emerald-500/25 bg-emerald-500/5",
      )}
    >
      <p
        className={cn(
          "mb-1.5 text-xs font-semibold tracking-wide uppercase",
          isOld
            ? "text-red-600 dark:text-red-400"
            : "text-emerald-600 dark:text-emerald-400",
        )}
      >
        {label}
      </p>

      {value ? (
        <p
          className={cn(
            "text-sm break-words whitespace-pre-wrap",
            isOld && "text-neutral-600 dark:text-neutral-400",
            isLong && !expanded && "line-clamp-5",
          )}
        >
          {value}
        </p>
      ) : (
        <p className="text-sm text-neutral-400 italic">{t("emptyValue")}</p>
      )}

      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="text-form-ui-blue mt-1.5 cursor-pointer text-xs font-semibold hover:underline"
        >
          {expanded ? t("showLess") : t("showMore")}
        </button>
      )}
    </div>
  );
};

type Props = {
  item: AuditLogOut;
  isLast: boolean;
  movieTitle: string;
  posterUrl: string;
  avatarUrl: string;
};

export const AuditLogItem = ({
  item,
  isLast,
  movieTitle,
  posterUrl,
  avatarUrl,
}: Props) => {
  const t = useTranslations("AuditLog");
  const locale = useLocale();

  const labelKey = EVENT_LABEL_KEYS[item.event_type];
  const eventLabel = labelKey ? t(`events.${labelKey}`) : item.event_type;
  const Icon = EVENT_ICONS[item.event_type] ?? Pencil;

  const date = parseUtcDate(item.created_at);
  const isValidDate = !Number.isNaN(date.getTime());
  const absoluteTime = isValidDate
    ? date.toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" })
    : item.created_at;

  const isLanguageKeyed = LANGUAGE_KEYED_EVENTS.has(item.event_type);
  const peopleType = PEOPLE_EVENTS[item.event_type];
  const isBoxOffice = item.event_type === "movie.box_office.updated";
  const isMovieVisited = item.event_type === "movie.visited";
  const visitedAt = toText(item.changes?.visited_at);
  const similarChanges =
    item.event_type === "movie.similar_movies.updated"
      ? toSimilarChanges(item.changes)
      : null;
  const genresChanges = FILTER_EVENTS.has(item.event_type)
    ? toGenresChanges(item.changes)
    : null;
  const visualProfileChanges =
    item.event_type === "movie.visual_profile.updated"
      ? toVisualProfileChanges(item.changes)
      : null;
  const ratingChanges =
    item.event_type === "movie.rating.updated" ||
    item.event_type === "movie.rating.created"
      ? toRatingChanges(item.changes)
      : null;

  return (
    <li className="relative flex gap-3 sm:gap-4">
      <div className="flex flex-col items-center">
        <div className="bg-main-ui-purple/10 text-main-ui-purple ring-main-ui-purple/20 z-10 flex size-9 shrink-0 items-center justify-center rounded-full ring-1">
          <Icon className="size-4" />
        </div>
        {!isLast && (
          <div className="bg-light-border dark:bg-dark-border my-1 w-px flex-1" />
        )}
      </div>

      <div className="mb-4 min-w-0 flex-1 rounded-xl border border-neutral-200 bg-white p-3 shadow-xs sm:p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <h3 className="font-semibold">{eventLabel}</h3>

          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <time
                  dateTime={isValidDate ? date.toISOString() : undefined}
                  className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400"
                >
                  <Clock className="size-3.5" />
                  {isValidDate
                    ? formatRelativeTime(date, locale)
                    : item.created_at}
                </time>
              </TooltipTrigger>
              <TooltipContent className="z-100">{absoluteTime}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <p className="mb-3 flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-300">
          <UserRound className="size-4" />
          <span className={cn(!item.user_name && "italic")}>
            {item.user_name ?? t("deletedUser")}
          </span>
        </p>

        <div className="flex flex-col gap-3">
          {isMovieVisited && visitedAt && (
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              {t.rich("movieVisitedMessage", {
                title: movieTitle,
                visitedAt: formatVisitedAt(visitedAt, locale),
                movie: (chunks) => (
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {chunks}
                  </span>
                ),
                date: (chunks) => (
                  <time className="bg-main-ui-purple/10 text-main-ui-purple ring-main-ui-purple/20 mx-1 inline-flex rounded-md px-2 py-1 text-base font-semibold tracking-tight ring-1">
                    {chunks}
                  </time>
                ),
              })}
            </p>
          )}

          {ratingChanges && (
            <RatingDiff
              changes={ratingChanges}
              userName={item.user_name ?? t("deletedUser")}
              created={item.event_type === "movie.rating.created"}
            />
          )}

          {isBoxOffice && <BoxOfficeDiff changes={item.changes} />}

          {similarChanges && (
            <SimilarDiff changes={similarChanges} posterUrl={posterUrl} />
          )}

          {genresChanges && <GenresDiff changes={genresChanges} />}

          {visualProfileChanges && (
            <VisualProfileDiff changes={visualProfileChanges} />
          )}

          {!ratingChanges &&
            !visualProfileChanges &&
            !genresChanges &&
            !similarChanges &&
            !isBoxOffice &&
            !isMovieVisited &&
            toChangeEntries(item.changes).map(([key, change]) => {
              const oldPeople = toPersonEntries(change.old);
              const newPeople = toPersonEntries(change.new);

              if (peopleType && oldPeople && newPeople) {
                return (
                  <PeopleDiff
                    key={key}
                    type={peopleType}
                    oldList={oldPeople}
                    newList={newPeople}
                    avatarUrl={avatarUrl}
                  />
                );
              }

              return (
                <div key={key} className="flex flex-col gap-2">
                  <span className="flex w-fit items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium dark:bg-neutral-800">
                    {isLanguageKeyed && <Languages className="size-3.5" />}
                    {isLanguageKeyed ? (LANGUAGE_LABELS[key] ?? key) : key}
                  </span>

                  <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                    <ValuePanel
                      label={t("before")}
                      value={toText(change.old)}
                      variant="old"
                    />
                    <ArrowRight className="hidden size-4 shrink-0 text-neutral-400 sm:block" />
                    <ValuePanel
                      label={t("after")}
                      value={toText(change.new)}
                      variant="new"
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </li>
  );
};
