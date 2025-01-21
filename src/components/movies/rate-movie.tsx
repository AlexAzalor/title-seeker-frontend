"use client";

import { RefObject, useCallback, useMemo, useState } from "react";

import {
  MovieFormData,
  MovieOutUserRating,
  MoviePreCreateDataTemporaryMovie,
  RatingCriterion,
  UserRateMovieIn,
  UserRatingCriteria,
} from "@/orval_api/model";
import { toast } from "sonner";
import {
  AC_INITIAL_RATE,
  AC_MAX,
  checkRatingChanges,
  getMaxValue,
  H_INITIAL_RATE,
  HUMOR_MAX,
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
  const isHumor = ratingCriteria === RatingCriterion.humor;
  const isAnimationCartoon =
    ratingCriteria === RatingCriterion.animation_cartoon;

  const [states, setStates] = useState<UserRatingCriteria>(
    movieRateData ||
      temporaryMovie?.rating_criteria ||
      parsedData?.rating_criteria ||
      INITIAL_RATE,
  );

  const {
    acting,
    plot_storyline,
    script_dialogue,
    music,
    enjoyment,
    production_design,
    visual_effects,
    scare_factor,
    humor,
    animation_cartoon,
  } = states;

  const updateState = (value: number[], key: keyof UserRatingCriteria) => {
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
      isHumor,
      isAnimationCartoon,
    );
  }, [
    states,
    temporaryMovie?.rating_criteria,
    parsedData?.rating_criteria,
    isVisualEffects,
    isScareFactor,
    isHumor,
    isAnimationCartoon,
  ]);

  const handleRateMovie = async () => {
    if (determineRatingChanges()) {
      toast.warning("No changes to save");
      return;
    }

    if (onRateSubmit && movieKey) {
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

  const {
    actingMax,
    musicMax,
    plotStorylineMax,
    productionDesignMax,
    scriptDialogueMax,
  } = useMemo(() => {
    const actingMax = getMaxValue(
      isVisualEffects,
      isScareFactor,
      isHumor,
      isAnimationCartoon,
      VS_MAX.acting,
      SF_MAX.acting,
      HUMOR_MAX.acting,
      AC_MAX.acting,
      RATING_MAX.acting,
    );

    const plotStorylineMax = getMaxValue(
      isVisualEffects,
      isScareFactor,
      isHumor,
      isAnimationCartoon,
      VS_MAX.plot_storyline,
      SF_MAX.plot_storyline,
      HUMOR_MAX.plot_storyline,
      AC_MAX.plot_storyline,
      RATING_MAX.plot_storyline,
    );

    const scriptDialogueMax = getMaxValue(
      isVisualEffects,
      isScareFactor,
      isHumor,
      isAnimationCartoon,
      VS_MAX.script_dialogue,
      SF_MAX.script_dialogue,
      HUMOR_MAX.script_dialogue,
      AC_MAX.script_dialogue,
      RATING_MAX.script_dialogue,
    );

    const productionDesignMax = getMaxValue(
      isVisualEffects,
      isScareFactor,
      isHumor,
      isAnimationCartoon,
      VS_MAX.production_design,
      SF_MAX.production_design,
      HUMOR_MAX.production_design,
      AC_MAX.production_design,
      RATING_MAX.production_design,
    );

    const musicMax = getMaxValue(
      isVisualEffects,
      isScareFactor,
      isHumor,
      isAnimationCartoon,
      VS_MAX.music,
      SF_MAX.music,
      HUMOR_MAX.music,
      AC_MAX.music,
      RATING_MAX.music,
    );

    return {
      actingMax,
      plotStorylineMax,
      scriptDialogueMax,
      productionDesignMax,
      musicMax,
    };
  }, [isAnimationCartoon, isHumor, isScareFactor, isVisualEffects]);

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
    if (value === RatingCriterion.humor) {
      setStates(H_INITIAL_RATE);
      return;
    }
    if (value === RatingCriterion.animation_cartoon) {
      setStates(AC_INITIAL_RATE);
      return;
    }
  };

  return (
    <div className="w-[594px] py-6">
      {!onRateSubmit && !movieKey && (
        <RatingTypeSelector
          onValueChange={handleSelectRatingType}
          defaultValue={ratingCriteria}
        />
      )}

      <RateSlider
        title="Acting"
        value={acting}
        showValue={showValues}
        max={actingMax}
        defaultValue={acting}
        onValueChange={(value) => updateState(value, "acting")}
      />

      <RateSlider
        title="Plot/Storyline"
        value={plot_storyline}
        max={plotStorylineMax}
        showValue={showValues}
        defaultValue={plot_storyline}
        onValueChange={(value) => updateState(value, "plot_storyline")}
      />

      <RateSlider
        title="Script/Dialogue"
        value={script_dialogue}
        max={scriptDialogueMax}
        defaultValue={script_dialogue}
        onValueChange={(value) => updateState(value, "script_dialogue")}
        showValue={showValues}
      />

      <RateSlider
        title="Music"
        value={music}
        max={musicMax}
        showValue={showValues}
        defaultValue={music}
        onValueChange={(value) => updateState(value, "music")}
      />

      <RateSlider
        title="Enjoyment"
        value={enjoyment}
        max={RATING_MAX.enjoyment}
        showValue={showValues}
        defaultValue={enjoyment}
        onValueChange={(value) => updateState(value, "enjoyment")}
      />

      <RateSlider
        title="Production Design"
        value={production_design}
        max={productionDesignMax}
        defaultValue={production_design}
        onValueChange={(value) => updateState(value, "production_design")}
        showValue={showValues}
      />

      {!!visual_effects && (
        <RateSlider
          title="Visual Effects"
          value={visual_effects || 0}
          max={RATING_MAX.visual_effects}
          defaultValue={visual_effects}
          onValueChange={(value) => updateState(value, "visual_effects")}
          showValue={showValues}
        />
      )}

      {!!scare_factor && (
        <RateSlider
          title="Scare Factor"
          value={scare_factor || 0}
          max={RATING_MAX.scare_factor}
          defaultValue={scare_factor}
          onValueChange={(value) => updateState(value, "scare_factor")}
          showValue={showValues}
        />
      )}

      {!!humor && (
        <RateSlider
          title="Humor"
          value={humor || 0}
          max={RATING_MAX.humor}
          defaultValue={humor}
          onValueChange={(value) => updateState(value, "humor")}
          showValue={showValues}
        />
      )}

      {!!animation_cartoon && (
        <RateSlider
          title="Animation/Cartoon"
          value={animation_cartoon || 0}
          max={RATING_MAX.animation_cartoon}
          defaultValue={animation_cartoon}
          onValueChange={(value) => updateState(value, "animation_cartoon")}
          showValue={showValues}
        />
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
