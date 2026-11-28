"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Check, Copy, Edit } from "lucide-react";
import { TelegramIcon } from "@/lib/portfolio/tech-icons";
import { AuditLogDrawer } from "@/components/audit-log/audit-log-drawer";
import { Button } from "@/components/ui/button";
import {
  MovieEditMenu,
  type MovieEditData,
} from "@/components/movie/movie-page/edit/movie-edit-menu";

export const ShareLinkButtons = ({
  movieKey,
  movieTitle,
  createdAt,
  updatedAt,
  posterUrl,
  avatarUrl,
  isAdmin,
  movieData,
}: {
  movieKey: string;
  movieTitle: string;
  createdAt?: string;
  updatedAt?: string;
  posterUrl: string;
  avatarUrl: string;
  isAdmin: boolean;
  movieData: MovieEditData;
}) => {
  const pathname = usePathname();
  const t = useTranslations("Form.movieEdit");
  const [copied, setCopied] = useState(false);
  const url = window.location.origin + pathname;

  // Content: &text=${encodeURIComponent("Check this out!")}
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="fixed bottom-2 left-2 z-50 flex flex-col gap-2 md:static md:z-auto md:flex-row md:items-center">
      <button
        title="Copy link"
        onClick={handleCopy}
        className="flex items-center gap-2 rounded bg-neutral-100 px-4 py-2 opacity-70 transition-colors hover:bg-slate-200 md:opacity-100 dark:bg-slate-700 dark:hover:bg-slate-600"
      >
        {copied ? (
          <Check className="stroke-gray-500 dark:stroke-gray-300" />
        ) : (
          <Copy className="stroke-gray-500 dark:stroke-gray-300" />
        )}
      </button>

      <a
        title="Share on Telegram"
        href={telegramShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center rounded bg-neutral-100 px-4 py-2 opacity-70 transition-colors hover:bg-slate-200 md:opacity-100 dark:bg-slate-700 dark:hover:bg-slate-600"
      >
        <TelegramIcon />
      </a>

      <AuditLogDrawer
        entityType="movie"
        entityId={movieKey}
        movieTitle={movieTitle}
        createdAt={createdAt}
        updatedAt={updatedAt}
        posterUrl={posterUrl}
        avatarUrl={avatarUrl}
      />

      {isAdmin && (
        <MovieEditMenu
          movieKey={movieKey}
          movieData={movieData}
          movieTitle={movieTitle}
          posterUrl={posterUrl}
        >
          <Button
            aria-label={t("menu")}
            title={t("menu")}
            className="inline-flex items-center rounded bg-neutral-100 px-4 py-2 opacity-70 transition-colors hover:bg-slate-200 md:opacity-100 dark:bg-slate-700 dark:hover:bg-slate-600 [&_svg]:size-6"
          >
            <Edit className="stroke-gray-500 dark:stroke-gray-300" />
          </Button>
        </MovieEditMenu>
      )}
    </div>
  );
};
