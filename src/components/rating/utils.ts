import { MovieOutUserRating, UserRatingCriteria } from "@/orval_api/model";

export type RateCriteriesEnum = keyof UserRatingCriteria;

// export type RatingAction = {
//   [K in keyof UserRatingCriteria]: { type: K; value: UserRatingCriteria[K] };
// }[keyof UserRatingCriteria];

export type GroupedCriteria<T extends keyof UserRatingCriteria> = Extract<
  keyof UserRatingCriteria,
  T
>;

export type ExtraRateCriteria = GroupedCriteria<
  "visual_effects" | "scare_factor" | "humor" | "animation_cartoon"
>;

export type RatingTemplate = Omit<UserRatingCriteria, ExtraRateCriteria> & {
  visual_effects: number;
  scare_factor: number;
  humor: number;
  animation_cartoon: number;
};

export const MIN_RATE = 0.01;

/**BASIC Initial Rate */
export const INITIAL_RATE: UserRatingCriteria = {
  acting: MIN_RATE,
  plot_storyline: MIN_RATE,
  script_dialogue: MIN_RATE,
  music: MIN_RATE,
  enjoyment: MIN_RATE,
  production_design: MIN_RATE,
};

/**Visual effect */
export const VE_INITIAL_RATE: UserRatingCriteria = {
  ...INITIAL_RATE,
  visual_effects: MIN_RATE,
};

/**Scare factor */
export const SF_INITIAL_RATE: UserRatingCriteria = {
  ...INITIAL_RATE,
  scare_factor: MIN_RATE,
};

/**Humor */
export const H_INITIAL_RATE: UserRatingCriteria = {
  ...INITIAL_RATE,
  humor: MIN_RATE,
};

/**Animation/Cartoon */
export const AC_INITIAL_RATE: UserRatingCriteria = {
  ...INITIAL_RATE,
  animation_cartoon: MIN_RATE,
};

export const RATING_MAX: RatingTemplate = {
  acting: 2.5,
  plot_storyline: 2,
  script_dialogue: 2,
  music: 1.5,
  enjoyment: 1,
  production_design: 1,
  // Additional
  visual_effects: 2,
  scare_factor: 3,
  humor: 3,
  animation_cartoon: 2,
};

/**Visual effects */
export const VS_MAX: RatingTemplate = {
  ...RATING_MAX,
  acting: RATING_MAX.acting - 0.5,
  plot_storyline: RATING_MAX.plot_storyline - 0.5,
  script_dialogue: RATING_MAX.script_dialogue - 0.5,
  production_design: RATING_MAX.production_design - 0.5,
};

/**Scare factor */
export const SF_MAX: RatingTemplate = {
  ...RATING_MAX,
  acting: RATING_MAX.acting - 1,
  plot_storyline: RATING_MAX.plot_storyline - 1,
  script_dialogue: RATING_MAX.script_dialogue - 1,
};

export const HUMOR_MAX: RatingTemplate = {
  ...RATING_MAX,
  acting: RATING_MAX.acting - 1,
  plot_storyline: RATING_MAX.plot_storyline - 1,
  script_dialogue: RATING_MAX.script_dialogue - 0.5,
  music: RATING_MAX.music - 0.5,
};

/**Animation/Cartoon */
export const AC_MAX: RatingTemplate = {
  ...RATING_MAX,
  acting: RATING_MAX.acting - 1.5,
  production_design: RATING_MAX.production_design - 0.5,
};

/**Utility function for exhaustive type checking */
// export function assertNever(x: never): never {
//   throw new Error(`Unhandled action: ${JSON.stringify(x)}`);
// }

export const checkRatingChanges = (
  state: UserRatingCriteria,
  ratingCriteria: MovieOutUserRating | undefined,
  isVisualEffects: boolean,
  isScareFactor: boolean,
  isHumor: boolean,
  isAnimationCartoon: boolean,
) => {
  if (ratingCriteria) {
    const criteriaKeys: RateCriteriesEnum[] = [
      "acting",
      "plot_storyline",
      "script_dialogue",
      "music",
      "enjoyment",
      "production_design",
    ];

    if (isVisualEffects) {
      criteriaKeys.push("visual_effects");
    }

    if (isScareFactor) {
      criteriaKeys.push("scare_factor");
    }

    if (isHumor) {
      criteriaKeys.push("humor");
    }

    if (isAnimationCartoon) {
      criteriaKeys.push("animation_cartoon");
    }

    const isSame = criteriaKeys.every(
      (key) => state[key] === ratingCriteria[key],
    );

    if (isSame) {
      return true;
    }

    return false;
  }
};

/**Get a max value depending of a selected Rating Type. */
export const getMaxValue = (
  isVisualEffects: boolean,
  isScareFactor: boolean,
  isHumor: boolean,
  isAnimationCartoon: boolean,
  vsMax: number,
  sfMax: number,
  hMax: number,
  acMax: number,
  defaultMax: number,
) => {
  if (isVisualEffects) return vsMax;
  if (isScareFactor) return sfMax;
  if (isHumor) return hMax;
  if (isAnimationCartoon) return acMax;
  return defaultMax;
};
