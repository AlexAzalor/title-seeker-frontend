"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Info,
  Lightbulb,
  LogOut,
  RotateCcw,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Language } from "@/orval_api/model";
import type { Bracket } from "./bracket";
import { MovieCard, Poster } from "./movie-card";

export const ROUND_TRANSITION_MS = 2500;

function DuelHint() {
  const t = useTranslations("MovieTournament");
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 10_000);
    return () => {
      clearTimeout(timer);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }

  function scheduleClose() {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 200);
  }

  if (!visible) return null;
  return (
    <div className="absolute top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduced ? 0 : 0.2 }}
      >
        <Popover
          open={open}
          onOpenChange={(value) => {
            cancelClose();
            setOpen(value);
          }}
        >
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label={t("duelHintLabel")}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") {
                  cancelClose();
                  setOpen(true);
                }
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse") scheduleClose();
              }}
              className="focus-visible:outline-main-ui-purple flex size-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
            >
              <Info aria-hidden="true" className="size-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            collisionPadding={12}
            onOpenAutoFocus={(event) => event.preventDefault()}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") cancelClose();
            }}
            onPointerLeave={(event) => {
              if (event.pointerType === "mouse") scheduleClose();
            }}
            className="max-h-[70dvh] w-[min(22rem,calc(100vw-24px))] space-y-4 overflow-y-auto"
          >
            <div className="flex items-center gap-2 font-semibold">
              <Lightbulb
                aria-hidden="true"
                className="text-main-ui-purple size-5 shrink-0 dark:text-indigo-300"
              />
              <p>{t("duelHintTitle")}</p>
            </div>
            <ol className="marker:text-main-ui-purple list-decimal space-y-2 pl-5 leading-relaxed text-neutral-700 marker:font-semibold dark:text-neutral-300 dark:marker:text-indigo-300">
              <li>{t("duelHintPoster")}</li>
              <li>{t("duelHintTitleFamiliar")}</li>
              <li>{t("duelHintDate")}</li>
            </ol>
            <p className="text-main-ui-purple flex gap-2 rounded-md bg-neutral-100 p-3 text-sm leading-relaxed dark:bg-neutral-800 dark:text-indigo-300">
              <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <span>{t("duelHintDetails")}</span>
            </p>
          </PopoverContent>
        </Popover>
      </motion.div>
    </div>
  );
}

