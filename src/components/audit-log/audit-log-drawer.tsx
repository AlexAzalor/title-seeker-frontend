"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { History, Inbox } from "lucide-react";

import { getEntityAuditLogs } from "@/app/(app)/services/admin-api";
import { cn } from "@/lib/utils";
import type { AuditLogOut } from "@/orval_api/model";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/my-custom-ui/spinner";
import {
  AuditLogItem,
  parseUtcDate,
} from "@/components/audit-log/audit-log-item";

const SNAP_POINTS = [0.5, 1];
const FULL_SNAP_POINT = SNAP_POINTS[SNAP_POINTS.length - 1];

type Status = "idle" | "loading" | "loadingMore" | "success" | "error";

type Props = {
  /** Public entity key, e.g. the movie key */
  entityId: string;
  movieTitle: string;
  entityType?: string;
  createdAt?: string;
  updatedAt?: string;
  className?: string;
  posterUrl: string;
  avatarUrl: string;
};

export const AuditLogDrawer = ({
  entityId,
  movieTitle,
  entityType = "movie",
  createdAt,
  updatedAt,
  posterUrl,
  avatarUrl,
}: Props) => {
  const t = useTranslations("AuditLog");
  const locale = useLocale();

  const formatDateTime = (value?: string) => {
    if (!value) return null;

    const date = parseUtcDate(value);

    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleString(locale, {
          dateStyle: "medium",
          timeStyle: "short",
        });
  };

  const createdLabel = formatDateTime(createdAt);
  const updatedLabel = formatDateTime(updatedAt);

  const [open, setOpen] = useState(false);
  const [snap, setSnap] = useState<number | string | null>(SNAP_POINTS[0]);
  const [items, setItems] = useState<AuditLogOut[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);
  const [sentinelEl, setSentinelEl] = useState<HTMLDivElement | null>(null);
  const requestId = useRef(0);

  const loadPage = useCallback(
    async (cursor?: string) => {
      const id = ++requestId.current;
      setStatus(cursor ? "loadingMore" : "loading");

      try {
        const res = await getEntityAuditLogs(entityType, entityId, cursor);

        if (id !== requestId.current) return;

        if (res.status === 200 && res.data) {
          const { items: page, next_cursor } = res.data;

          setItems((prev) => (cursor ? [...prev, ...page] : page));
          setNextCursor(next_cursor);
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        if (id !== requestId.current) return;

        console.error("Fetch audit logs error:", error);
        setStatus("error");
      }
    },
    [entityType, entityId],
  );

  const handleOpenChange = (next: boolean) => {
    setOpen(next);

    if (next) {
      // Always refetch from the start to see the newest entries
      setSnap(SNAP_POINTS[0]);
      setItems([]);
      setNextCursor(null);
      loadPage();
    } else {
      requestId.current++;
    }
  };

  useEffect(() => {
    if (!scrollEl || !sentinelEl || !nextCursor || status !== "success") {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadPage(nextCursor);
        }
      },
      { root: scrollEl, rootMargin: "0px 0px 200px 0px" },
    );

    observer.observe(sentinelEl);

    return () => observer.disconnect();
  }, [scrollEl, sentinelEl, nextCursor, status, loadPage]);

  const isInitialLoading = status === "loading" || status === "idle";
  const isEmpty = status === "success" && items.length === 0;

  return (
    <Drawer
      open={open}
      onOpenChange={handleOpenChange}
      snapPoints={SNAP_POINTS}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
    >
      <DrawerTrigger asChild>
        <button
          title="Open history"
          className="flex items-center gap-2 rounded bg-neutral-100 px-4 py-2 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
        >
          <History />
        </button>
      </DrawerTrigger>

      <DrawerContent className="h-full data-[vaul-drawer-direction=bottom]:max-h-[97%]">
        <DrawerHeader className="mx-auto w-full max-w-3xl">
          <DrawerTitle className="flex items-center gap-2 text-xl">
            <History className="text-main-ui-purple size-5" />
            {t("title")}
          </DrawerTitle>
          <DrawerDescription>{t("description")}</DrawerDescription>
          {(createdLabel || updatedLabel) && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-neutral-500 dark:text-neutral-400">
              {createdLabel && (
                <span>
                  {t("createdAt")}: <time>{createdLabel}</time>
                </span>
              )}
              {updatedLabel && (
                <span>
                  {t("updatedAt")}: <time>{updatedLabel}</time>
                </span>
              )}
            </div>
          )}
        </DrawerHeader>

        {/* Scrolling is only enabled at the last snap point; before that, dragging moves the drawer */}
        <div
          ref={setScrollEl}
          className={cn(
            "mx-auto w-full max-w-3xl flex-1 px-4 pb-6",
            snap === FULL_SNAP_POINT ? "overflow-y-auto" : "overflow-hidden",
          )}
        >
          {isInitialLoading && (
            <div className="flex flex-col gap-4">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
              ))}
            </div>
          )}

          {isEmpty && (
            <div className="flex flex-col items-center gap-2 py-12 text-neutral-500 dark:text-neutral-400">
              <Inbox className="size-10" />
              <p>{t("empty")}</p>
            </div>
          )}

          {items.length > 0 && (
            <ul>
              {items.map((item, index) => (
                <AuditLogItem
                  key={item.id}
                  item={item}
                  movieTitle={movieTitle}
                  isLast={index === items.length - 1 && !nextCursor}
                  posterUrl={posterUrl}
                  avatarUrl={avatarUrl}
                />
              ))}
            </ul>
          )}

          {status === "loadingMore" && (
            <div className="flex items-center justify-center gap-2 py-4 text-sm text-neutral-500">
              <Spinner />
              {t("loadingMore")}
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-3 py-8">
              <p className="text-sm text-red-500">{t("loadError")}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  loadPage(items.length ? (nextCursor ?? undefined) : undefined)
                }
              >
                {t("retry")}
              </Button>
            </div>
          )}

          {nextCursor && <div ref={setSentinelEl} className="h-px" />}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
