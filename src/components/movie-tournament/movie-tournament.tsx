"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Language } from "@/orval_api/model";
import { createBracket, selectWinner, type Bracket } from "./bracket";
import { generateTournament, getTournamentOptions } from "./actions";
import { GameView, ResultView, ROUND_TRANSITION_MS } from "./game-view";
import { SettingsView } from "./settings-view";
import { initialSettings, type FilterOption, type Settings } from "./types";

const EXCLUDE_POPULAR_MOVIES = [
  {
    key: "the-lord-of-the-rings-the-fellowship-of-the-ring",
    name: "The Lord of the Rings",
  },
  {
    key: "the-matrix",
    name: "The Matrix",
  },
  {
    key: "john-wick",
    name: "John Wick",
  },
  {
    key: "pirates-of-the-caribbean-the-curse-of-the-black-pearl",
    name: "Pirates of the Caribbean",
  },
  {
    key: "harry-potter-and-the-sorcerers-stone",
    name: "Harry Potter",
  },
  {
    key: "the-dark-knight",
    name: "The Dark Knight",
  },
  {
    key: "inception",
    name: "Inception",
  },
];

const EXCLUDE_UNIVERSES = [
  {
    key: "star-wars",
    name: "Star Wars",
  },
  {
    key: "marvel-cinematic-universe",
    name: "Marvel Cinematic Universe",
  },
];

type Availability = {
  key: string;
  loading: boolean;
  total: number | null;
  error: boolean;
  bracket: Bracket | null;
};

