"use client";

import { useReducer, useState } from "react";
import { RateSlider } from "./rate-slider";
import {
  MovieOutUserRating,
  RatingCriterion,
  UserRateMovieIn,
} from "@/orval_api/model";
import { rateMovie, updateRateMovie } from "@/app/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

enum RateCriteriesEnum {
  ACTING = "acting",
  PLOT_STORYLINE = "plotStoryline",
  MUSIC = "music",
  RE_WATCHABILITY = "reWatchability",
  EMOTIONAL_IMPACT = "emotionalImpact",
  DIALOGUE = "dialogue",
  PRODUCTION_DESIGN = "productionDesign",
  DURATION = "duration",
  VISUAL_EFFECTS = "visualEffects",
  SCARE_FACTOR = "scareFactor",
}

interface RatingState {
  acting: number;
  plotStoryline: number;
  music: number;
  reWatchability: number;
  emotionalImpact: number;
  dialogue: number;
  productionDesign: number;
  duration: number;
  visualEffects: number;
  scareFactor: number;
}
type RatingAction =
  | { type: RateCriteriesEnum.ACTING; acting: number }
  | { type: RateCriteriesEnum.PLOT_STORYLINE; plotStoryline: number }
  | { type: RateCriteriesEnum.MUSIC; music: number }
  | { type: RateCriteriesEnum.RE_WATCHABILITY; reWatchability: number }
  | { type: RateCriteriesEnum.EMOTIONAL_IMPACT; emotionalImpact: number }
  | { type: RateCriteriesEnum.DIALOGUE; dialogue: number }
  | { type: RateCriteriesEnum.PRODUCTION_DESIGN; productionDesign: number }
  | { type: RateCriteriesEnum.DURATION; duration: number }
  | { type: RateCriteriesEnum.VISUAL_EFFECTS; visualEffects: number }
  | { type: RateCriteriesEnum.SCARE_FACTOR; scareFactor: number };

const VISUAL_EFFECTS_ON = false;
const SCARE_FACTOR_ON = false;
const BOTH_ON = VISUAL_EFFECTS_ON && SCARE_FACTOR_ON;
const MIN_RATE = 0.01;
const SHOW_RATE_VALUES = false;
// const SUBSTRACT_RATE = 0.5;

const RATING_MAX = {
  acting: 2,
  plotStoryline: 2,
  music: 1.5,
  reWatchability: 1.5,
  emotionalImpact: 1,
  dialogue: 1,
  productionDesign: 0.5,
  duration: 0.5,
  // Additional
  visualEffects: 1.5,
  scareFactor: 3,
};

const DEFAULT_RATE = {
  acting: RATING_MAX.acting / 2,
  plotStoryline: RATING_MAX.plotStoryline / 2,
  music: RATING_MAX.music / 2,
  reWatchability: RATING_MAX.reWatchability / 2,
  emotionalImpact: RATING_MAX.emotionalImpact / 2,
  dialogue: RATING_MAX.dialogue / 2,
  productionDesign: RATING_MAX.productionDesign / 2,
  duration: RATING_MAX.duration / 2,
};
// Visual Effects Default Rate
const VE_DEFAULT_RATE = {
  acting: (RATING_MAX.acting - 0.5) / 2,
  plotStoryline: (RATING_MAX.plotStoryline - 1) / 2,
  visualEffects: RATING_MAX.visualEffects / 2,
};

const SF_DEFAULT_RATE = {
  acting: (RATING_MAX.acting - 1) / 2,
  plotStoryline: (RATING_MAX.plotStoryline - 1) / 2,
  reWatchability: (RATING_MAX.reWatchability - 1) / 2,
  scareFactor: RATING_MAX.scareFactor / 2,
};

// const initialState = {
//   acting: BOTH_ON ? 0.5 : VISUAL_EFFECTS_ON ? 0.75 : SCARE_FACTOR_ON ? 0.5 : 1,
//   plotStoryline: BOTH_ON
//     ? 0.375
//     : VISUAL_EFFECTS_ON
//       ? 0.5
//       : SCARE_FACTOR_ON
//         ? 0.5
//         : 1,
//   music: 0.75,
//   reWatchability: BOTH_ON ? 0.5 : SCARE_FACTOR_ON ? 0.25 : 0.75,
//   emotionalImpact: 0.5,
//   dialogue: 0.5,
//   productionDesign: 0.25,
//   duration: 0.25,
//   visualEffects: BOTH_ON ? 0.5 : VISUAL_EFFECTS_ON ? 0.75 : 0,
//   scareFactor: BOTH_ON ? 0.875 : SCARE_FACTOR_ON ? 1.5 : 0,
// };

