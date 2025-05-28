import { BodyAPICreateMovie } from "@/orval_api/model";
import { createContext, Dispatch, SetStateAction } from "react";

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

export const FIRST_STEP = 1;
export const VISUAL_PROFILE_STEP = 2; // Alias for the first step
/**Shared Universe */
export const SU_STEP = 3;
/**Related Movie */
export const RM_STEP = 4;
export const INFO_STEP = 5;
export const PEOPLE_STEP = 6;
export const GENRES_STEP = 7;
export const LAST_STEP = 8;
export const SUMMARY_STEP = 9;
