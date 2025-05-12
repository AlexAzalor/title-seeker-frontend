"use client";

import { useState } from "react";
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
} from "./utils";
import { errorHandling } from "@/lib/utils";
import { createMovie } from "@/app/services/admin-api";
import { KeyFieldsForm } from "./key-fields-form";
import { InfoFieldsForm } from "./info-fields-form";
import { PeopleFieldsForm } from "./people-fields-form";
import {
  FilterItemOut,
  ActorOut,
  BodyAPICreateMovie,
  CharacterOut,
  DirectorOut,
  GenreOut,
  MovieFormData,
  MovieOutShort,
  MoviePreCreateDataQuickMovie,
  SharedUniversePreCreateOut,
} from "@/orval_api/model";
import { GenreFieldsForm } from "./genre-fields-form";
import { MovieFilterForm } from "./movie-filter-form";
import { Summary } from "./summary";
import { Separator } from "@/components/ui/separator";
import { FormStepper } from "@/components/my-custom-ui/form-ui-parts/form-stepper";
import { FormButtons } from "@/components/my-custom-ui/form-ui-parts/form-buttons";
import { RelatedMovieForm } from "./related-movie-form";
import { SharedUniverseForm } from "./shared-universe-form";

type Props = {
  actors: ActorOut[];
  directors: DirectorOut[];
  genres: GenreOut[];

  specifications: FilterItemOut[];
  keywords: FilterItemOut[];
  actionTimes: FilterItemOut[];
  quickMovie?: MoviePreCreateDataQuickMovie;
  shared_universes: SharedUniversePreCreateOut[];
  base_movies: MovieOutShort[];
  characters: CharacterOut[];
};

export const MovieFormWizard = ({
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
        className="shadow-form-layout dark:shadow-dark-form-layout mx-auto my-5 w-[1400px] rounded-[34px] border border-[#EFF0F7] p-9 dark:border-[#211979]"
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
          <MovieFilterForm
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
          <div>
            {!isSubmitting ? (
              <FormButtons
                title="Submit"
                handlePrev={handlePrev}
                onSubmit={addMovie}
              />
            ) : (
              <span className="loader"></span>
            )}
          </div>
        )}
      </div>
    </MovieFormContext>
  );
};
