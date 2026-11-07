"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  EVENT_LABEL_KEYS,
  parseUtcDate,
} from "@/components/audit-log/audit-log-item";
import { LogRow } from "@/components/audit-log/general-audit-log-row";
import { Skeleton } from "@/components/ui/skeleton";
import type { AuditLogSummaryOut } from "@/orval_api/model";

type LatestEventProps = {
  event: AuditLogSummaryOut | null;
  isLoading: boolean;
  posterURL: string;
};

export const LatestEvent = ({
  event,
  isLoading,
  posterURL,
}: LatestEventProps) => {
  const t = useTranslations("AuditLog");
  const locale = useLocale();

  if (!isLoading && !event) return null;

  const date = event ? parseUtcDate(event.created_at) : null;
  const time =
    date && event
      ? Number.isNaN(date.getTime())
        ? event.created_at
        : date.toLocaleString(locale, {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23",
          })
      : "";
  const labelKey = event && EVENT_LABEL_KEYS[event.event_type];

  return (
    <section
      aria-label={t("latestEvent")}
      aria-busy={isLoading}
      className="mb-6"
    >
      <h2 className="text-main-ui-purple mb-2 flex items-center gap-2 text-base font-semibold tracking-wide uppercase">
        <span className="relative flex size-2.5">
          <span className="bg-main-ui-purple absolute inline-flex size-full animate-ping rounded-full opacity-60" />
          <span className="bg-main-ui-purple relative inline-flex size-2.5 rounded-full" />
        </span>
        {t("latestEvent")}
      </h2>
      {isLoading ? (
        <Skeleton className="h-[124px] w-full rounded-lg" />
      ) : event ? (
        <ul>
          <LogRow
            featured
            item={event}
            label={labelKey ? t("events." + labelKey) : t("unknownEvent")}
            time={time}
            author={event.user_name ?? t("anonymous")}
            userRole={event.user_role}
            deletedLabel={t("entityDeleted")}
            posterURL={posterURL}
          />
        </ul>
      ) : null}
    </section>
  );
};
