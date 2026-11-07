"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { DateRange } from "react-day-picker";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  History,
  Inbox,
  Search,
  UserRound,
  X,
  Calendar as CalendarIcon,
  type LucideIcon,
} from "lucide-react";
// IP addres of Anonim user?
import {
  getAuditLogUsers,
  getGeneralAuditLogs,
  type GeneralAuditLogFilters,
} from "@/app/(app)/services/admin-api";
import { cn } from "@/lib/utils";
import type {
  AuditLogDayGroupOut,
  AuditLogSummaryOut,
  AuditLogSummaryOutUserRole,
  AuditLogUserOut,
} from "@/orval_api/model";
import { Button } from "@/components/ui/button";
import { format, parse, startOfMonth, subDays } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/my-custom-ui/spinner";
import {
  EVENT_ICONS,
  EVENT_LABEL_KEYS,
  parseUtcDate,
} from "@/components/audit-log/audit-log-item";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Status = "loading" | "loadingMore" | "success" | "error";
type Category = "content" | "similar_movies" | "ratings" | "visits";

const CATEGORIES: { value: Category; labelKey: string }[] = [
  { value: "content", labelKey: "filterContent" },
  { value: "similar_movies", labelKey: "filterSimilarMovies" },
  { value: "ratings", labelKey: "filterRatings" },
  { value: "visits", labelKey: "filterVisits" },
];

const CATEGORY_EVENT_TYPES: Record<Category, string[]> = {
  content: [
    "movie.created",
    "movie.description.updated",
    "movie.title.updated",
    "movie.details.updated",
    "movie.box_office.updated",
    "movie.actors.updated",
    "movie.directors.updated",
    "movie.visual_profile.updated",
    "movie.genres.updated",
    "movie.specifications.updated",
    "movie.keywords.updated",
    "movie.action_times.updated",
    "movie.poster.updated",
  ],
  similar_movies: ["movie.similar_movies.updated"],
  ratings: ["movie.rating.created", "movie.rating.updated"],
  visits: ["movie.visited"],
};

/** Only movies have audit events for now; the rest are shown as disabled. */
const ENTITY_TYPES = [
  { value: "movie", labelKey: "entityMovie", disabled: false },
  { value: "tvseries", labelKey: "tvseries", disabled: true },
  { value: "anime", labelKey: "anime", disabled: true },
  { value: "games", labelKey: "games", disabled: true },
];

const SEARCH_DEBOUNCE_MS = 300;

const DATE_PRESETS: { key: string; getRange: () => DateRange }[] = [
  {
    key: "presetToday",
    getRange: () => ({ from: new Date(), to: new Date() }),
  },
  {
    key: "presetYesterday",
    getRange: () => {
      const day = subDays(new Date(), 1);
      return { from: day, to: day };
    },
  },
  {
    key: "presetLast7",
    getRange: () => ({ from: subDays(new Date(), 6), to: new Date() }),
  },
  {
    key: "presetLast30",
    getRange: () => ({ from: subDays(new Date(), 29), to: new Date() }),
  },
  {
    key: "presetThisMonth",
    getRange: () => ({ from: startOfMonth(new Date()), to: new Date() }),
  },
];

/** Pagination counts items, so a day may continue on the next page. */
function mergeGroups(
  prev: AuditLogDayGroupOut[],
  page: AuditLogDayGroupOut[],
): AuditLogDayGroupOut[] {
  if (!prev.length) return page;

  const result = [...prev];
  const last = result[result.length - 1];

  page.forEach((group, i) => {
    if (i === 0 && group.date === last.date) {
      result[result.length - 1] = {
        ...last,
        items: [...last.items, ...group.items],
      };
    } else {
      result.push(group);
    }
  });

  return result;
}

