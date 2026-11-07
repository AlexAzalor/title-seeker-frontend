"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import { formatDate, formattedDuration } from "@/lib/utils";
import { Language } from "@/orval_api/model";

type Change = { key: string; old: unknown; new: unknown };

const FIELDS: Record<string, LucideIcon> = {
  duration: Clock,
  release_date: CalendarDays,
  location_en: MapPin,
  location_uk: MapPin,
};

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : {};
}

function getChanges(changes: Record<string, unknown>): Change[] {
  const rows: Change[] = [];

  for (const [key, value] of Object.entries(changes)) {
    const change = asRecord(value);
    if (key === "en" || key === "uk") {
      const oldValues = asRecord(change.old);
      const newValues = asRecord(change.new);
      for (const field of new Set([
        ...Object.keys(oldValues),
        ...Object.keys(newValues),
      ])) {
        rows.push({
          key: `${field}_${key}`,
          old: oldValues[field],
          new: newValues[field],
        });
      }
    } else {
      rows.push({ key, old: change.old, new: change.new });
    }
  }
  return rows;
}

function formatValue(value: unknown, key: string, lang: Language): string {
  if (value == null || value === "") return "—";
  if (
    key === "duration" &&
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0
  ) {
    return formattedDuration(value, lang);
  }
  if (
    key === "release_date" &&
    typeof value === "string" &&
    !Number.isNaN(new Date(value).getTime())
  ) {
    return formatDate(value, lang);
  }
  return typeof value === "object" ? JSON.stringify(value) : String(value);
}

export function MovieDetailsDiff({
  changes,
}: {
  changes: Record<string, unknown>;
}) {
  const t = useTranslations("AuditLog.movieDetails");
  const locale = useLocale();
  const lang = locale === Language.uk ? Language.uk : Language.en;

  return (
    <ul className="flex flex-col divide-y divide-neutral-200 rounded-lg border border-neutral-200 px-3 dark:divide-neutral-800 dark:border-neutral-800">
      {getChanges(changes).map(({ key, old, new: newValue }) => {
        const Icon = FIELDS[key];
        return (
          <li
            key={key}
            className="flex flex-wrap items-center justify-between gap-2 py-2"
          >
            <span className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
              {Icon && <Icon className="size-4" />}
              {key in FIELDS ? t(key) : key}
            </span>
            <span className="flex items-center gap-2 text-sm tabular-nums">
              <span className="text-neutral-500 line-through dark:text-neutral-400">
                {formatValue(old, key, lang)}
              </span>
              <ArrowRight className="size-3 shrink-0 text-neutral-400" />
              <span className="font-semibold">
                {formatValue(newValue, key, lang)}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
