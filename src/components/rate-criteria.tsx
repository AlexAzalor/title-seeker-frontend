"use client";

import { useReducer, useState } from "react";
import { RateSlider } from "./rate-slider";
import {
  MovieOutUserRating,
  RatingCriterion,
  UserRateMovieIn,
  UserRatingCriteria,
} from "@/orval_api/model";
import { rateMovie, updateRateMovie } from "@/app/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// enum RateCriteriesEnum {
//   ACTING = "acting",
//   PLOT_STORYLINE = "plotStoryline",
//   MUSIC = "music",
//   RE_WATCHABILITY = "reWatchability",
//   EMOTIONAL_IMPACT = "emotionalImpact",
//   DIALOGUE = "dialogue",
//   PRODUCTION_DESIGN = "productionDesign",
//   DURATION = "duration",
//   VISUAL_EFFECTS = "visualEffects",
//   SCARE_FACTOR = "scareFactor",
// }

type RateCriteriesEnum = keyof UserRatingCriteria;

type RatingAction = {
  [K in keyof UserRatingCriteria]: { type: K; value: UserRatingCriteria[K] };
}[keyof UserRatingCriteria];

// const VISUAL_EFFECTS_ON = false;
// const SCARE_FACTOR_ON = false;
// const BOTH_ON = VISUAL_EFFECTS_ON && SCARE_FACTOR_ON;
const MIN_RATE = 0.01;
const SHOW_RATE_VALUES = false;
// const SUBSTRACT_RATE = 0.5;

type GroupedCriteria<T extends keyof UserRatingCriteria> = Extract<
  keyof UserRatingCriteria,
  T
>;
// // Example
type ExtraRateCriteria = GroupedCriteria<"visual_effects" | "scare_factor">;
// type StandardRateCriteria = GroupedCriteria<
//   Exclude<keyof UserRatingCriteria, ExtraRateCriteria>
// >;

type StaticRatingType = Omit<UserRatingCriteria, ExtraRateCriteria> & {
  visual_effects: number;
  scare_factor: number;
};

