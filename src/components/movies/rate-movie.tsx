"use client";

import { RefObject, useCallback, useState } from "react";

import {
  MovieFormData,
  MovieOutUserRating,
  MoviePreCreateDataTemporaryMovie,
  RatingCriterion,
  UserRateMovieIn,
} from "@/orval_api/model";
import { toast } from "sonner";
import {
  checkRatingChanges,
  FULL_INITIAL_RATE,
  FULL_MAX,
  getMaxValue,
  INITIAL_RATE,
  RATING_MAX,
  SF_INITIAL_RATE,
  SF_MAX,
  VE_INITIAL_RATE,
  VS_MAX,
} from "../rating/utils";
import { RateSlider } from "../rating/rate-slider";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { RatingTypeSelector } from "./ui/rating-type-selector";
import { RatingDataOut } from "./add-movie/key-fields-form";

type Props = {
  ratingRef: RefObject<RatingDataOut>;
  temporaryMovie?: MoviePreCreateDataTemporaryMovie;
  parsedData?: MovieFormData;
  movieRateData?: MovieOutUserRating;
  type?: RatingCriterion;
  onRateSubmit?: (data: UserRateMovieIn) => Promise<void>;
  movieKey?: string;
};

export const RateMovie = ({
  ratingRef,
  temporaryMovie,
  parsedData,
  movieRateData,
  type,
  onRateSubmit,
  movieKey,
}: Props) => {
  const [showValues, setShowValues] = useState(false);

  const [ratingCriteria, setRatingCriteria] = useState<RatingCriterion>(
    type ||
      temporaryMovie?.rating_criterion_type ||
      parsedData?.rating_criterion_type ||
      RatingCriterion.basic,
  );

  const isVisualEffects = ratingCriteria === RatingCriterion.visual_effects;
  const isScareFactor = ratingCriteria === RatingCriterion.scare_factor;
  const isFull = ratingCriteria === RatingCriterion.full;

  const [states, setStates] = useState(
    movieRateData ||
      temporaryMovie?.rating_criteria ||
      parsedData?.rating_criteria ||
      INITIAL_RATE,
  );

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
  } = states;

  const updateState = (value: number[], key: string) => {
    setStates((prev) => ({ ...prev, [key]: value[0] }));
  };

  const handleShowValues = (show: boolean) => {
    setShowValues(show);
  };

  const calculateRating = useCallback(() => {
    const ratingData: number[] = Object.values(states);

    const sumRate = ratingData.reduce(
      (sum, val) => Number(sum) + Number(val),
      0,
    );

    return Number(sumRate.toFixed(2));
  }, [states]);

  const determineRatingChanges = useCallback(() => {
    return checkRatingChanges(
      states,
      temporaryMovie?.rating_criteria || parsedData?.rating_criteria,
      isVisualEffects,
      isScareFactor,
      isFull,
    );
  }, [
    states,
    temporaryMovie,
    parsedData,
    isVisualEffects,
    isScareFactor,
    isFull,
  ]);

  const handleRateMovie = async () => {
    console.log("!!!!1!!!", onRateSubmit, movieKey);

    if (determineRatingChanges()) {
      toast.warning("No changes to save");
      return;
    }

    if (onRateSubmit && movieKey) {
      console.log("!!!!!!!");

      const data: UserRateMovieIn = {
        movie_key: movieKey,
        uuid: "some_uuid",
        rating: calculateRating(),
        rating_criteria: states,
      };
      await onRateSubmit(data);
    } else {
      const data: RatingDataOut = {
        rating: calculateRating(),
        ratingCriterionType: ratingCriteria,
        ratingData: states,
      };

      ratingRef.current = data;

      toast.info("Rating saved");
    }
  };

  const actingMax = getMaxValue(
    isFull,
    isVisualEffects,
    isScareFactor,
    FULL_MAX.acting,
    VS_MAX.acting,
    SF_MAX.acting,
    RATING_MAX.acting,
  );

  const plotStorylineMax = getMaxValue(
    isFull,
    isVisualEffects,
    isScareFactor,
    FULL_MAX.plot_storyline,
    VS_MAX.plot_storyline,
    SF_MAX.plot_storyline,
    RATING_MAX.plot_storyline,
  );

  const reWatchabilityMax = getMaxValue(
    isFull,
    false, // Visual Effects not applicable for re-watchability
    isScareFactor,
    FULL_MAX.re_watchability,
    null, // Not applicable for Visual Effects
    SF_MAX.re_watchability,
    RATING_MAX.re_watchability,
  );

  const handleSelectRatingType = (value: RatingCriterion) => {
    setRatingCriteria(value);

    if (value === RatingCriterion.basic) {
      setStates(INITIAL_RATE);
      return;
    }
    if (value === RatingCriterion.visual_effects) {
      setStates(VE_INITIAL_RATE);
      return;
    }
    if (value === RatingCriterion.scare_factor) {
      setStates(SF_INITIAL_RATE);
      return;
    }
    if (value === RatingCriterion.full) {
      setStates(FULL_INITIAL_RATE);
      return;
    }
  };

  return (
    <div className="w-[594px]">
      {!onRateSubmit && !movieKey && (
        <RatingTypeSelector
          onValueChange={handleSelectRatingType}
          defaultValue={ratingCriteria}
        />
      )}

      <div>
        Acting
        <RateSlider
          value={acting}
          showValue={showValues}
          max={actingMax}
          defaultValue={acting}
          onValueChange={(value) => updateState(value, "acting")}
        />
      </div>

      <div>
        Plot/Storyline
        <RateSlider
          value={plot_storyline}
          max={plotStorylineMax}
          showValue={showValues}
          defaultValue={plot_storyline}
          onValueChange={(value) => updateState(value, "plot_storyline")}
        />
      </div>

      <div>
        Music
        <RateSlider
          value={music}
          max={RATING_MAX.music}
          showValue={showValues}
          defaultValue={music}
          onValueChange={(value) => updateState(value, "music")}
        />
      </div>

      <div>
        Re-watchability
        <RateSlider
          value={re_watchability}
          max={reWatchabilityMax}
          defaultValue={re_watchability}
          onValueChange={(value) => updateState(value, "re_watchability")}
          showValue={showValues}
        />
      </div>

      <div>
        Emotional Impact
        <RateSlider
          value={emotional_impact}
          max={RATING_MAX.emotional_impact}
          defaultValue={emotional_impact}
          onValueChange={(value) => updateState(value, "emotional_impact")}
          showValue={showValues}
        />
      </div>

      <div>
        Dialogue
        <RateSlider
          value={dialogue}
          max={RATING_MAX.dialogue}
          defaultValue={dialogue}
          onValueChange={(value) => updateState(value, "dialogue")}
          showValue={showValues}
        />
      </div>

      <div>
        Production Design
        <RateSlider
          value={production_design}
          max={RATING_MAX.production_design}
          defaultValue={production_design}
          onValueChange={(value) => updateState(value, "production_design")}
          showValue={showValues}
        />
      </div>

      <div>
        Duration
        <RateSlider
          value={duration}
          max={RATING_MAX.duration}
          defaultValue={duration}
          onValueChange={(value) => updateState(value, "duration")}
          showValue={showValues}
        />
      </div>

      {!!visual_effects && (
        <div>
          Visual Effects
          <RateSlider
            value={visual_effects || 0}
            max={isFull ? FULL_MAX.visual_effects : RATING_MAX.visual_effects}
            defaultValue={visual_effects}
            onValueChange={(value) => updateState(value, "visual_effects")}
            showValue={showValues}
          />
        </div>
      )}

      {!!scare_factor && (
        <div className="">
          Scare Factor
          <RateSlider
            value={scare_factor || 0}
            max={isFull ? FULL_MAX.scare_factor : RATING_MAX.scare_factor}
            defaultValue={scare_factor}
            onValueChange={(value) => updateState(value, "scare_factor")}
            showValue={showValues}
          />
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch id="show-values" onCheckedChange={handleShowValues} />
          <Label htmlFor="show-values">Show values</Label>
        </div>

        {showValues && <div>Total: {calculateRating()}</div>}
      </div>

      <button
        type="button"
        className="mt-5 w-full rounded-2xl bg-[#4A3AFF] p-2 text-white transition-colors duration-200 hover:bg-[#342BBB]"
        onClick={handleRateMovie}
      >
        Save rating
      </button>
    </div>
  );
};
