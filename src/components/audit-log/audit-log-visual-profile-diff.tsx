"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Minus, Plus, Repeat, ArrowUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Language, type Language as LanguageType } from "@/orval_api/model";
import { VisualProfileChartMemo } from "@/components/movie/movie-page/visual-profile.tsx/visual-profile-chart";

type LocalizedName = string | Partial<Record<LanguageType, string>>;

type Category = { key: string; name: LocalizedName } | null;

type CriterionEntry = {
  key: string;
  name: LocalizedName;
  rating: number;
  order: number;
};

export type VisualProfileChanges = {
  category?: { old: Category; new: Category };
  criteria?: { old: CriterionEntry[]; new: CriterionEntry[] };
};

const isLocalizedName = (value: unknown): value is LocalizedName =>
  typeof value === "string" ||
  (typeof value === "object" &&
    value !== null &&
    (typeof (value as Partial<Record<LanguageType, unknown>>).en === "string" ||
      typeof (value as Partial<Record<LanguageType, unknown>>).uk ===
        "string"));

const isCriterion = (v: unknown): v is CriterionEntry =>
  typeof v === "object" &&
  v !== null &&
  typeof (v as CriterionEntry).key === "string" &&
  isLocalizedName((v as CriterionEntry).name);

const localizedName = (
  name: LocalizedName,
  lang: LanguageType,
  fallback: string,
) => {
  if (typeof name === "string") return name;

  return name[lang] ?? name[Language.en] ?? name[Language.uk] ?? fallback;
};

export function toVisualProfileChanges(
  changes: Record<string, unknown>,
): VisualProfileChanges | null {
  const result: VisualProfileChanges = {};
  const category = changes?.category as VisualProfileChanges["category"];
  const criteria = changes?.criteria as
    | { old: unknown; new: unknown }
    | undefined;

  if (category && typeof category === "object") {
    result.category = category;
  }

  if (
    criteria &&
    Array.isArray(criteria.old) &&
    Array.isArray(criteria.new) &&
    criteria.old.every(isCriterion) &&
    criteria.new.every(isCriterion)
  ) {
    result.criteria = {
      old: criteria.old as CriterionEntry[],
      new: criteria.new as CriterionEntry[],
    };
  }

  return result.category || result.criteria ? result : null;
}

type Row = {
  entry: CriterionEntry;
  previous?: CriterionEntry;
  status: "added" | "removed" | "changed" | "unchanged";
  scoreChanged: boolean;
  orderChanged: boolean;
};

const byOrder = (a: CriterionEntry, b: CriterionEntry) => a.order - b.order;

function diffCriteria(oldList: CriterionEntry[], newList: CriterionEntry[]) {
  const oldByKey = new Map(oldList.map((c) => [c.key, c]));
  const newKeys = new Set(newList.map((c) => c.key));

  const rows: Row[] = [...newList].sort(byOrder).map((entry) => {
    const previous = oldByKey.get(entry.key);

    if (!previous) {
      return {
        entry,
        status: "added",
        scoreChanged: false,
        orderChanged: false,
      };
    }

    const scoreChanged = previous.rating !== entry.rating;
    const orderChanged = previous.order !== entry.order;

    return {
      entry,
      previous,
      status: scoreChanged || orderChanged ? "changed" : "unchanged",
      scoreChanged,
      orderChanged,
    };
  });

  const removed = oldList
    .filter((c) => !newKeys.has(c.key))
    .sort(byOrder)
    .map(
      (entry): Row => ({
        entry,
        status: "removed",
        scoreChanged: false,
        orderChanged: false,
      }),
    );

  return [...rows, ...removed];
}

const ROW_STYLES: Record<Row["status"], string> = {
  added: "border-emerald-500/30 bg-emerald-500/5",
  removed: "border-red-500/30 bg-red-500/5",
  changed: "border-amber-500/30 bg-amber-500/5",
  unchanged: "border-neutral-200 opacity-60 dark:border-neutral-800",
};

type ChartPanelProps = {
  label: string;
  variant: "old" | "new";
  criteria: CriterionEntry[];
  category?: Category;
  lang: LanguageType;
};