export function MovieTournament({
  lang,
  posterUrl,
}: {
  lang: Language;
  posterUrl: string;
}) {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [options, setOptions] = useState<{
    genres: FilterOption[];
    specifications: FilterOption[];
  } | null>(null);
  const [optionsError, setOptionsError] = useState(false);
  const [optionsAttempt, setOptionsAttempt] = useState(0);
  // const [universes, setUniverses] = useState<FilterOption[] | null>(null);
  // const [universesError, setUniversesError] = useState(false);
  // const [universesAttempt, setUniversesAttempt] = useState(0);
  // const [popular, setPopular] = useState<PopularOption[]>([
  //   {
  //     key: "the-lord-of-the-rings-the-fellowship-of-the-ring",
  //     name: "The Lord of the Rings: The Fellowship of the Ring",
  //   },
  // ]);
  // console.log("🚀 ~ MovieTournament ~ popular:", popular);
  // const [popularError, setPopularError] = useState(false);
  // const [popularAttempt, setPopularAttempt] = useState(0);
  const [generation, setGeneration] = useState(0);
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [bracket, setBracket] = useState<Bracket | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const locked = useRef(false);
  const initialBracket = useRef<Bracket | null>(null);
  const mainRef = useRef<HTMLElement>(null);
  const bracketVersion = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduced = useReducedMotion();
  const settingsKey = JSON.stringify([settings, lang, generation]);

  useEffect(() => {
    let active = true;
    setOptionsError(false);
    setOptions(null);
    getTournamentOptions(lang)
      .then((result) => {
        if (active) setOptions(result);
      })
      .catch((error: unknown) => {
        console.error("Tournament filters could not be loaded", error);
        if (active) setOptionsError(true);
      });
    return () => {
      active = false;
    };
  }, [lang, optionsAttempt]);

  // useEffect(() => {
  //   let active = true;
  //   setUniverses(null);
  //   setUniversesError(false);
  //   getTournamentUniverses(lang)
  //     .then((result) => {
  //       if (active) setUniverses(result);
  //     })
  //     .catch((error: unknown) => {
  //       console.error("Tournament shared universes could not be loaded", error);
  //       if (active) setUniversesError(true);
  //     });
  //   return () => {
  //     active = false;
  //   };
  // }, [lang, universesAttempt]);

  // useEffect(() => {
  //   let active = true;
  //   setPopularError(false);
  //   getPopularMovies()
  //     .then((result) => {
  //       if (active) setPopular(result);
  //     })
  //     .catch((error: unknown) => {
  //       console.error("Popular movies could not be loaded", error);
  //       if (active) setPopularError(true);
  //     });
  //   return () => {
  //     active = false;
  //   };
  // }, [popularAttempt]);

  useEffect(() => {
    if (bracket) return;
    let active = true;
    const timeout = setTimeout(async () => {
      let result: Awaited<ReturnType<typeof generateTournament>>;
      try {
        result = await generateTournament(settings, lang);
      } catch (error) {
        console.error("Tournament pool request failed", error);
        if (active)
          setAvailability({
            key: settingsKey,
            loading: false,
            total: null,
            error: true,
            bracket: null,
          });
        return;
      }
      if (!active) return;
      if (result.kind === "insufficient") {
        setAvailability({
          key: settingsKey,
          loading: false,
          total: result.total,
          error: false,
          bracket: null,
        });
      } else if (result.kind === "success") {
        try {
          const nextBracket = createBracket(result.data.movies);
          if (
            result.data.movies.length !== settings.size ||
            result.data.total < settings.size
          )
            throw new Error("Tournament pool does not match the request");
          setAvailability({
            key: settingsKey,
            loading: false,
            total: result.data.total,
            error: false,
            bracket: nextBracket,
          });
        } catch (error) {
          console.error("Invalid tournament pool", error);
          setAvailability({
            key: settingsKey,
            loading: false,
            total: null,
            error: true,
            bracket: null,
          });
        }
      } else {
        setAvailability({
          key: settingsKey,
          loading: false,
          total: null,
          error: true,
          bracket: null,
        });
      }
    }, 350);
    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [settingsKey, settings, lang, bracket]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const currentAvailability =
    availability?.key === settingsKey ? availability : null;
  const view = !bracket ? "settings" : bracket.winner ? "result" : "game";
  const previousView = useRef(view);

  useEffect(() => {
    if (previousView.current !== view) {
      mainRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
      previousView.current = view;
    }
  }, [view]);

  function select(key: string) {
    if (
      !bracket ||
      locked.current ||
      bracket.history.length !== bracketVersion.current ||
      !bracket.round
        .slice(bracket.duel * 2, bracket.duel * 2 + 2)
        .some((movie) => movie.key === key)
    )
      return;
    locked.current = true;
    setTransitioning(true);
    setSelected(key);
    const nextRound =
      bracket.duel + 1 === bracket.round.length / 2 && bracket.round.length > 2;
    timer.current = setTimeout(
      () => {
        bracketVersion.current += 1;
        setBracket((current) =>
          current ? selectWinner(current, key) : current,
        );
        setSelected(null);
        timer.current = setTimeout(
          () => {
            locked.current = false;
            setTransitioning(false);
            timer.current = null;
          },
          reduced ? 0 : nextRound ? ROUND_TRANSITION_MS : 200,
        );
      },
      reduced ? 0 : 240,
    );
  }

  function resetSelection() {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
    locked.current = false;
    bracketVersion.current = 0;
    setSelected(null);
    setTransitioning(false);
  }

  function exitTournament() {
    resetSelection();
    initialBracket.current = null;
    setAvailability(null);
    setGeneration((value) => value + 1);
    setBracket(null);
  }

  return (
    <main
      ref={mainRef}
      className="min-h-screen w-full max-w-full min-w-0 px-3 py-6 sm:px-4 sm:py-12"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={view}
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: reduced ? 0 : 0.18 }}
        >
          {view === "settings" ? (
            <SettingsView
              settings={settings}
              setSettings={setSettings}
              genres={options?.genres ?? []}
              specifications={options?.specifications ?? []}
              popular={EXCLUDE_POPULAR_MOVIES}
              universes={EXCLUDE_UNIVERSES}
              // universesLoading={!universes && !universesError}
              // universesError={universesError}
              // retryUniverses={() => setUniversesAttempt((value) => value + 1)}
              optionsLoading={!options && !optionsError}
              optionsError={optionsError}
              // popularError={popularError}
              retryOptions={() => setOptionsAttempt((value) => value + 1)}
              // retryPopular={() => setPopularAttempt((value) => value + 1)}
              availability={{
                loading: !currentAvailability,
                total: currentAvailability?.total ?? null,
                error: currentAvailability?.error ?? false,
              }}
              retryAvailability={() => setGeneration((value) => value + 1)}
              reset={() => {
                setSettings(initialSettings);
                setAvailability(null);
                setGeneration((value) => value + 1);
              }}
              start={() => {
                if (currentAvailability?.bracket && options) {
                  bracketVersion.current = 0;
                  initialBracket.current = currentAvailability.bracket;
                  setBracket(currentAvailability.bracket);
                }
              }}
            />
          ) : (
            bracket &&
            (view === "game" ? (
              <GameView
                bracket={bracket}
                size={settings.size}
                posterUrl={posterUrl}
                lang={lang}
                selected={selected}
                locked={transitioning}
                select={select}
                startOver={() => {
                  if (initialBracket.current) {
                    resetSelection();
                    setBracket(initialBracket.current);
                  }
                }}
                exit={exitTournament}
              />
            ) : (
              <ResultView
                bracket={bracket}
                posterUrl={posterUrl}
                playAgain={exitTournament}
              />
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
