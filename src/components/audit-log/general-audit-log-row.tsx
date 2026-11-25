"use client";

import { useId, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, History, UserRound, type LucideIcon } from "lucide-react";
import { EVENT_ICONS } from "@/components/audit-log/audit-log-item";
import { cn } from "@/lib/utils";
import type {
  AuditLogSummaryGroupOut,
  AuditLogSummaryOut,
} from "@/orval_api/model";

type RowProps = {
  item: AuditLogSummaryOut | AuditLogSummaryGroupOut;
  label: string;
  time: string;
  author: string;
  deletedLabel: string;
  posterURL: string;
  featured?: boolean;
  userRole?: string | null;
  eventCountLabel?: string;
  expanded?: boolean;
  controlsId?: string;
  onToggle?: () => void;
  expandLabel?: string;
  collapseLabel?: string;
  children?: ReactNode;
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
  eventCountLabel,
  expanded,
  controlsId,
  onToggle,
  expandLabel,
  collapseLabel,
  children,
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
          <div className="flex flex-col sm:flex-row">
            <span>{label}</span>{" "}
            {item?.source_movie && (
              <span>(Source movie is {item.source_movie.title})</span>
            )}
          </div>
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
      <div className="flex shrink-0 items-center gap-1.5 self-stretch">
        {eventCountLabel && (
          <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs sm:text-sm">
            {eventCountLabel}
          </span>
        )}
        <time
          dateTime={item.created_at}
          className="text-muted-foreground absolute top-1 right-3 shrink-0 text-xs sm:static sm:text-sm"
        >
          {time}
        </time>
        {onToggle && (
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "text-muted-foreground size-5 transition-transform",
              expanded && "rotate-180",
            )}
          />
        )}
      </div>
    </>
  );

  const baseClass = cn(
    "flex items-center gap-3 rounded-lg border bg-card p-3 shadow-xs transition-colors",
    featured &&
      "from-main-ui-purple/15 via-card to-card border-main-ui-purple/60 gap-4 bg-gradient-to-r p-4 shadow-md",
  );

  return (
    <li className="relative">
      {onToggle ? (
        <button
          type="button"
          aria-controls={controlsId}
          aria-expanded={expanded}
          aria-label={expanded ? collapseLabel : expandLabel}
          onClick={onToggle}
          className={cn(
            baseClass,
            "hover:border-main-ui-purple/50 hover:bg-accent focus-visible:border-ring focus-visible:ring-ring/50 dark:border-main-ui-purple w-full text-left focus-visible:ring-[3px] focus-visible:outline-none",
          )}
        >
          {content}
        </button>
      ) : href ? (
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
      {children}
    </li>
  );
};

type GroupedLogRowProps = {
  group: AuditLogSummaryGroupOut;
  getLabel: (eventType: string) => string;
  formatTime: (createdAt: string) => string;
  author: string;
  deletedLabel: string;
  posterURL: string;
  anonymousLabel: string;
  eventCountLabel: (count: number) => string;
  expandLabel: string;
  collapseLabel: string;
};

export const GroupedLogRow = ({
  group,
  getLabel,
  formatTime,
  author,
  deletedLabel,
  posterURL,
  anonymousLabel,
  eventCountLabel,
  expandLabel,
  collapseLabel,
}: GroupedLogRowProps) => {
  const [expanded, setExpanded] = useState(false);
  const itemsId = useId();
  const isExpandable = group.items.length > 1;

  if (!isExpandable) {
    return (
      <LogRow
        item={group}
        label={getLabel(group.event_type)}
        time={formatTime(group.created_at)}
        author={author}
        userRole={group.user_role}
        deletedLabel={deletedLabel}
        posterURL={posterURL}
      />
    );
  }

  return (
    <LogRow
      item={group}
      label={getLabel(group.event_type)}
      time={formatTime(group.created_at)}
      author={author}
      userRole={group.user_role}
      deletedLabel={deletedLabel}
      posterURL={posterURL}
      eventCountLabel={eventCountLabel(group.items.length)}
      expanded={expanded}
      controlsId={itemsId}
      expandLabel={expandLabel}
      collapseLabel={collapseLabel}
      onToggle={() => setExpanded((value) => !value)}
    >
      {expanded && (
        <ul
          id={itemsId}
          className="border-main-ui-purple/25 mt-2 ml-4 space-y-2 border-l pl-3"
        >
          {group.items.map((item) => (
            <LogRow
              key={item.id}
              item={item}
              label={getLabel(item.event_type)}
              time={formatTime(item.created_at)}
              author={item.user_name ?? anonymousLabel}
              userRole={item.user_role}
              deletedLabel={deletedLabel}
              posterURL={posterURL}
            />
          ))}
        </ul>
      )}
    </LogRow>
  );
};
