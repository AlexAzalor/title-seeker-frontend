"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  FIRST_STEP,
  GENRES_STEP,
  INFO_STEP,
  LAST_STEP,
  MovieFormContext,
  PEOPLE_STEP,
  RM_STEP,
  SU_STEP,
  SUMMARY_STEP,
  VISUAL_PROFILE_STEP,
} from "@/components/movie/add-movie/utils";
import { errorHandling } from "@/lib/utils";

import { KeyFieldsForm } from "@/components/movie/add-movie/key-fields-form";
import { InfoFieldsForm } from "@/components/movie/add-movie/info-fields-form";
import { PeopleFieldsForm } from "@/components/movie/add-movie/people-fields-form";

import { Separator } from "@/components/ui/separator";
import { FormStepper } from "@/components/my-custom-ui/form-ui-parts/form-stepper";
import { FormButtons } from "@/components/my-custom-ui/form-ui-parts/form-buttons";
import { Spinner } from "@/components/my-custom-ui/spinner";

import { GenreFieldsForm } from "@/components/movie/add-movie/genre-fields-form";
import { FilterForm } from "@/components/movie/add-movie/filter-form";
import { Summary } from "@/components/movie/add-movie/summary";
import { RelatedMovieForm } from "@/components/movie/add-movie/related-movie-form";
import { SharedUniverseForm } from "@/components/movie/add-movie/shared-universe-form";
import { VisualProfileMovieForm } from "@/components/movie/add-movie/visual-profile-form";

import { createMovie } from "@/app/services/admin-api";
import type {
  FilterItemOut,
  PersonBase,
  BodyAPICreateMovie,
  CharacterOut,
  GenreOut,
  MovieFormData,
  MoviePreCreateDataQuickMovie,
  VisualProfileData,
  BaseSharedUniverse,
  MovieMenuItem,
} from "@/orval_api/model";

type Props = {
  visualProfileCategories: VisualProfileData[];
  actors: PersonBase[];
  directors: PersonBase[];
  genres: GenreOut[];

  specifications: FilterItemOut[];
  keywords: FilterItemOut[];
  actionTimes: FilterItemOut[];
  quickMovie?: MoviePreCreateDataQuickMovie;
  shared_universes: BaseSharedUniverse[];
  base_movies: MovieMenuItem[];
  characters: CharacterOut[];
};

export const MovieFormWizard = ({
  visualProfileCategories,
  actors,
  directors,
  genres,
  specifications,
  keywords,
  actionTimes,
  quickMovie,
  shared_universes,
  base_movies,
  characters,
}: Props) => {
  const t = useTranslations("Form");

  const [movieFormData, setMovieFormData] = useState<BodyAPICreateMovie>({
    form_data: {} as MovieFormData,
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [stepsSkipped, setSkipSteps] = useState<number[]>([]);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const endSubmitting = () => {
    setIsSubmitting(false);
  };

  const handleCurrentStep = (step: number) => {
    setCurrentStep(step);
  };

  const addMovie = async () => {
    setIsSubmitting(true);

    const { form_data, file } = movieFormData;

    if (!file) {
      toast.error("Poster is required");
      endSubmitting();
      return;
    }

    const response = await createMovie({ form_data, file }, !!quickMovie);

    errorHandling(response, endSubmitting);

    endSubmitting();

    // redirect to movie page
  };

  const clearForm = () => {
    localStorage.removeItem("new-movie-data");
    toast.success("Form cleared");

    window.location.reload();
  };

  return (
    <MovieFormContext
      value={{
        movieFormData,
        setMovieFormData,
        handleNext,
        handlePrev,
        clearForm,
        stepsSkipped,
        setSkipSteps,
      }}
    >
      <div
        aria-label="movie-form-wizard"
        className="shadow-form-layout dark:shadow-dark-form-layout dark:border-dark-border border-light-border mx-auto my-5 w-[1520px] rounded-[34px] border p-9"
      >
        <FormStepper
          completedSteps={completedSteps}
          currentStep={currentStep}
          onStepChange={handleCurrentStep}
        />

        <Separator className="my-12" />

        {currentStep === FIRST_STEP && (
          <KeyFieldsForm quickMovie={quickMovie} />
        )}
        {currentStep === VISUAL_PROFILE_STEP && (
          <VisualProfileMovieForm categories={visualProfileCategories} />
        )}
        {currentStep === SU_STEP && (
          <SharedUniverseForm sharedUniverses={shared_universes} />
        )}
        {currentStep === RM_STEP && (
          <RelatedMovieForm baseMovies={base_movies} />
        )}
        {currentStep === INFO_STEP && <InfoFieldsForm />}
        {currentStep === PEOPLE_STEP && (
          <PeopleFieldsForm
            actors={actors}
            directors={directors}
            characters={characters}
          />
        )}
        {currentStep === GENRES_STEP && <GenreFieldsForm genres={genres} />}
        {currentStep === LAST_STEP && (
          <FilterForm
            specifications={specifications}
            keywords={keywords}
            actionTimes={actionTimes}
          />
        )}
        {currentStep === SUMMARY_STEP &&
          movieFormData &&
          movieFormData.form_data.key && (
            <Summary
              movieFormData={movieFormData.form_data}
              file={movieFormData.file as File}
            />
          )}
        {currentStep === SUMMARY_STEP && (
          <FormButtons handlePrev={handlePrev} onSubmit={addMovie}>
            {!isSubmitting ? t("submit") : <Spinner />}
          </FormButtons>
        )}
      </div>
    </MovieFormContext>
  );
};
