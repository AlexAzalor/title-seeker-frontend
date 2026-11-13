import type { Movie } from "./types";

export type Bracket = {
  round: Movie[];
  duel: number;
  advancing: Movie[];
  history: Movie[];
  roundNumber: number;
  winner: Movie | null;
};

export function createBracket(movies: Movie[]): Bracket {
  if (
    (movies.length !== 16 && movies.length !== 32) ||
    new Set(movies.map((movie) => movie.key)).size !== movies.length
  ) {
    throw new Error("Invalid tournament pool");
  }
  return {
    round: movies,
    duel: 0,
    advancing: [],
    history: [],
    roundNumber: 1,
    winner: null,
  };
}

export function selectWinner(bracket: Bracket, key: string): Bracket {
  if (bracket.winner) return bracket;
  const pair = bracket.round.slice(bracket.duel * 2, bracket.duel * 2 + 2);
  const winner = pair.find((movie) => movie.key === key);
  if (!winner) return bracket;

  const advancing = [...bracket.advancing, winner];
  const history = [...bracket.history, winner];
  if (bracket.duel + 1 < bracket.round.length / 2) {
    return { ...bracket, duel: bracket.duel + 1, advancing, history };
  }
  if (advancing.length === 1) {
    return { ...bracket, advancing, history, winner };
  }
  return {
    ...bracket,
    round: advancing,
    duel: 0,
    advancing: [],
    history,
    roundNumber: bracket.roundNumber + 1,
  };
}