const ChartPanel = ({
  label,
  variant,
  criteria,
  category,
  lang,
}: ChartPanelProps) => (
  <div
    className={cn(
      "min-w-0 rounded-lg border p-3",
      variant === "old"
        ? "border-red-500/25 bg-red-500/5"
        : "border-emerald-500/25 bg-emerald-500/5",
    )}
  >
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
    {category && (
      <p className="text-sm font-medium">
        {localizedName(category.name, lang, category.key)}
      </p>
    )}
    <VisualProfileChartMemo
      criteria={[...criteria].sort(byOrder).map((entry) => ({
        ...entry,
        name: localizedName(entry.name, lang, entry.key),
      }))}
      lang={lang}
      compact
    />
  </div>
);

type Props = {
  changes: VisualProfileChanges;
};

export const VisualProfileDiff = ({ changes }: Props) => {
  const t = useTranslations("AuditLog");
  const locale = useLocale();
  const lang = locale === Language.uk ? Language.uk : Language.en;
  const { category, criteria } = changes;
  const rows = criteria ? diffCriteria(criteria.old, criteria.new) : [];

  return (
    <div className="flex flex-col gap-3">
      {category && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-neutral-500">{t("category")}</span>
          <span className="rounded-full bg-red-500/10 px-2.5 py-0.5 text-red-700 dark:text-red-400">
            {category.old
              ? localizedName(category.old.name, lang, category.old.key)
              : "—"}
          </span>
          <ArrowRight className="size-4 text-neutral-400" />
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-emerald-700 dark:text-emerald-400">
            {category.new
              ? localizedName(category.new.name, lang, category.new.key)
              : "—"}
          </span>
        </div>
      )}

      {criteria && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <ChartPanel
              label={t("oldChart")}
              variant="old"
              criteria={criteria.old}
              category={category?.old}
              lang={lang}
            />
            <ChartPanel
              label={t("newChart")}
              variant="new"
              criteria={criteria.new}
              category={category?.new}
              lang={lang}
            />
          </div>

          <ul className="flex flex-col gap-1.5">
            {rows.map(
              ({ entry, previous, status, scoreChanged, orderChanged }) => (
                <li
                  key={`${entry.key}-${status}`}
                  className={cn(
                    "flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2",
                    ROW_STYLES[status],
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-medium",
                      status === "removed" && "line-through",
                    )}
                  >
                    {localizedName(entry.name, lang, entry.key)}
                  </span>

                  <span className="flex flex-wrap items-center gap-2 text-sm tabular-nums">
                    {scoreChanged && previous ? (
                      <>
                        <span className="text-neutral-500 line-through">
                          {previous.rating}
                        </span>
                        <ArrowRight className="size-3 text-neutral-400" />
                        <span className="font-semibold">{entry.rating}</span>
                      </>
                    ) : (
                      <span>{entry.rating}</span>
                    )}

                    {status === "added" && (
                      <Badge
                        icon={Plus}
                        text={t("status.added")}
                        tone="green"
                      />
                    )}
                    {status === "removed" && (
                      <Badge
                        icon={Minus}
                        text={t("status.removed")}
                        tone="red"
                      />
                    )}
                    {scoreChanged && (
                      <Badge
                        icon={Repeat}
                        text={t("status.scoreChanged")}
                        tone="amber"
                      />
                    )}
                    {orderChanged && (
                      <Badge
                        icon={ArrowUpDown}
                        text={t("status.orderChanged")}
                        tone="amber"
                      />
                    )}
                  </span>
                </li>
              ),
            )}
          </ul>
        </>
      )}
    </div>
  );
};

const TONES = {
  green: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  red: "bg-red-500/15 text-red-700 dark:text-red-400",
  amber: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
};

const Badge = ({
  icon: Icon,
  text,
  tone,
}: {
  icon: typeof Plus;
  text: string;
  tone: keyof typeof TONES;
}) => (
  <span
    className={cn(
      "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
      TONES[tone],
    )}
  >
    <Icon className="size-3" />
    {text}
  </span>
);