export function updateRateReducer(
  state: RatingState,
  action: RatingAction,
): RatingState {
  switch (action.type) {
    case RateCriteriesEnum.ACTING:
      return { ...state, acting: action.acting };
    case RateCriteriesEnum.PLOT_STORYLINE:
      return { ...state, plotStoryline: action.plotStoryline };
    case RateCriteriesEnum.MUSIC:
      return { ...state, music: action.music };
    case RateCriteriesEnum.RE_WATCHABILITY:
      return { ...state, reWatchability: action.reWatchability };
    case RateCriteriesEnum.EMOTIONAL_IMPACT:
      return { ...state, emotionalImpact: action.emotionalImpact };
    case RateCriteriesEnum.DIALOGUE:
      return { ...state, dialogue: action.dialogue };
    case RateCriteriesEnum.PRODUCTION_DESIGN:
      return { ...state, productionDesign: action.productionDesign };
    case RateCriteriesEnum.DURATION:
      return { ...state, duration: action.duration };
    case RateCriteriesEnum.VISUAL_EFFECTS:
      return { ...state, visualEffects: action.visualEffects };
    case RateCriteriesEnum.SCARE_FACTOR:
      return { ...state, scareFactor: action.scareFactor };
    default:
      throw new Error("Unrecognized command");
  }
}

type Props = {
  movieKey: string;
  ratingCriteria?: MovieOutUserRating;
  criteriaType: RatingCriterion;
};

