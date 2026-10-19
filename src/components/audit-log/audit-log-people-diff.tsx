"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, Minus, Plus, Repeat } from "lucide-react";

import { AVATAR_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

export type PersonEntry = {
  key: string;
  name: string;
  avatar: string | null;
  character_key?: string;
  character_name?: string;
};

type Status = "added" | "removed" | "changed" | "unchanged";

type DiffRow = {
  person: PersonEntry;
  status: Status;
  previousCharacter?: string;
};

export function toPersonEntries(value: unknown): PersonEntry[] | null {
  if (!Array.isArray(value)) return null;

  const isPerson = (v: unknown): v is PersonEntry =>
    typeof v === "object" &&
    v !== null &&
    typeof (v as PersonEntry).key === "string";

  return value.every(isPerson) ? value : null;
}

/** Matches by person key (+ character key for actors); same person with another character is "changed". */
export function diffPeople(
  oldList: PersonEntry[],
  newList: PersonEntry[],
): DiffRow[] {
  const remaining = [...oldList];
  const rows: (DiffRow | null)[] = newList.map(() => null);

  const take = (predicate: (o: PersonEntry) => boolean) => {
    const idx = remaining.findIndex(predicate);

    return idx === -1 ? null : remaining.splice(idx, 1)[0];
  };

  newList.forEach((person, i) => {
    if (
      take(
        (o) => o.key === person.key && o.character_key === person.character_key,
      )
    ) {
      rows[i] = { person, status: "unchanged" };
    }
  });

  newList.forEach((person, i) => {
    if (rows[i]) return;

    const previous = take((o) => o.key === person.key);

    rows[i] = previous
      ? {
          person,
          status: "changed",
          previousCharacter: previous.character_name,
        }
      : { person, status: "added" };
  });

  return [
    ...(rows as DiffRow[]),
    ...remaining.map((person): DiffRow => ({ person, status: "removed" })),
  ];
}

const STATUS_STYLES: Record<Status, string> = {
  added: "border-emerald-500/30 bg-emerald-500/5",
  removed: "border-red-500/30 bg-red-500/5",
  changed: "border-amber-500/30 bg-amber-500/5",
  unchanged: "border-neutral-200 opacity-60 dark:border-neutral-800",
};

const STATUS_BADGE_STYLES: Record<Exclude<Status, "unchanged">, string> = {
  added: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  removed: "bg-red-500/15 text-red-700 dark:text-red-400",
  changed: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
};

const STATUS_ICONS = { added: Plus, removed: Minus, changed: Repeat };

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

type AvatarProps = {
  person: PersonEntry;
  type: "actors" | "directors";
};

const PersonAvatar = ({ person, type }: AvatarProps) =>
  person.avatar ? (
    <Image
      src={`${AVATAR_URL}/${type}/${person.avatar}`}
      alt={person.name}
      width={40}
      height={40}
      className="size-10 shrink-0 rounded-full object-cover"
    />
  ) : (
    <div className="bg-main-ui-purple/10 text-main-ui-purple flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
      {getInitials(person.name)}
    </div>
  );

type Props = {
  oldList: PersonEntry[];
  newList: PersonEntry[];
  type: "actors" | "directors";
};

export const PeopleDiff = ({ oldList, newList, type }: Props) => {
  const t = useTranslations("AuditLog");
  const rows = diffPeople(oldList, newList);
  const isActors = type === "actors";
  const searchParam = isActors ? "actor" : "director";

  if (rows.length === 0) {
    return <p className="text-sm text-neutral-400 italic">{t("noPeople")}</p>;
  }

  let position = 0;

  return (
    <ul className="flex flex-col gap-2">
      {rows.map(({ person, status, previousCharacter }, index) => {
        const Icon = status === "unchanged" ? null : STATUS_ICONS[status];
        const number = status === "removed" ? null : ++position;

        return (
          <li
            key={`${person.key}-${person.character_key ?? ""}-${status}-${index}`}
            className={cn(
              "flex items-center gap-3 rounded-lg border p-2",
              STATUS_STYLES[status],
            )}
          >
            {isActors && (
              <span className="w-5 shrink-0 text-center text-xs text-neutral-400">
                {number}
              </span>
            )}

            <PersonAvatar person={person} type={type} />

            <div className="min-w-0 flex-1">
              <Link
                href={`/super-search/?${searchParam}=${person.key}`}
                target="_blank"
                className={cn(
                  "block truncate text-sm font-medium hover:underline",
                  status === "removed" && "line-through",
                )}
              >
                {person.name}
              </Link>

              {isActors && person.character_name && (
                <p className="flex flex-wrap items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                  {status === "changed" && previousCharacter && (
                    <>
                      <span className="line-through">{previousCharacter}</span>
                      <ArrowRight className="size-3" />
                    </>
                  )}
                  <span className="truncate">{person.character_name}</span>
                </p>
              )}
            </div>

            {Icon && status !== "unchanged" && (
              <span
                className={cn(
                  "flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                  STATUS_BADGE_STYLES[status],
                )}
              >
                <Icon className="size-3" />
                {t(`status.${status}`)}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
};
