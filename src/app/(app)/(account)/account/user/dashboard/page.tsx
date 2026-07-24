import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import {
  getOverallStats,
  getUserOrRedirect,
} from "@/app/(app)/services/user-api";

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function hslToHex(hue: number, saturation: number, lightness: number) {
  const sat = saturation / 100;
  const light = lightness / 100;
  const chroma = (1 - Math.abs(2 * light - 1)) * sat;
  const section = hue / 60;
  const x = chroma * (1 - Math.abs((section % 2) - 1));

  let red = 0;
  let green = 0;
  let blue = 0;

  if (section >= 0 && section < 1) {
    red = chroma;
    green = x;
  } else if (section >= 1 && section < 2) {
    red = x;
    green = chroma;
  } else if (section >= 2 && section < 3) {
    green = chroma;
    blue = x;
  } else if (section >= 3 && section < 4) {
    green = x;
    blue = chroma;
  } else if (section >= 4 && section < 5) {
    red = x;
    blue = chroma;
  } else {
    red = chroma;
    blue = x;
  }

  const match = light - chroma / 2;
  const toHex = (channel: number) =>
    Math.round((channel + match) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

function getStatPalette(key: string) {
  const hash = hashString(key);
  const hue = hash % 360;
  const saturation = 60 + ((hash >> 8) % 16);

  return {
    lightBorder: hslToHex(hue, saturation - 10, 84),
    lightBackground: hslToHex(hue, saturation - 18, 95),
    lightText: hslToHex(hue, saturation + 8, 30),
    lightAccent: hslToHex(hue, saturation, 52),
    darkBorder: hslToHex(hue, saturation - 6, 34),
    darkBackground: hslToHex(hue, saturation - 12, 16),
    darkText: hslToHex(hue, saturation + 6, 78),
    darkAccent: hslToHex(hue, saturation + 4, 64),
  };
}

export default async function DashboardPage() {
  await getUserOrRedirect();

  const t = await getTranslations("Dashboard");

  const overallStats = await getOverallStats();

  // TODO: Fix any
  if ((overallStats as any).status && (overallStats as any).status !== 200) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {t("title")}
        </h1>
        Not enough permissions to view the dashboard. Please contact an
        administrator.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        {t("title")}
      </h1>
      <p className="max-w-2xl text-sm text-slate-600 sm:text-base dark:text-slate-300">
        {t("subTitle")}
      </p>

      {overallStats && Object.keys(overallStats).length > 0 ? (
        // <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7">
        <div className="flex flex-wrap justify-center gap-5">
          {Object.entries(overallStats).map(([key, value]) => {
            const palette = getStatPalette(key);
            const cardStyle = {
              "--stat-border": palette.lightBorder,
              "--stat-bg": palette.lightBackground,
              "--stat-text": palette.lightText,
              "--stat-accent": palette.lightAccent,
              "--stat-border-dark": palette.darkBorder,
              "--stat-bg-dark": palette.darkBackground,
              "--stat-text-dark": palette.darkText,
              "--stat-accent-dark": palette.darkAccent,
            } as CSSProperties & Record<`--${string}`, string>;

            return (
              <div
                key={key}
                style={cardStyle}
                className="group relative aspect-square size-36 overflow-hidden rounded-2xl border border-[var(--stat-border)] bg-[var(--stat-bg)] p-5 text-[var(--stat-text)] shadow-[0_4px_20px_rgba(17,24,39,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(17,24,39,0.1)] sm:size-56 dark:border-[var(--stat-border-dark)] dark:bg-[var(--stat-bg-dark)] dark:text-[var(--stat-text-dark)] dark:shadow-[0_8px_26px_rgba(0,0,0,0.35)]"
              >
                <div className="absolute inset-x-0 top-0 h-1.5 bg-[var(--stat-accent)] dark:bg-[var(--stat-accent-dark)]" />
                <div className="relative flex h-full flex-col justify-between">
                  <h2 className="text-xs font-semibold tracking-[0.08em] text-current/80 uppercase">
                    {t(`overallStats.${key}`)}
                  </h2>
                  <p className="text-4xl leading-none font-bold tracking-tight text-current">
                    {value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>{t("noStats")}</p>
      )}
    </div>
  );
}
