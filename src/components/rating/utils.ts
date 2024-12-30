import { MovieOutUserRating, UserRatingCriteria } from "@/orval_api/model";
import { toast } from "sonner";

export type RateCriteriesEnum = keyof UserRatingCriteria;

export type RatingAction = {
  [K in keyof UserRatingCriteria]: { type: K; value: UserRatingCriteria[K] };
}[keyof UserRatingCriteria];

export type GroupedCriteria<T extends keyof UserRatingCriteria> = Extract<
  keyof UserRatingCriteria,
  T
>;
// // Example
export type ExtraRateCriteria = GroupedCriteria<
  "visual_effects" | "scare_factor"
>;
// type StandardRateCriteria = GroupedCriteria<
//   Exclude<keyof UserRatingCriteria, ExtraRateCriteria>
// >;

export type StaticRatingType = Omit<UserRatingCriteria, ExtraRateCriteria> & {
  visual_effects: number;
  scare_factor: number;
};

export const MIN_RATE = 0.01;

export const INITIAL_RATE: UserRatingCriteria = {
  acting: MIN_RATE,
  plot_storyline: MIN_RATE,
  music: MIN_RATE,
  re_watchability: MIN_RATE,
  emotional_impact: MIN_RATE,
  dialogue: MIN_RATE,
  production_design: MIN_RATE,
  duration: MIN_RATE,
  // visual_effects: MIN_RATE,
  // scare_factor: MIN_RATE,
};

export const RATING_MAX: StaticRatingType = {
  acting: 2,
  plot_storyline: 2,
  music: 1.5,
  re_watchability: 1.5,
  emotional_impact: 1,
  dialogue: 1,
  production_design: 0.5,
  duration: 0.5,
  // Additional
  visual_effects: 1.5,
  scare_factor: 3,
};

export const VS_MAX: StaticRatingType = {
  ...RATING_MAX,
  acting: RATING_MAX.acting - 0.5,
  plot_storyline: RATING_MAX.plot_storyline - 1,
};

export const SF_MAX: StaticRatingType = {
  ...RATING_MAX,
  acting: RATING_MAX.acting - 1,
  plot_storyline: RATING_MAX.plot_storyline - 1,
  re_watchability: RATING_MAX.re_watchability - 1,
};

export const FULL_MAX: StaticRatingType = {
  ...RATING_MAX,
  acting: RATING_MAX.acting - 1,
  plot_storyline: RATING_MAX.plot_storyline - 1.25,
  re_watchability: RATING_MAX.re_watchability - 0.5,
  visual_effects: 1,
  scare_factor: 1.75,
};

export const DEFAULT_RATE: Omit<UserRatingCriteria, ExtraRateCriteria> = {
  acting: RATING_MAX.acting / 2,
  plot_storyline: RATING_MAX.plot_storyline / 2,
  music: RATING_MAX.music / 2,
  re_watchability: RATING_MAX.re_watchability / 2,
  emotional_impact: RATING_MAX.emotional_impact / 2,
  dialogue: RATING_MAX.dialogue / 2,
  production_design: RATING_MAX.production_design / 2,
  duration: RATING_MAX.duration / 2,
};

// Visual Effects Default Rate
export const VE_DEFAULT_RATE: Pick<
  UserRatingCriteria,
  "acting" | "plot_storyline" | "visual_effects"
> = {
  acting: (RATING_MAX.acting - 0.5) / 2,
  plot_storyline: (RATING_MAX.plot_storyline - 1) / 2,
  visual_effects: RATING_MAX.visual_effects / 2,
};

// Scare Factor Default Rate
export const SF_DEFAULT_RATE: Pick<
  UserRatingCriteria,
  "acting" | "re_watchability" | "plot_storyline" | "scare_factor"
> = {
  acting: (RATING_MAX.acting - 1) / 2,
  re_watchability: (RATING_MAX.re_watchability - 1) / 2,
  plot_storyline: (RATING_MAX.plot_storyline - 1) / 2,
  scare_factor: RATING_MAX.scare_factor / 2,
};

export const FULL_DEFAULT_RATE: Pick<
  UserRatingCriteria,
  | "acting"
  | "re_watchability"
  | "plot_storyline"
  | "visual_effects"
  | "scare_factor"
> = {
  acting: (RATING_MAX.acting - 1) / 2,
  plot_storyline: (RATING_MAX.plot_storyline - 1.25) / 2,
  re_watchability: (RATING_MAX.re_watchability - 0.5) / 2,
  visual_effects: 1 / 2,
  scare_factor: 1.75 / 2,
};

/**Utility function for exhaustive type checking */
export function assertNever(x: never): never {
  throw new Error(`Unhandled action: ${JSON.stringify(x)}`);
}