export function GameView({
  bracket,
  size,
  posterUrl,
  lang,
  selected,
  locked,
  select,
  startOver,
  exit,
}: {
  bracket: Bracket;
  size: number;
  posterUrl: string;
  lang: Language;
  selected: string | null;
  locked: boolean;
  select: (key: string) => void;
  startOver: () => void;
  exit: () => void;
}) {
  const t = useTranslations("MovieTournament");
  const reduced = useReducedMotion();
  const [hintEpoch, setHintEpoch] = useState(0);
  const pair = bracket.round.slice(bracket.duel * 2, bracket.duel * 2 + 2);
  const total = size - 1;
  const roundName =
    bracket.round.length === 2
      ? t("final")
      : bracket.round.length === 4
        ? t("semiFinal")
        : bracket.round.length === 8
          ? t("quarterFinal")
          : t("round", { number: bracket.roundNumber });
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 sm:space-y-5">
      <header className="space-y-2 text-center sm:space-y-3">
        <h1 aria-live="polite" className="font-bold">
          {roundName}
        </h1>
        <p className="text-lg text-neutral-500 dark:text-neutral-400">
          {t("duel", {
            current: bracket.duel + 1,
            total: bracket.round.length / 2,
          })}{" "}
          · {t("progress", { current: bracket.history.length, total })}
        </p>
        <div
          role="progressbar"
          aria-label={t("progressLabel")}
          aria-valuenow={bracket.history.length}
          aria-valuemin={0}
          aria-valuemax={total}
          className="h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800"
        >
          <motion.div
            className="bg-main-ui-purple h-full rounded-full dark:bg-indigo-400"
            initial={false}
            animate={{ width: `${(bracket.history.length / total) * 100}%` }}
            transition={{ duration: reduced ? 0 : 0.25 }}
          />
        </div>
        <p className="text-main-ui-purple text-lg dark:text-indigo-300">
          {t("choose")}
        </p>
      </header>
      <div className="relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${bracket.roundNumber}-${bracket.duel}`}
            className="grid grid-cols-2 items-start justify-items-center gap-2 sm:gap-6"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.15 }}
          >
            {pair.map((movie) => (
              <MovieCard
                key={movie.key}
                movie={movie}
                posterUrl={posterUrl}
                lang={lang}
                selected={selected === movie.key}
                locked={locked}
                onSelect={() => select(movie.key)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
        {!reduced && bracket.roundNumber > 1 && bracket.duel === 0 && (
          <motion.div
            key={bracket.roundNumber}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{
              duration: ROUND_TRANSITION_MS / 1000,
              times: [0, 0.16, 0.7, 1],
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden rounded-lg bg-white/95 text-center dark:bg-neutral-950/95"
          >
            <motion.div
              initial={{ x: "-120%", opacity: 0 }}
              animate={{ x: "120%", opacity: [0, 0.6, 0] }}
              transition={{
                duration: ROUND_TRANSITION_MS / 1000,
                ease: "easeInOut",
              }}
              className="from-main-ui-purple/0 via-main-ui-purple/25 to-main-ui-purple/0 absolute inset-0 bg-gradient-to-r dark:via-indigo-300/25"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative space-y-2 px-4"
            >
              <p className="text-main-ui-purple text-sm font-semibold tracking-widest uppercase dark:text-indigo-300">
                {t("nextRound")}
              </p>
              <p className="text-3xl font-bold sm:text-5xl">{roundName}</p>
            </motion.div>
          </motion.div>
        )}
        {!locked && (
          <DuelHint
            key={`${bracket.roundNumber}-${bracket.duel}-${hintEpoch}`}
          />
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setHintEpoch((value) => value + 1);
            startOver();
          }}
        >
          <RotateCcw /> {t("startOver")}
        </Button>
        <Button type="button" variant="ghost" onClick={exit}>
          <LogOut /> {t("exit")}
        </Button>
      </div>
    </div>
  );
}

export function ResultView({
  bracket,
  posterUrl,
  playAgain,
}: {
  bracket: Bracket;
  posterUrl: string;
  playAgain: () => void;
}) {
  const t = useTranslations("MovieTournament");
  const reduced = useReducedMotion();
  const winner = bracket.winner;
  if (!winner) return null;
  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 text-center sm:space-y-10">
      <motion.section
        initial={reduced ? false : { opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.4 }}
        className="mx-auto max-w-sm space-y-4"
      >
        <Trophy
          aria-hidden
          className="text-main-ui-purple mx-auto size-8 dark:text-indigo-300"
        />
        <p className="text-main-ui-purple text-sm font-semibold tracking-widest uppercase dark:text-indigo-300">
          {t("winner")}
        </p>
        <h1 className="text-2xl font-bold break-words sm:text-3xl">
          {winner.title}
        </h1>
        <Poster
          movie={winner}
          posterUrl={posterUrl}
          sizes="(max-width: 640px) 80vw, 384px"
        />
        <Button asChild variant="outline" className="w-full">
          <Link
            href={`/movies/${encodeURIComponent(winner.key)}#movie`}
            target="_blank"
            prefetch={false}
          >
            {t("moviePage")} <ArrowRight />
          </Link>
        </Button>
        <Button size="lg" className="w-full" onClick={playAgain}>
          <RotateCcw />
          {t("playAgain")}
        </Button>
      </motion.section>
      <section className="space-y-4 text-left">
        <div>
          <h2 className="text-lg font-semibold">{t("history")}</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {t("historyHelp")}
          </p>
        </div>
        <div className="xs:grid-cols-4 grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3 md:grid-cols-8">
          {bracket.history.map((movie, index) => (
            <Link
              key={`${index}-${movie.key}`}
              className="space-y-1"
              href={`/movies/${encodeURIComponent(movie.key)}#movie`}
              target="_blank"
              prefetch={false}
            >
              <Poster
                movie={movie}
                posterUrl={posterUrl}
                sizes="(max-width: 480px) 30vw, (max-width: 640px) 22vw, 100px"
              />
              <p className="line-clamp-2 text-xs break-words">{movie.title}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
