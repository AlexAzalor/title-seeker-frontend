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
  SpecificationOut,
} from "@/orval_api/model";
import { GenreFieldsForm } from "./genre-fields-form";
import { FeaturesForm } from "./features-form";
import { Preview } from "./preview";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addNewMovie } from "@/app/actions";

export const MovieFormContext = createContext<{
  movieFormData: BodyAPICreateMovie;
  setMovieFormData: Dispatch<SetStateAction<BodyAPICreateMovie>>;
  handleNext: () => void;
  handlePrev: () => void;
}>({
  movieFormData: {} as BodyAPICreateMovie,
  setMovieFormData: () => {},
  handleNext: () => {},
  handlePrev: () => {},
});

type Props = {
  actors: ActorOut[];
  directors: DirectorOut[];
  genres: GenreOut[];

  specifications: SpecificationOut[];
  keywords: KeywordOut[];
  actionTimes: ActionTimeOut[];
  temporaryMovie?: MoviePreCreateDataTemporaryMovie;
};

export const MovieFormWizard = ({
  actors,
  directors,
  genres,
  specifications,
  keywords,
  actionTimes,
  temporaryMovie,
}: Props) => {
  const [movieFormData, setMovieFormData] = useState<BodyAPICreateMovie>({
    form_data: {} as MovieFormData,
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log(
    "%c === MOVIE FORM DATA === ",
    "color: black; background-color: coral; font-weight: 700",
    movieFormData,
  );

  const handleNext = () => {
    // updateFormData(stepData);
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
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
      setIsSubmitting(false);
      return;
    }

    // Save data to local storage
    // localStorage.setItem("newMovieData", JSON.stringify(form_data));

    const response = await addNewMovie(
      {
        form_data,
        file,
      },
      !!temporaryMovie,
    );

    // To separate func error handling
    if (response.status === 201) {
      toast.success(response?.message);
      localStorage.removeItem("new-movie-data");
    }

    if (response.status === 400) {
      toast.error(response?.message);
      setIsSubmitting(false);

      throw new Error(response?.message);
    }

    if (response.status === 409) {
      toast.error(response?.message);
      setIsSubmitting(false);

      throw new Error(response?.message);
    }

    if (response.status === 422) {
      toast.error("Validation error");
      setIsSubmitting(false);

      throw new Error("Validation error");
    }
    setIsSubmitting(false);
  };

  return (
    <MovieFormContext
      value={{ movieFormData, setMovieFormData, handleNext, handlePrev }}
    >
      <div>wizard steps</div>
      <progress id="file" max="6" value={currentStep}>
        70%
      </progress>

      {currentStep === 1 && <KeyFieldsForm temporaryMovie={temporaryMovie} />}
      {currentStep === 2 && <InfoFieldsForm />}
      {currentStep === 3 && (
        <PeopleFieldsForm actors={actors} directors={directors} />
      )}
      {currentStep === 4 && <GenreFieldsForm genres={genres} />}
      {currentStep === 5 && (
        <FeaturesForm
          specifications={specifications}
          keywords={keywords}
          actionTimes={actionTimes}
        />
      )}
      {currentStep === 6 && movieFormData && movieFormData.form_data.key && (
        <Preview
          movieFormData={movieFormData.form_data}
          file={movieFormData.file as File}
        />
      )}

      {currentStep === 6 && (
        <div>
          {!isSubmitting ? (
            <Button onClick={addMovie}>Submit data</Button>
          ) : (
            <div>Spinner</div>
          )}
        </div>
      )}
    </MovieFormContext>
  );
};
