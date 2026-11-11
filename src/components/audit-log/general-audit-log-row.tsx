"use client";

import Image from "next/image";
import Link from "next/link";
import { History, UserRound, type LucideIcon } from "lucide-react";
import { EVENT_ICONS } from "@/components/audit-log/audit-log-item";
import { cn } from "@/lib/utils";
import type {
  AuditLogSummaryOut,
  AuditLogSummaryOutUserRole,
} from "@/orval_api/model";

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

export const LogRow = ({
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
        className="text-muted-foreground absolute top-1 right-3 shrink-0 text-xs sm:static sm:text-sm"
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
    <li className="relative">
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
