"use client";

import { createContext, Dispatch, SetStateAction, useState } from "react";
import { KeyFieldsForm } from "./key-fields-form";
import { InfoFieldsForm } from "./info-fields-form";
import { PeopleFieldsForm } from "./people-fields-form";
import {
  ActionTimeOut,
  ActorOut,
  BodyAPICreateMovie,
  DirectorOut,
  GenreOut,
  KeywordOut,
  MovieFormData,
  MoviePreCreateDataTemporaryMovie,
  SharedUniversePreCreateOut,
  SpecificationOut,
} from "@/orval_api/model";
import { GenreFieldsForm } from "./genre-fields-form";
import { FeaturesForm } from "./features-form";
import { Preview } from "./preview";
import { toast } from "sonner";
import { addNewMovie } from "@/app/actions";
import { errorHandling } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { FormStepper } from "../ui/form-stepper";
import { FormButtons } from "../ui/form-buttons";
import { RelatedMovieForm } from "./related-movie-form";
import { SharedUniverseForm } from "./shared_universe";

export const MovieFormContext = createContext<{
  movieFormData: BodyAPICreateMovie;
  setMovieFormData: Dispatch<SetStateAction<BodyAPICreateMovie>>;
  handleNext: () => void;
  handlePrev: () => void;
  clearForm?: () => void;
  stepsSkipped?: number[];
  setSkipSteps?: Dispatch<SetStateAction<number[]>>;
}>({
  movieFormData: {} as BodyAPICreateMovie,
  setMovieFormData: () => {},
  handleNext: () => {},
  handlePrev: () => {},
  clearForm: () => {},
  stepsSkipped: [],
  setSkipSteps: () => {},
});

type Props = {
  actors: ActorOut[];
  directors: DirectorOut[];
  genres: GenreOut[];

  specifications: SpecificationOut[];
  keywords: KeywordOut[];
  actionTimes: ActionTimeOut[];
  temporaryMovie?: MoviePreCreateDataTemporaryMovie;
  shared_universes: SharedUniversePreCreateOut[];
};

export const MovieFormWizard = ({
  actors,
  directors,
  genres,
  specifications,
  keywords,
  actionTimes,
  temporaryMovie,
  shared_universes,
}: Props) => {
  const [movieFormData, setMovieFormData] = useState<BodyAPICreateMovie>({
    form_data: {} as MovieFormData,
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [stepsSkipped, setSkipSteps] = useState<number[]>([]);

  console.log(
    "%c === MOVIE FORM DATA === ",
    "color: black; background-color: coral; font-weight: 700",
    movieFormData,
  );

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

    console.log(
      "%c DATA TO API: ",
      "color: black; background-color: lightBlue; font-weight: 700",
      movieFormData,
    );

    const { form_data, file } = movieFormData;

    if (!file) {
      toast.error("Poster is required");
      endSubmitting();
      return;
    }

    const response = await addNewMovie({ form_data, file }, !!temporaryMovie);

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
      <div className="shadow-form-layout dark:shadow-dark-form-layout mx-auto my-5 w-[1400px] rounded-[34px] border border-[#EFF0F7] p-9 dark:border-[#211979]">
        <FormStepper
          completedSteps={completedSteps}
          currentStep={currentStep}
          onStepChange={handleCurrentStep}
        />

        <Separator className="my-12" />

        {currentStep === 1 && <KeyFieldsForm temporaryMovie={temporaryMovie} />}
        {currentStep === 2 && (
          <SharedUniverseForm shared_universes={shared_universes} />
        )}
        {currentStep === 3 && <RelatedMovieForm />}
        {currentStep === 4 && <InfoFieldsForm />}
        {currentStep === 5 && (
          <PeopleFieldsForm actors={actors} directors={directors} />
        )}
        {currentStep === 6 && <GenreFieldsForm genres={genres} />}
        {currentStep === 7 && (
          <FeaturesForm
            specifications={specifications}
            keywords={keywords}
            actionTimes={actionTimes}
          />
        )}
        {currentStep === 8 && movieFormData && movieFormData.form_data.key && (
          <Preview
            movieFormData={movieFormData.form_data}
            file={movieFormData.file as File}
          />
        )}
        {currentStep === 8 && (
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

        {/* <Button variant="link" onClick={clearForm} className="mx-auto">
        Clear form
      </Button> */}
      </div>
    </MovieFormContext>
  );
};
