"use client";

import { useReducer, useState } from "react";
import { RateSlider } from "./rate-slider";
import { MovieOutUserRating, UserRateMovieIn } from "@/orval_api/model";
import { rateMovie, updateRateMovie } from "@/app/actions";
import { useRouter } from "next/navigation";

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
};

export const RateCriteries = ({ movieKey, ratingCriteria }: Props) => {
  const initialState = {
    acting: ratingCriteria
      ? ratingCriteria.acting
      : BOTH_ON
        ? 0.5
        : VISUAL_EFFECTS_ON
          ? 0.75
          : SCARE_FACTOR_ON
            ? 0.5
            : 1,
    plotStoryline: ratingCriteria
      ? ratingCriteria.plot_storyline
      : BOTH_ON
        ? 0.375
        : VISUAL_EFFECTS_ON
          ? 0.5
          : SCARE_FACTOR_ON
            ? 0.5
            : 1,
    music: ratingCriteria ? ratingCriteria.music : 0.75,
    reWatchability: ratingCriteria
      ? ratingCriteria.re_watchability
      : BOTH_ON
        ? 0.5
        : SCARE_FACTOR_ON
          ? 0.25
          : 0.75,
    emotionalImpact: ratingCriteria ? ratingCriteria.emotional_impact : 0.5,
    dialogue: ratingCriteria ? ratingCriteria.dialogue : 0.5,
    productionDesign: ratingCriteria ? ratingCriteria.production_design : 0.25,
    duration: ratingCriteria ? ratingCriteria.duration : 0.25,
    visualEffects: BOTH_ON ? 0.5 : VISUAL_EFFECTS_ON ? 0.75 : 0,
    scareFactor: BOTH_ON ? 0.875 : SCARE_FACTOR_ON ? 1.5 : 0,
  };

  const [state, dispatch] = useReducer(updateRateReducer, initialState);
  const [showValues, setShowValues] = useState(SHOW_RATE_VALUES);
  const router = useRouter();

  // const [rate, setRate] = useState(0);

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

  const sumRate =
    state.acting +
    state.plotStoryline +
    state.music +
    state.reWatchability +
    state.emotionalImpact +
    state.dialogue +
    state.productionDesign +
    state.duration +
    state.visualEffects +
    state.scareFactor;

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
    };

    if (ratingCriteria) {
      console.log("PUT RATE");

      await updateRateMovie(data);
    } else {
      console.log("POST RATE");
      await rateMovie(data);
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
      <div>
        Acting
        <RateSlider
          value={showValues ? [state.acting] : undefined}
          max={BOTH_ON ? 1 : VISUAL_EFFECTS_ON ? 1.5 : SCARE_FACTOR_ON ? 1 : 2}
          min={MIN_RATE}
          // className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
          defaultValue={[initialState.acting]}
          onValueChange={(value) =>
            handleValueChange(value, RateCriteriesEnum.ACTING)
          }
        />
      </div>
      <div>
        Plot/Storyline
        <RateSlider
          value={showValues ? [state.plotStoryline] : undefined}
          max={BOTH_ON ? 0.75 : VISUAL_EFFECTS_ON ? 1 : SCARE_FACTOR_ON ? 1 : 2}
          min={MIN_RATE}
          defaultValue={[initialState.plotStoryline]}
          onValueChange={(value) =>
            handleValueChange(value, RateCriteriesEnum.PLOT_STORYLINE)
          }
        />
      </div>
      <div>
        Music
        <RateSlider
          value={showValues ? [state.music] : undefined}
          max={1.5}
          min={MIN_RATE}
          defaultValue={[initialState.music]}
          onValueChange={(value) =>
            handleValueChange(value, RateCriteriesEnum.MUSIC)
          }
        />
      </div>
      <div>
        Re-watchability
        <RateSlider
          value={showValues ? [state.reWatchability] : undefined}
          max={BOTH_ON ? 1 : SCARE_FACTOR_ON ? 0.5 : 1.5}
          min={MIN_RATE}
          defaultValue={[initialState.reWatchability]}
          onValueChange={(value) =>
            handleValueChange(value, RateCriteriesEnum.RE_WATCHABILITY)
          }
        />
      </div>
      <div>
        Emotional Impact
        <RateSlider
          value={showValues ? [state.emotionalImpact] : undefined}
          max={1}
          min={MIN_RATE}
          defaultValue={[initialState.emotionalImpact]}
          onValueChange={(value) =>
            handleValueChange(value, RateCriteriesEnum.EMOTIONAL_IMPACT)
          }
        />
      </div>
      <div>
        Dialogue
        <RateSlider
          value={showValues ? [state.dialogue] : undefined}
          max={1}
          min={MIN_RATE}
          defaultValue={[initialState.dialogue]}
          onValueChange={(value) =>
            handleValueChange(value, RateCriteriesEnum.DIALOGUE)
          }
        />
      </div>
      <div>
        Production Design
        <RateSlider
          value={showValues ? [state.productionDesign] : undefined}
          max={0.5}
          min={MIN_RATE}
          defaultValue={[initialState.productionDesign]}
          onValueChange={(value) =>
            handleValueChange(value, RateCriteriesEnum.PRODUCTION_DESIGN)
          }
        />
      </div>

      <div>
        Duration
        <RateSlider
          value={showValues ? [state.duration] : undefined}
          max={0.5}
          min={MIN_RATE}
          defaultValue={[initialState.duration]}
          onValueChange={(value) =>
            handleValueChange(value, RateCriteriesEnum.DURATION)
          }
        />
      </div>

      {(BOTH_ON || VISUAL_EFFECTS_ON) && (
        <div>
          Visual Effects
          <RateSlider
            value={showValues ? [state.visualEffects] : undefined}
            max={BOTH_ON ? 1 : 1.5}
            min={MIN_RATE}
            defaultValue={[initialState.visualEffects]}
            onValueChange={(value) =>
              handleValueChange(value, RateCriteriesEnum.VISUAL_EFFECTS)
            }
          />
        </div>
      )}

      {(BOTH_ON || SCARE_FACTOR_ON) && (
        <div>
          Scare Factor
          <RateSlider
            value={showValues ? [state.scareFactor] : undefined}
            max={BOTH_ON ? 1.75 : 3}
            min={MIN_RATE}
            defaultValue={[initialState.scareFactor]}
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
