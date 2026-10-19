"use client";

import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Banknote,
  Globe,
  Landmark,
  type LucideIcon,
} from "lucide-react";

const FIELDS: Record<string, LucideIcon> = {
  budget: Banknote,
  domestic_gross: Landmark,
  worldwide_gross: Globe,
};

const formatMoney = (value: unknown) => {
  if (value == null || value === "") return "—";

  const n = Number(value);

  return Number.isFinite(n)
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(n)
    : String(value);
};

type Props = {
  changes: Record<string, unknown>;
};

export const BoxOfficeDiff = ({ changes }: Props) => {
  const t = useTranslations("AuditLog");

  return (
    <ul className="flex flex-col divide-y divide-neutral-200 rounded-lg border border-neutral-200 px-3 dark:divide-neutral-800 dark:border-neutral-800">
      {Object.entries(changes).map(([key, value]) => {
        const v = (value ?? {}) as Record<string, unknown>;
        const Icon = FIELDS[key];

        return (
          <li
            key={key}
            className="flex flex-wrap items-center justify-between gap-2 py-2"
          >
            <span className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
              {Icon && <Icon className="size-4" />}
              {key in FIELDS ? t(`boxOffice.${key}`) : key}
            </span>

            <span className="flex items-center gap-2 text-sm tabular-nums">
              <span className="text-neutral-500 line-through dark:text-neutral-400">
                {formatMoney(v.old)}
              </span>
              <ArrowRight className="size-3 text-neutral-400" />
              <span className="font-semibold">{formatMoney(v.new)}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
};