export const GeneralAuditLog = ({ posterURL }: { posterURL: string }) => {
  const t = useTranslations("AuditLog");
  const locale = useLocale();

  const [groups, setGroups] = useState<AuditLogDayGroupOut[]>([]);
  const [latestEvent, setLatestEvent] = useState<AuditLogSummaryOut | null>(
    null,
  );
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [sentinelEl, setSentinelEl] = useState<HTMLDivElement | null>(null);
  const requestId = useRef(0);

  const [category, setCategory] = useState<Category>("content");
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [entityType, setEntityType] = useState<string | undefined>("movie");
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [userId, setUserId] = useState<number | undefined>();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<AuditLogUserOut[]>([]);

  useEffect(() => {
    getAuditLogUsers()
      .then((res) => {
        if (res.status === 200 && res.data) setUsers(res.data.users);
      })
      .catch((error) => console.error("Fetch audit users error:", error));
  }, []);

  useEffect(() => {
    const timer = setTimeout(
      () => setSearch(searchInput.trim()),
      SEARCH_DEBOUNCE_MS,
    );

    return () => clearTimeout(timer);
  }, [searchInput]);

  const dateRange: DateRange | undefined =
    dateFrom || dateTo
      ? {
          from: dateFrom
            ? parse(dateFrom, "yyyy-MM-dd", new Date())
            : undefined,
          to: dateTo ? parse(dateTo, "yyyy-MM-dd", new Date()) : undefined,
        }
      : undefined;
  const invalidRange = !!dateFrom && !!dateTo && dateFrom > dateTo;

  // The calendar edits a draft; the backend is queried only on submit
  const isMobile = useIsMobile();
  const [dateOpen, setDateOpen] = useState(false);
  const [draftRange, setDraftRange] = useState<DateRange | undefined>();

  const handleDateOpenChange = (open: boolean) => {
    if (open) setDraftRange(dateRange);
    setDateOpen(open);
  };

  const applyDates = () => {
    const from = draftRange?.from;
    // A single selected day filters by that day only
    const to = draftRange?.to ?? from;

    setDateFrom(from ? format(from, "yyyy-MM-dd") : "");
    setDateTo(to ? format(to, "yyyy-MM-dd") : "");
    setDateOpen(false);
  };

  const loadPage = useCallback(
    async (filters: GeneralAuditLogFilters, cursor?: string) => {
      const id = ++requestId.current;
      setStatus(cursor ? "loadingMore" : "loading");

      try {
        const res = await getGeneralAuditLogs(filters, cursor);

        if (id !== requestId.current) return;

        if (res.status === 200 && res.data) {
          const { groups: page, next_cursor, latest_event } = res.data;

          // Pinned and unfiltered: refreshed on reload, ignored on pagination
          if (!cursor) setLatestEvent(latest_event ?? null);

          setGroups((prev) => (cursor ? mergeGroups(prev, page) : page));
          setNextCursor(next_cursor ?? null);
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        if (id !== requestId.current) return;

        console.error("Fetch general audit logs error:", error);
        setStatus("error");
      }
    },
    [],
  );

  const filters: GeneralAuditLogFilters = {
    sort,
    lang: locale as GeneralAuditLogFilters["lang"],
    category,
    event_type: eventTypes,
    entity_type: entityType,
    user_id: userId,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    search,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
  const filtersKey = JSON.stringify(filters);
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  // Any filter change resets the list and drops the cursor
  useEffect(() => {
    if (invalidRange) return;

    setGroups([]);
    setNextCursor(null);
    loadPage(filtersRef.current);

    return () => {
      requestId.current++;
    };
  }, [filtersKey, invalidRange, loadPage]);

  useEffect(() => {
    if (!sentinelEl || !nextCursor || status !== "success") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadPage(filtersRef.current, nextCursor);
      },
      { rootMargin: "0px 0px 300px 0px" },
    );

    observer.observe(sentinelEl);

    return () => observer.disconnect();
  }, [sentinelEl, nextCursor, status, loadPage]);

  const hasFilters =
    eventTypes.length > 0 ||
    entityType !== undefined ||
    userId !== undefined ||
    !!dateFrom ||
    !!dateTo ||
    !!searchInput;

  const resetFilters = () => {
    setEventTypes([]);
    setEntityType(undefined);
    setUserId(undefined);
    setDateFrom("");
    setDateTo("");
    setSearchInput("");
  };

  const formatDay = (value: string) => {
    const date = new Date(value + "T00:00:00Z");

    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleDateString(locale, {
          dateStyle: "full",
          timeZone: "UTC",
        });
  };

  const formatTime = (value: string) => {
    const date = parseUtcDate(value);

    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleTimeString(locale, {
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
        });
  };

  const getLabel = (eventType: string) => {
    const key = EVENT_LABEL_KEYS[eventType];

    return key ? t("events." + key) : t("unknownEvent");
  };

  const formatDateTime = (value: string) => {
    const date = parseUtcDate(value);

    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleString(locale, {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
        });
  };

  const isEmpty = status === "success" && groups.length === 0;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-main-ui-purple/10 text-main-ui-purple flex size-10 items-center justify-center rounded-full">
          <History className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{t("generalTitle")}</h1>
          <p className="text-muted-foreground text-base">
            {t("generalDescription")}
          </p>
        </div>
      </div>

      {latestEvent && (
        <section aria-label={t("latestEvent")} className="mb-6">
          <h2 className="text-main-ui-purple mb-2 flex items-center gap-2 text-base font-semibold tracking-wide uppercase">
            <span className="relative flex size-2.5">
              <span className="bg-main-ui-purple absolute inline-flex size-full animate-ping rounded-full opacity-60" />
              <span className="bg-main-ui-purple relative inline-flex size-2.5 rounded-full" />
            </span>
            {t("latestEvent")}
          </h2>
          <ul>
            <LogRow
              featured
              item={latestEvent}
              label={getLabel(latestEvent.event_type)}
              time={formatDateTime(latestEvent.created_at)}
              author={latestEvent.user_name ?? t("anonymous")}
              userRole={latestEvent.user_role}
              deletedLabel={t("entityDeleted")}
              posterURL={posterURL}
            />
          </ul>
        </section>
      )}

      <div className="bg-card dark:border-main-ui-purple mb-6 space-y-3 rounded-lg border p-3">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map(({ value, labelKey }) => {
            const active = category === value;

            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  if (value !== category) {
                    setCategory(value);
                    setEventTypes([]);
                  }
                }}
                className={cn(
                  "rounded-full border px-3 py-1 text-base transition-colors",
                  active
                    ? "bg-main-ui-purple border-main-ui-purple text-white"
                    : "hover:bg-accent",
                )}
              >
                {t(labelKey)}
              </button>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={() => setSort((s) => (s === "desc" ? "asc" : "desc"))}
          >
            {sort === "desc" ? (
              <ArrowDownWideNarrow className="size-4" />
            ) : (
              <ArrowUpNarrowWide className="size-4" />
            )}
            {sort === "desc" ? t("newestFirst") : t("oldestFirst")}
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground text-base">
            {t("eventTypes")}:
          </span>
          {CATEGORY_EVENT_TYPES[category].map((eventType) => {
            const active = eventTypes.includes(eventType);

            return (
              <button
                key={eventType}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  setEventTypes((prev) =>
                    active
                      ? prev.filter((type) => type !== eventType)
                      : [...prev, eventType],
                  )
                }
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-base transition-colors",
                  active
                    ? "bg-main-ui-purple border-main-ui-purple text-white"
                    : "hover:bg-main-ui-purple dark:hover:bg-main-dark-hover",
                )}
              >
                {getLabel(eventType)}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground text-base">
            {t("entityType")}:
          </span>
          {ENTITY_TYPES.map(({ value, labelKey, disabled }) => {
            const active = entityType === value;

            return (
              <button
                key={value}
                type="button"
                disabled={disabled}
                aria-pressed={active}
                onClick={() => {
                  if (entityType === value) return;
                  setEntityType(active ? undefined : value);
                }}
                className={cn(
                  "rounded-full border px-3 py-1 text-base transition-colors",
                  active
                    ? "bg-main-ui-purple border-main-ui-purple text-white"
                    : "hover:bg-accent",
                  "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent",
                )}
              >
                {t(labelKey)}
              </button>
            );
          })}
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value.slice(0, 128))}
              placeholder={t("searchPlaceholder")}
              className="dark:focus-visible:border-main-ui-purple border-main-ui-purple dark:border-main-ui-purple/50 pl-8"
            />
          </div>

          <Select onValueChange={(e) => setUserId(e ? Number(e) : undefined)}>
            <SelectTrigger className="" aria-label="language-selector">
              <SelectValue placeholder={t("allUsers")} />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectGroup key={user.id}>
                  <SelectItem value={String(user.id)}>
                    {user.full_name} ({user.role})
                  </SelectItem>
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>

          <Popover open={dateOpen} onOpenChange={handleDateOpenChange}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start font-normal">
                <CalendarIcon className="size-4" />
                {dateFrom || dateTo ? (
                  <span>
                    {dateFrom || "…"} – {dateTo || "…"}
                  </span>
                ) : (
                  <span className="text-muted-foreground">
                    {t("dateFrom")} – {t("dateTo")}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto max-w-[calc(100vw-1rem)] p-2"
              align={isMobile ? "center" : "start"}
              collisionPadding={8}
            >
              <div className="mb-2 flex flex-wrap gap-1">
                {DATE_PRESETS.map((preset) => (
                  <Button
                    key={preset.key}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setDraftRange(preset.getRange())}
                  >
                    {t(preset.key)}
                  </Button>
                ))}
              </div>
              <Calendar
                mode="range"
                defaultMonth={draftRange?.from}
                selected={draftRange}
                onSelect={setDraftRange}
                numberOfMonths={isMobile ? 1 : 2}
                className="mx-auto"
              />
              <div className="mt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={!draftRange?.from}
                  onClick={() => setDraftRange(undefined)}
                >
                  {t("clearDates")}
                </Button>
                <Button type="button" size="sm" onClick={applyDates}>
                  {t("applyDates")}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <X className="size-4" />
            {t("resetFilters")}
          </Button>
        )}
      </div>

      {status === "loading" && (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      )}

      {status === "error" && groups.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-muted-foreground">{t("loadError")}</p>
          <Button
            variant="outline"
            onClick={() => loadPage(filtersRef.current)}
          >
            {t("retry")}
          </Button>
        </div>
      )}

      {isEmpty && (
        <div className="text-muted-foreground flex flex-col items-center gap-2 py-12">
          <Inbox className="size-10" />
          <p>{hasFilters ? t("noResults") : t("empty")}</p>
        </div>
      )}

      {groups.map((group) => (
        <section key={group.date} className="mb-6">
          <h2 className="bg-background/90 text-muted-foreground sticky top-0 z-10 mb-2 py-1 text-lg font-semibold backdrop-blur">
            {formatDay(group.date)}
          </h2>
          <ul className="space-y-2">
            {group.items.map((item) => (
              <LogRow
                key={item.id}
                item={item}
                label={getLabel(item.event_type)}
                time={formatTime(item.created_at)}
                author={item.user_name ?? t("anonymous")}
                userRole={item.user_role}
                deletedLabel={t("entityDeleted")}
                posterURL={posterURL}
              />
            ))}
          </ul>
        </section>
      ))}

      {groups.length > 0 && (
        <div ref={setSentinelEl} className="flex flex-col items-center py-6">
          {status === "loadingMore" && (
            <div className="text-muted-foreground flex items-center gap-2 text-base">
              <Spinner />
              {t("loadingMore")}
            </div>
          )}

          {status === "error" && (
            <Button
              variant="outline"
              onClick={() =>
                loadPage(filtersRef.current, nextCursor ?? undefined)
              }
            >
              {t("retry")}
            </Button>
          )}

          {status === "success" && !nextCursor && (
            <p className="text-muted-foreground text-base">{t("endOfList")}</p>
          )}
        </div>
      )}
    </div>
  );
};

