"use client";

import { RefObject, useReducer, useState } from "react";

import {
  MovieOutUserRating,
  RatingCriterion,
  UserRatingCriteria,
} from "@/orval_api/model";
import { toast } from "sonner";
import {
  assertNever,
  checkRatingChanges,
  FULL_MAX,
  getRatingCriteriaState,
  RateCriteriesEnum,
  RATING_MAX,
  SF_MAX,
  updateRateReducer,
  VS_MAX,
} from "../rating/utils";
import { RateSlider } from "../rating/rate-slider";
// const VISUAL_EFFECTS_ON = false;
// const SCARE_FACTOR_ON = false;
// const BOTH_ON = VISUAL_EFFECTS_ON && SCARE_FACTOR_ON;
const MIN_RATE = 0.01;
const SHOW_RATE_VALUES = false;
// const SUBSTRACT_RATE = 0.5;

type Props = {
  // movieKey: string;
  ratingCriteria?: MovieOutUserRating;
  criteriaType: RatingCriterion;
  /**Only to save state */
  ratingRef: RefObject<UserRatingCriteria>;
};

export const RateMovie = ({
  criteriaType,
  ratingCriteria,
  ratingRef,
}: Props) => {
  const [showValues, setShowValues] = useState(SHOW_RATE_VALUES);
  // const [ratingState, setRatingState] = useOptimistic(0);
  // const [isPending, startTransition] = useTransition();

  // useActionState();
  // useOptimistic();

  const isVisualEffects = criteriaType === RatingCriterion.visual_effects;
  const isScareFactor = criteriaType === RatingCriterion.scare_factor;
  const isFull = criteriaType === RatingCriterion.full;

  const ratingCriteriaState = getRatingCriteriaState(
    isVisualEffects,
    isScareFactor,
    isFull,
    ratingCriteria,
  );

  const [state, dispatch] = useReducer(updateRateReducer, ratingCriteriaState);
  const {
    acting,
    plot_storyline,
    music,
    re_watchability,
    emotional_impact,
    dialogue,
    production_design,
    duration,
    visual_effects,
    scare_factor,
  } = state;

  const updateCriterionValue = (value: number[], type: RateCriteriesEnum) => {
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
        assertNever(type);
    }
  };

  const handleShowValues = () => {
    setShowValues((prev) => !prev);
  };

  const calculateRating = () => {
    let sumRate =
      acting +
      plot_storyline +
      music +
      re_watchability +
      emotional_impact +
      dialogue +
      production_design +
      duration;

    if (isVisualEffects && visual_effects) {
      sumRate += visual_effects;
    }

    if (isScareFactor && scare_factor) {
      sumRate += scare_factor;
    }

    if (isFull && visual_effects && scare_factor) {
      sumRate += visual_effects + scare_factor;
    }

    return Number(sumRate.toFixed(2));
  };

  const handleRateMovie = async () => {
    if (
      checkRatingChanges(
        state,
        ratingCriteria,
        isVisualEffects,
        isScareFactor,
        isFull,
      )
    ) {
      toast.error("No changes to save");
      return;
    }

    const data: UserRatingCriteria & { rating: number } = {
      rating: calculateRating(),
      ...state,
    };

    ratingRef.current = data;

    toast.info("Rating saved");
  };

  const actingMax = isFull
    ? FULL_MAX.acting
    : isVisualEffects
      ? VS_MAX.acting
      : isScareFactor
        ? SF_MAX.acting
        : RATING_MAX.acting;
  const plotStorylineMax = isFull
    ? FULL_MAX.plot_storyline
    : isVisualEffects
      ? VS_MAX.plot_storyline
      : isScareFactor
        ? SF_MAX.plot_storyline
        : RATING_MAX.plot_storyline;
  const reWathcabilityMax = isFull
    ? FULL_MAX.re_watchability
    : isScareFactor
      ? SF_MAX.re_watchability
      : RATING_MAX.re_watchability;

  return (
    <div className="w-[500px]">
      <h1>Rate: {calculateRating()}</h1>
      {/* <h1>Optimistic: {ratingState}</h1>
      {isPending && <div>...pending...</div>} */}
      {/* add tooltip or warning text or smth or modal? */}
      <button
        type="button"
        className="rounded-md bg-red-300 p-1"
        onClick={handleShowValues}
      >
        Show values
      </button>
      <div>
        Acting
        <RateSlider
          value={showValues ? [acting] : undefined}
          max={actingMax}
          min={MIN_RATE}
          // className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
          defaultValue={[ratingCriteriaState.acting]}
          onValueChange={(value) => updateCriterionValue(value, "acting")}
        />
      </div>
      <div>
        Plot/Storyline
        <RateSlider
          value={showValues ? [plot_storyline] : undefined}
          max={plotStorylineMax}
          min={MIN_RATE}
          defaultValue={[ratingCriteriaState.plot_storyline]}
          onValueChange={(value) =>
            updateCriterionValue(value, "plot_storyline")
          }
        />
      </div>
      <div>
        Music
        <RateSlider
          value={showValues ? [music] : undefined}
          max={RATING_MAX.music}
          min={MIN_RATE}
          defaultValue={[ratingCriteriaState.music]}
          onValueChange={(value) => updateCriterionValue(value, "music")}
        />
      </div>
      <div>
        Re-watchability
        <RateSlider
          value={showValues ? [re_watchability] : undefined}
          max={reWathcabilityMax}
          min={MIN_RATE}
          defaultValue={[ratingCriteriaState.re_watchability]}
          onValueChange={(value) =>
            updateCriterionValue(value, "re_watchability")
          }
        />
      </div>
      <div>
        Emotional Impact
        <RateSlider
          value={showValues ? [emotional_impact] : undefined}
          max={RATING_MAX.emotional_impact}
          min={MIN_RATE}
          defaultValue={[ratingCriteriaState.emotional_impact]}
          onValueChange={(value) =>
            updateCriterionValue(value, "emotional_impact")
          }
        />
      </div>
      <div>
        Dialogue
        <RateSlider
          value={showValues ? [dialogue] : undefined}
          max={RATING_MAX.dialogue}
          min={MIN_RATE}
          defaultValue={[ratingCriteriaState.dialogue]}
          onValueChange={(value) => updateCriterionValue(value, "dialogue")}
        />
      </div>
      <div>
        Production Design
        <RateSlider
          value={showValues ? [production_design] : undefined}
          max={RATING_MAX.production_design}
          min={MIN_RATE}
          defaultValue={[ratingCriteriaState.production_design]}
          onValueChange={(value) =>
            updateCriterionValue(value, "production_design")
          }
        />
      </div>

      <div>
        Duration
        <RateSlider
          value={showValues ? [duration] : undefined}
          max={RATING_MAX.duration}
          min={MIN_RATE}
          defaultValue={[ratingCriteriaState.duration]}
          onValueChange={(value) => updateCriterionValue(value, "duration")}
        />
      </div>

      {!!ratingCriteriaState.visual_effects && (
        <div>
          Visual Effects
          <RateSlider
            value={showValues ? [visual_effects || 0] : undefined}
            max={isFull ? FULL_MAX.visual_effects : RATING_MAX.visual_effects}
            min={MIN_RATE}
            defaultValue={[ratingCriteriaState.visual_effects]}
            onValueChange={(value) =>
              updateCriterionValue(value, "visual_effects")
            }
          />
        </div>
      )}

      {!!ratingCriteriaState.scare_factor && (
        <div>
          Scare Factor
          <RateSlider
            value={showValues ? [scare_factor || 0] : undefined}
            max={isFull ? FULL_MAX.scare_factor : RATING_MAX.scare_factor}
            min={MIN_RATE}
            defaultValue={[ratingCriteriaState.scare_factor]}
            onValueChange={(value) =>
              updateCriterionValue(value, "scare_factor")
            }
          />
        </div>
      )}

      <button
        type="button"
        className="mt-5 bg-orange-400 p-2"
        onClick={handleRateMovie}
      >
        Save rating
      </button>
    </div>
  );
};