const RATING_MAX: StaticRatingType = {
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

const DEFAULT_RATE: Omit<UserRatingCriteria, ExtraRateCriteria> = {
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
const VE_DEFAULT_RATE: Pick<
  UserRatingCriteria,
  "acting" | "plot_storyline" | "visual_effects"
> = {
  acting: (RATING_MAX.acting - 0.5) / 2,
  plot_storyline: (RATING_MAX.plot_storyline - 1) / 2,
  visual_effects: RATING_MAX.visual_effects / 2,
};

// Scare Factor Default Rate
const SF_DEFAULT_RATE: Pick<
  UserRatingCriteria,
  "acting" | "re_watchability" | "plot_storyline" | "scare_factor"
> = {
  acting: (RATING_MAX.acting - 1) / 2,
  re_watchability: (RATING_MAX.re_watchability - 1) / 2,
  plot_storyline: (RATING_MAX.plot_storyline - 1) / 2,
  scare_factor: RATING_MAX.scare_factor / 2,
};

// Utility function for exhaustive type checking
function assertNever(x: never): never {
  throw new Error(`Unhandled action: ${JSON.stringify(x)}`);
}

export function updateRateReducer(
  state: UserRatingCriteria,
  action: RatingAction,
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

type Props = {
  movieKey: string;
  ratingCriteria?: MovieOutUserRating;
  criteriaType: RatingCriterion;
};

export const RateCriteria = ({
  movieKey,
  ratingCriteria,
  criteriaType,
}: Props) => {
  const isVisualEffects = criteriaType === RatingCriterion.visual_effects;
  const isScareFactor = criteriaType === RatingCriterion.scare_factor;

  const vsMax: StaticRatingType = {
    ...RATING_MAX,
    acting: RATING_MAX.acting - 0.5,
    plot_storyline: RATING_MAX.plot_storyline - 1,
  };

  const sfMax: StaticRatingType = {
    ...RATING_MAX,
    acting: RATING_MAX.acting - 1,
    plot_storyline: RATING_MAX.plot_storyline - 1,
    re_watchability: RATING_MAX.re_watchability - 1,
  };

  const initialState: UserRatingCriteria = {
    acting: isVisualEffects
      ? VE_DEFAULT_RATE.acting
      : isScareFactor
        ? SF_DEFAULT_RATE.acting
        : DEFAULT_RATE.acting,
    plot_storyline: isVisualEffects
      ? VE_DEFAULT_RATE.plot_storyline
      : isScareFactor
        ? SF_DEFAULT_RATE.plot_storyline
        : DEFAULT_RATE.plot_storyline,
    // ?
    music: DEFAULT_RATE.music,
    re_watchability: isScareFactor
      ? SF_DEFAULT_RATE.re_watchability
      : DEFAULT_RATE.re_watchability,
    emotional_impact: DEFAULT_RATE.emotional_impact,
    dialogue: DEFAULT_RATE.dialogue,
    production_design: DEFAULT_RATE.production_design,
    duration: DEFAULT_RATE.duration,
    visual_effects: isVisualEffects ? VE_DEFAULT_RATE.visual_effects : 0,
    scare_factor: isScareFactor ? SF_DEFAULT_RATE.scare_factor : 0,
  };

  const userRating: UserRatingCriteria = {
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

  const [state, dispatch] = useReducer(updateRateReducer, userRating);
  const [showValues, setShowValues] = useState(SHOW_RATE_VALUES);
  const router = useRouter();

  const handleValueChange = (value: number[], type: RateCriteriesEnum) => {
    switch (type) {
      case "acting":
        dispatch({ type, value: value[0] });
        break;
      case "plot_storyline":
        dispatch({ type, value: value[0] });
        break;
      case "music":
        dispatch({ type, value: value[0] });
        break;
      case "re_watchability":
        dispatch({ type, value: value[0] });
        break;
      case "emotional_impact":
        dispatch({ type, value: value[0] });
        break;
      case "dialogue":
        dispatch({ type, value: value[0] });
        break;
      case "production_design":
        dispatch({ type, value: value[0] });
        break;
      case "duration":
        dispatch({ type, value: value[0] });
        break;
      case "visual_effects":
        dispatch({ type, value: value[0] });
        break;
      case "scare_factor":
        dispatch({ type, value: value[0] });
        break;
      default:
        assertNever(type); // Exhaustive check
    }
  };

  const handleShowValues = () => {
    setShowValues((prev) => !prev);
  };

  let sumRate =
    state.acting +
    state.plot_storyline +
    state.music +
    state.re_watchability +
    state.emotional_impact +
    state.dialogue +
    state.production_design +
    state.duration;

  if (isVisualEffects && state.visual_effects) {
    sumRate += state.visual_effects;
  }

  if (isScareFactor && state.scare_factor) {
    sumRate += state.scare_factor;
  }

  const handleRateMovie = async () => {
    const data: UserRateMovieIn = {
      movie_key: movieKey,
      uuid: "some_uuid",
      rating: Number(sumRate.toFixed(2)),
      acting: state.acting,
      plot_storyline: state.plot_storyline,
      music: state.music,
      re_watchability: state.re_watchability,
      emotional_impact: state.emotional_impact,
      dialogue: state.dialogue,
      production_design: state.production_design,
      duration: state.duration,
      visual_effects: state.visual_effects,
      scare_factor: state.scare_factor,
    };

    if (ratingCriteria) {
      try {
        await updateRateMovie(data);
        toast.success("Rating UPDATED");
      } catch {
        toast.error("Error occured");
      }
    } else {
      try {
        await rateMovie(data);
        toast.success("Rating ADDED");
      } catch {
        toast.error("Error occured");
      }
    }

    router.refresh();
  };

  return (
    <div className="w-[500px]">
      <h1>Rate: {sumRate.toFixed(2)}</h1>
      {/* add tooltip or warning text or smth or modal? */}
      <button className="rounded-md bg-red-300 p-1" onClick={handleShowValues}>
        Show values
      </button>
      {/* <button onClick={() => toast.success("Event has been created")}>
        toast
      </button> */}
      <div>
        Acting
        <RateSlider
          value={showValues ? [state.acting] : undefined}
          max={
            isVisualEffects
              ? vsMax.acting
              : isScareFactor
                ? sfMax.acting
                : RATING_MAX.acting
          }
          min={MIN_RATE}
          // className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
          defaultValue={[userRating.acting]}
          onValueChange={(value) => handleValueChange(value, "acting")}
        />
      </div>
      <div>
        Plot/Storyline
        <RateSlider
          value={showValues ? [state.plot_storyline] : undefined}
          max={
            isVisualEffects
              ? vsMax.plot_storyline
              : isScareFactor
                ? sfMax.plot_storyline
                : RATING_MAX.plot_storyline
          }
          min={MIN_RATE}
          defaultValue={[userRating.plot_storyline]}
          onValueChange={(value) => handleValueChange(value, "plot_storyline")}
        />
      </div>
      <div>
        Music
        <RateSlider
          value={showValues ? [state.music] : undefined}
          max={RATING_MAX.music}
          min={MIN_RATE}
          defaultValue={[userRating.music]}
          onValueChange={(value) => handleValueChange(value, "music")}
        />
      </div>
      <div>
        Re-watchability
        <RateSlider
          value={showValues ? [state.re_watchability] : undefined}
          max={
            isScareFactor ? sfMax.re_watchability : RATING_MAX.re_watchability
          }
          min={MIN_RATE}
          defaultValue={[userRating.re_watchability]}
          onValueChange={(value) => handleValueChange(value, "re_watchability")}
        />
      </div>
      <div>
        Emotional Impact
        <RateSlider
          value={showValues ? [state.emotional_impact] : undefined}
          max={RATING_MAX.emotional_impact}
          min={MIN_RATE}
          defaultValue={[userRating.emotional_impact]}
          onValueChange={(value) =>
            handleValueChange(value, "emotional_impact")
          }
        />
      </div>
      <div>
        Dialogue
        <RateSlider
          value={showValues ? [state.dialogue] : undefined}
          max={RATING_MAX.dialogue}
          min={MIN_RATE}
          defaultValue={[userRating.dialogue]}
          onValueChange={(value) => handleValueChange(value, "dialogue")}
        />
      </div>
      <div>
        Production Design
        <RateSlider
          value={showValues ? [state.production_design] : undefined}
          max={RATING_MAX.production_design}
          min={MIN_RATE}
          defaultValue={[userRating.production_design]}
          onValueChange={(value) =>
            handleValueChange(value, "production_design")
          }
        />
      </div>

      <div>
        Duration
        <RateSlider
          value={showValues ? [state.duration] : undefined}
          max={RATING_MAX.duration}
          min={MIN_RATE}
          defaultValue={[userRating.duration]}
          onValueChange={(value) => handleValueChange(value, "duration")}
        />
      </div>

      {!!userRating.visual_effects && (
        <div>
          Visual Effects
          <RateSlider
            value={showValues ? [state.visual_effects || 0] : undefined}
            max={RATING_MAX.visual_effects}
            min={MIN_RATE}
            defaultValue={[userRating.visual_effects]}
            onValueChange={(value) =>
              handleValueChange(value, "visual_effects")
            }
          />
        </div>
      )}

      {!!userRating.scare_factor && (
        <div>
          Scare Factor
          <RateSlider
            value={showValues ? [state.scare_factor || 0] : undefined}
            max={RATING_MAX.scare_factor}
            min={MIN_RATE}
            defaultValue={[userRating.scare_factor]}
            onValueChange={(value) => handleValueChange(value, "scare_factor")}
          />
        </div>
      )}

      <button className="bg-orange-400 p-2" onClick={handleRateMovie}>
        Rate movie
      </button>
    </div>
  );
};