export const RateCriteries = ({
  movieKey,
  ratingCriteria,
  criteriaType,
}: Props) => {
  const isVisualEffects = criteriaType === RatingCriterion.visual_effects;
  const isScareFactor = criteriaType === RatingCriterion.scare_factor;

  const vsMax = {
    ...RATING_MAX,
    acting: RATING_MAX.acting - 0.5,
    plotStoryline: RATING_MAX.plotStoryline - 1,
  };

  const sfMax = {
    ...RATING_MAX,
    acting: RATING_MAX.acting - 1,
    plotStoryline: RATING_MAX.plotStoryline - 1,
    reWatchability: RATING_MAX.reWatchability - 1,
  };

  const initialState = {
    acting: isVisualEffects
      ? VE_DEFAULT_RATE.acting
      : isScareFactor
        ? SF_DEFAULT_RATE.acting
        : DEFAULT_RATE.acting,
    plotStoryline: isVisualEffects
      ? VE_DEFAULT_RATE.plotStoryline
      : isScareFactor
        ? SF_DEFAULT_RATE.plotStoryline
        : DEFAULT_RATE.plotStoryline,
    // ?
    music: DEFAULT_RATE.music,
    reWatchability: isScareFactor
      ? SF_DEFAULT_RATE.reWatchability
      : DEFAULT_RATE.reWatchability,
    emotionalImpact: DEFAULT_RATE.emotionalImpact,
    dialogue: DEFAULT_RATE.dialogue,
    productionDesign: DEFAULT_RATE.productionDesign,
    duration: DEFAULT_RATE.duration,
    visualEffects: isVisualEffects ? VE_DEFAULT_RATE.visualEffects : 0,
    scareFactor: isScareFactor ? SF_DEFAULT_RATE.scareFactor : 0,
  };

  const userRating: RatingState = {
    acting: ratingCriteria?.acting || initialState.acting,
    plotStoryline: ratingCriteria?.plot_storyline || initialState.plotStoryline,
    music: ratingCriteria?.music || initialState.music,
    reWatchability:
      ratingCriteria?.re_watchability || initialState.reWatchability,
    emotionalImpact:
      ratingCriteria?.emotional_impact || initialState.emotionalImpact,
    dialogue: ratingCriteria?.dialogue || initialState.dialogue,
    productionDesign:
      ratingCriteria?.production_design || initialState.productionDesign,
    duration: ratingCriteria?.duration || initialState.duration,
    visualEffects: ratingCriteria?.visual_effects || initialState.visualEffects,
    scareFactor: ratingCriteria?.scare_factor || initialState.scareFactor,
  };

  const [state, dispatch] = useReducer(updateRateReducer, userRating);
  const [showValues, setShowValues] = useState(SHOW_RATE_VALUES);
  const router = useRouter();

  const handleValueChange = (value: number[], type: RateCriteriesEnum) => {
    switch (type) {
      case RateCriteriesEnum.ACTING:
        dispatch({ type, acting: value[0] });
        break;
      case RateCriteriesEnum.PLOT_STORYLINE:
        dispatch({ type, plotStoryline: value[0] });
        break;
      case RateCriteriesEnum.MUSIC:
        dispatch({ type, music: value[0] });
        break;
      case RateCriteriesEnum.RE_WATCHABILITY:
        dispatch({ type, reWatchability: value[0] });
        break;
      case RateCriteriesEnum.EMOTIONAL_IMPACT:
        dispatch({ type, emotionalImpact: value[0] });
        break;
      case RateCriteriesEnum.DIALOGUE:
        dispatch({ type, dialogue: value[0] });
        break;
      case RateCriteriesEnum.PRODUCTION_DESIGN:
        dispatch({ type, productionDesign: value[0] });
        break;
      case RateCriteriesEnum.DURATION:
        dispatch({ type, duration: value[0] });
        break;
      case RateCriteriesEnum.VISUAL_EFFECTS:
        dispatch({ type, visualEffects: value[0] });
        break;
      case RateCriteriesEnum.SCARE_FACTOR:
        dispatch({ type, scareFactor: value[0] });
        break;
      default:
        throw new Error("Unrecognized type");
    }
  };

  const handleShowValues = () => {
    setShowValues((prev) => !prev);
  };

  let sumRate =
    state.acting +
    state.plotStoryline +
    state.music +
    state.reWatchability +
    state.emotionalImpact +
    state.dialogue +
    state.productionDesign +
    state.duration;
  // state.visualEffects +
  // state.scareFactor;
  if (isVisualEffects) {
    sumRate += state.visualEffects;
  }

  if (isScareFactor) {
    sumRate += state.scareFactor;
  }

  const handleRateMovie = async () => {
    const data: UserRateMovieIn = {
      movie_key: movieKey,
      uuid: "some_uuid",
      rating: Number(sumRate.toFixed(2)),
      acting: state.acting,
      plot_storyline: state.plotStoryline,
      music: state.music,
      re_watchability: state.reWatchability,
      emotional_impact: state.emotionalImpact,
      dialogue: state.dialogue,
      production_design: state.productionDesign,
      duration: state.duration,
      visual_effects: state.visualEffects,
      scare_factor: state.scareFactor,
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
          onValueChange={(value) =>
            handleValueChange(value, RateCriteriesEnum.ACTING)
          }
        />
      </div>
      <div>
        Plot/Storyline
        <RateSlider
          value={showValues ? [state.plotStoryline] : undefined}
          max={
            isVisualEffects
              ? vsMax.plotStoryline
              : isScareFactor
                ? sfMax.plotStoryline
                : RATING_MAX.plotStoryline
          }
          min={MIN_RATE}
          defaultValue={[userRating.plotStoryline]}
          onValueChange={(value) =>
            handleValueChange(value, RateCriteriesEnum.PLOT_STORYLINE)
          }
        />
      </div>
      <div>
        Music
        <RateSlider
          value={showValues ? [state.music] : undefined}
          max={RATING_MAX.music}
          min={MIN_RATE}
          defaultValue={[userRating.music]}
          onValueChange={(value) =>
            handleValueChange(value, RateCriteriesEnum.MUSIC)
          }
        />
      </div>
      <div>
        Re-watchability
        <RateSlider
          value={showValues ? [state.reWatchability] : undefined}
          max={isScareFactor ? sfMax.reWatchability : RATING_MAX.reWatchability}
          min={MIN_RATE}
          defaultValue={[userRating.reWatchability]}
          onValueChange={(value) =>
            handleValueChange(value, RateCriteriesEnum.RE_WATCHABILITY)
          }
        />
      </div>
      <div>
        Emotional Impact
        <RateSlider
          value={showValues ? [state.emotionalImpact] : undefined}
          max={RATING_MAX.emotionalImpact}
          min={MIN_RATE}
          defaultValue={[userRating.emotionalImpact]}
          onValueChange={(value) =>
            handleValueChange(value, RateCriteriesEnum.EMOTIONAL_IMPACT)
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
          onValueChange={(value) =>
            handleValueChange(value, RateCriteriesEnum.DIALOGUE)
          }
        />
      </div>
      <div>
        Production Design
        <RateSlider
          value={showValues ? [state.productionDesign] : undefined}
          max={RATING_MAX.productionDesign}
          min={MIN_RATE}
          defaultValue={[userRating.productionDesign]}
          onValueChange={(value) =>
            handleValueChange(value, RateCriteriesEnum.PRODUCTION_DESIGN)
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
          onValueChange={(value) =>
            handleValueChange(value, RateCriteriesEnum.DURATION)
          }
        />
      </div>

      {isVisualEffects && (
        <div>
          Visual Effects
          <RateSlider
            value={showValues ? [state.visualEffects] : undefined}
            max={RATING_MAX.visualEffects}
            min={MIN_RATE}
            defaultValue={[userRating.visualEffects]}
            onValueChange={(value) =>
              handleValueChange(value, RateCriteriesEnum.VISUAL_EFFECTS)
            }
          />
        </div>
      )}

      {(BOTH_ON || isScareFactor) && (
        <div>
          Scare Factor
          <RateSlider
            value={showValues ? [state.scareFactor] : undefined}
            max={RATING_MAX.scareFactor}
            min={MIN_RATE}
            defaultValue={[userRating.scareFactor]}
            onValueChange={(value) =>
              handleValueChange(value, RateCriteriesEnum.SCARE_FACTOR)
            }
          />
        </div>
      )}

      <button className="bg-orange-400 p-2" onClick={handleRateMovie}>
        Rate movie
      </button>
    </div>
  );
};