type RowProps = {
  item: AuditLogSummaryOut;
  label: string;
  time: string;
  author: string;
  deletedLabel: string;
  posterURL: string;
  featured?: boolean;
  userRole?: AuditLogSummaryOutUserRole;
};

const LogRow = ({
  item,
  label,
  time,
  author,
  deletedLabel,
  posterURL,
  featured,
  userRole,
}: RowProps) => {
  const Icon: LucideIcon = EVENT_ICONS[item.event_type] ?? History;
  const href =
    item.entity_type === "movie" && item.entity_key
      ? "/movies/" + item.entity_key
      : null;
  const title = item.entity_title ?? item.entity_key ?? deletedLabel;

  const content = (
    <>
      {item.entity_poster ? (
        <Image
          src={posterURL + "/posters/" + item.entity_poster}
          alt=""
          width={featured ? 60 : 40}
          height={featured ? 90 : 60}
          className={cn(
            "h-[60px] w-10 shrink-0 rounded object-cover",
            featured && "h-[90px] w-[60px] shadow-md",
          )}
          blurDataURL="/static/blur-image.webp"
          placeholder="blur"
        />
      ) : (
        <div
          className={cn(
            "bg-muted h-[60px] w-10 shrink-0 rounded",
            featured && "h-[90px] w-[60px]",
          )}
        />
      )}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "font-medium whitespace-break-spaces",
            featured && "text-xl font-semibold",
            !item.entity_title && "text-muted-foreground italic",
          )}
        >
          {title}
        </p>
        <p className="text-main-ui-purple flex items-center gap-1.5 text-lg">
          <Icon className="size-5 shrink-0" />
          {label}
        </p>
        <p
          className={cn(
            "text-muted-foreground flex items-center gap-1",
            userRole && "text-yellow-500",
          )}
        >
          <UserRound className="size-4" />
          {author}
        </p>
      </div>
      <time
        dateTime={item.created_at}
        className="text-muted-foreground shrink-0 text-xs sm:text-sm"
      >
        {time}
      </time>
    </>
  );

  const baseClass = cn(
    "flex items-center gap-3 rounded-lg border bg-card p-3 shadow-xs transition-colors",
    featured &&
      "from-main-ui-purple/15 via-card to-card border-main-ui-purple/60 gap-4 bg-gradient-to-r p-4 shadow-md",
  );

  return (
    <li>
      {href ? (
        <Link
          href={href}
          prefetch={false}
          className={cn(
            baseClass,
            "hover:border-main-ui-purple/50 hover:bg-accent dark:border-main-ui-purple",
          )}
        >
          {content}
        </Link>
      ) : (
        <div className={baseClass}>{content}</div>
      )}
    </li>
  );
};
