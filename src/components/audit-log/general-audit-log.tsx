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
  AuditLogUserOut,
} from "@/orval_api/model";
import { Button } from "@/components/ui/button";
import { format, parse } from "date-fns";
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
type Category = "content" | "ratings" | "visits";

const CATEGORIES: { value: Category; labelKey: string }[] = [
  { value: "content", labelKey: "filterContent" },
  { value: "ratings", labelKey: "filterRatings" },
  { value: "visits", labelKey: "filterVisits" },
];

/** Only movies have audit events for now; the rest are shown as disabled. */
const ENTITY_TYPES = [
  { value: "movie", labelKey: "entityMovie", disabled: false },
  { value: "tvseries", labelKey: "tvseries", disabled: true },
  { value: "anime", labelKey: "anime", disabled: true },
  { value: "games", labelKey: "games", disabled: true },
];

const SEARCH_DEBOUNCE_MS = 300;

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
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [sentinelEl, setSentinelEl] = useState<HTMLDivElement | null>(null);
  const requestId = useRef(0);

  const [categories, setCategories] = useState<Category[]>([]);
  const [included, setIncluded] = useState<string[]>([]);
  const [excluded, setExcluded] = useState<string[]>([]);
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

  const loadPage = useCallback(
    async (filters: GeneralAuditLogFilters, cursor?: string) => {
      const id = ++requestId.current;
      setStatus(cursor ? "loadingMore" : "loading");

      try {
        const res = await getGeneralAuditLogs(filters, cursor);

        if (id !== requestId.current) return;

        if (res.status === 200 && res.data) {
          const { groups: page, next_cursor } = res.data;

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
    category: categories,
    event_type: included,
    exclude_event_type: excluded,
    entity_type: entityType,
    user_id: userId,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    search,
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

  const toggleCategory = (value: Category) =>
    setCategories((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value],
    );

  const toggleIncluded = (value: string) =>
    setIncluded((prev) =>
      prev.includes(value) ? prev.filter((e) => e !== value) : [...prev, value],
    );

  const toggleExcluded = (value: string) =>
    setExcluded((prev) =>
      prev.includes(value) ? prev.filter((e) => e !== value) : [...prev, value],
    );

  const hasFilters =
    categories.length > 0 ||
    included.length > 0 ||
    excluded.length > 0 ||
    entityType !== undefined ||
    userId !== undefined ||
    !!dateFrom ||
    !!dateTo ||
    !!searchInput;

  const resetFilters = () => {
    setCategories([]);
    setIncluded([]);
    setExcluded([]);
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

  const isEmpty = status === "success" && groups.length === 0;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-main-ui-purple/10 text-main-ui-purple flex size-10 items-center justify-center rounded-full">
          <History className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{t("generalTitle")}</h1>
          <p className="text-muted-foreground text-sm">
            {t("generalDescription")}
          </p>
        </div>
      </div>

      <div className="bg-card dark:border-main-ui-purple mb-6 space-y-3 rounded-lg border p-3">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map(({ value, labelKey }) => {
            const active = categories.includes(value);

            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                onClick={() => toggleCategory(value)}
                className={cn(
                  "rounded-full border px-3 py-1 text-sm transition-colors",
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
          <span className="text-muted-foreground text-sm">
            {t("eventTypes")}:
          </span>
          {Object.keys(EVENT_LABEL_KEYS).map((eventType) => {
            const active = included.includes(eventType);

            return (
              <button
                key={eventType}
                type="button"
                aria-pressed={active}
                onClick={() => toggleIncluded(eventType)}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-sm transition-colors",
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
          <span className="text-muted-foreground text-sm">
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
                onClick={() => setEntityType(active ? undefined : value)}
                className={cn(
                  "rounded-full border px-3 py-1 text-sm transition-colors",
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

        <details className="group">
          <summary className="text-muted-foreground hover:text-foreground cursor-pointer text-sm select-none">
            {t("excludeEvents")}
            {excluded.length > 0 &&
              " (" + t("excludedCount", { count: excluded.length }) + ")"}
          </summary>
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.keys(EVENT_LABEL_KEYS).map((eventType) => {
              const active = excluded.includes(eventType);

              return (
                <button
                  key={eventType}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleExcluded(eventType)}
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-xs transition-colors",
                    active
                      ? "border-danger/50 bg-danger/10 text-danger line-through"
                      : "hover:bg-danger/75",
                  )}
                >
                  {getLabel(eventType)}
                </button>
              );
            })}
          </div>
        </details>

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

          <Popover>
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
            <PopoverContent className="w-auto p-2" align="start">
              <Calendar
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={(range) => {
                  setDateFrom(
                    range?.from ? format(range.from, "yyyy-MM-dd") : "",
                  );
                  setDateTo(range?.to ? format(range.to, "yyyy-MM-dd") : "");
                }}
                numberOfMonths={2}
              />
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
          <h2 className="bg-background/90 text-muted-foreground sticky top-0 z-10 mb-2 py-1 text-sm font-semibold backdrop-blur">
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
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
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
            <p className="text-muted-foreground text-sm">{t("endOfList")}</p>
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
};

const LogRow = ({
  item,
  label,
  time,
  author,
  deletedLabel,
  posterURL,
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
          width={40}
          height={60}
          className="h-[60px] w-10 shrink-0 rounded object-cover"
          blurDataURL="/static/blur-image.webp"
          placeholder="blur"
        />
      ) : (
        <div className="bg-muted h-[60px] w-10 shrink-0 rounded" />
      )}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "font-medium whitespace-break-spaces",
            !item.entity_title && "text-muted-foreground italic",
          )}
        >
          {title}
        </p>
        <p className="text-main-ui-purple flex items-center gap-1.5 text-sm">
          <Icon className="size-4 shrink-0" />
          {label}
        </p>
        <p className="text-muted-foreground flex items-center gap-1 text-xs">
          <UserRound className="size-3" />
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

  const baseClass =
    "flex items-center gap-3 rounded-lg border bg-card p-3 shadow-xs transition-colors";

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