// type UpdState = "UPDATE_STATE";

export function updateRateReducer(
  state: UserRatingCriteria,
  action: RatingAction,
  // action: RatingAction | { type: UpdState; value: UserRatingCriteria },
): UserRatingCriteria {
  if (!action) {
    throw new Error("Action is undefined"); // Handle the undefined case
  }
  switch (action.type) {
    case "acting":
      return { ...state, acting: action.value };
    case "dialogue":
      return { ...state, dialogue: action.value };
    case "duration":
      return { ...state, duration: action.value };
    case "emotional_impact":
      return { ...state, emotional_impact: action.value };
    case "music":
      return { ...state, music: action.value };
    case "plot_storyline":
      return { ...state, plot_storyline: action.value };
    case "production_design":
      return { ...state, production_design: action.value };
    case "re_watchability":
      return { ...state, re_watchability: action.value };
    case "scare_factor":
      return { ...state, scare_factor: action.value };
    case "visual_effects":
      return { ...state, visual_effects: action.value };
    default:
      return assertNever(action); // Ensure all cases are handled
  }
}

export function getRatingCriteriaState(
  isVisualEffects: boolean,
  isScareFactor: boolean,
  isFull: boolean,
  ratingCriteria?: MovieOutUserRating,
): UserRatingCriteria {
  const initialState: UserRatingCriteria = {
    acting: isFull
      ? FULL_DEFAULT_RATE.acting
      : isVisualEffects
        ? VE_DEFAULT_RATE.acting
        : isScareFactor
          ? SF_DEFAULT_RATE.acting
          : DEFAULT_RATE.acting,
    plot_storyline: isFull
      ? FULL_DEFAULT_RATE.plot_storyline
      : isVisualEffects
        ? VE_DEFAULT_RATE.plot_storyline
        : isScareFactor
          ? SF_DEFAULT_RATE.plot_storyline
          : DEFAULT_RATE.plot_storyline,
    music: DEFAULT_RATE.music,
    re_watchability: isFull
      ? FULL_DEFAULT_RATE.re_watchability
      : isScareFactor
        ? SF_DEFAULT_RATE.re_watchability
        : DEFAULT_RATE.re_watchability,
    emotional_impact: DEFAULT_RATE.emotional_impact,
    dialogue: DEFAULT_RATE.dialogue,
    production_design: DEFAULT_RATE.production_design,
    duration: DEFAULT_RATE.duration,
    visual_effects: isFull
      ? FULL_DEFAULT_RATE.visual_effects
      : isVisualEffects
        ? VE_DEFAULT_RATE.visual_effects
        : 0,
    scare_factor: isFull
      ? FULL_DEFAULT_RATE.scare_factor
      : isScareFactor
        ? SF_DEFAULT_RATE.scare_factor
        : 0,
  };

  return {
    acting: ratingCriteria?.acting || initialState.acting,
    plot_storyline:
      ratingCriteria?.plot_storyline || initialState.plot_storyline,
    music: ratingCriteria?.music || initialState.music,
    re_watchability:
      ratingCriteria?.re_watchability || initialState.re_watchability,
    emotional_impact:
      ratingCriteria?.emotional_impact || initialState.emotional_impact,
    dialogue: ratingCriteria?.dialogue || initialState.dialogue,
    production_design:
      ratingCriteria?.production_design || initialState.production_design,
    duration: ratingCriteria?.duration || initialState.duration,
    visual_effects:
      ratingCriteria?.visual_effects || initialState.visual_effects,
    scare_factor: ratingCriteria?.scare_factor || initialState.scare_factor,
  };
}

export const checkRatingChanges = (
  state: UserRatingCriteria,
  ratingCriteria: MovieOutUserRating | undefined,
  isVisualEffects: boolean,
  isScareFactor: boolean,
  isFull: boolean,
) => {
  if (ratingCriteria) {
    const criteriaKeys: RateCriteriesEnum[] = [
      "acting",
      "plot_storyline",
      "music",
      "re_watchability",
      "emotional_impact",
      "dialogue",
      "production_design",
      "duration",
    ];

    if (isVisualEffects) {
      criteriaKeys.push("visual_effects");
    }

    if (isScareFactor) {
      criteriaKeys.push("scare_factor");
    }

    if (isFull) {
      criteriaKeys.push("visual_effects", "scare_factor");
    }

    const isEqual = criteriaKeys.every(
      (key) => state[key] === ratingCriteria[key],
    );

    if (isEqual) {
      toast.warning("Please rate at least one criteria before submitting");
      return true;
    }

    return false;
  }
};
