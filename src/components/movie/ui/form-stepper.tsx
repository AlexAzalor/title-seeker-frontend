import { use } from "react";
import { FormStep } from "./form-step";
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
} from "../add-movie/utils";

type Props = {
  onStepChange: (step: number) => void;
  currentStep: number;
  completedSteps: number[];
};

export const FormStepper = ({
  completedSteps,
  currentStep,
  onStepChange,
}: Props) => {
  const { stepsSkipped } = use(MovieFormContext);

  return (
    <div className="mx-5 flex items-center justify-center gap-4">
      <FormStep
        title="Title/Rate"
        step={FIRST_STEP}
        completedSteps={completedSteps}
        goToStep={() => onStepChange(FIRST_STEP)}
        currentStep={currentStep}
      />
      <FormStep
        title="Shared Universe"
        step={SU_STEP}
        completedSteps={completedSteps}
        goToStep={() => onStepChange(SU_STEP)}
        currentStep={currentStep}
        isStepSkipped={stepsSkipped?.includes(SU_STEP)}
      />
      <FormStep
        title="Related Movie"
        step={RM_STEP}
        completedSteps={completedSteps}
        goToStep={() => onStepChange(RM_STEP)}
        currentStep={currentStep}
        isStepSkipped={stepsSkipped?.includes(RM_STEP)}
      />

      <FormStep
        step={INFO_STEP}
        title="Info"
        completedSteps={completedSteps}
        goToStep={() => onStepChange(INFO_STEP)}
        currentStep={currentStep}
      />

      <FormStep
        step={PEOPLE_STEP}
        title="People"
        completedSteps={completedSteps}
        goToStep={() => onStepChange(PEOPLE_STEP)}
        currentStep={currentStep}
      />

      <FormStep
        step={GENRES_STEP}
        title="Genres"
        completedSteps={completedSteps}
        goToStep={() => onStepChange(GENRES_STEP)}
        currentStep={currentStep}
      />

      <FormStep
        step={LAST_STEP}
        title="Features"
        completedSteps={completedSteps}
        goToStep={() => onStepChange(LAST_STEP)}
        currentStep={currentStep}
      />

      <FormStep
        step={SUMMARY_STEP}
        title="Summary"
        completedSteps={completedSteps}
        goToStep={() => onStepChange(SUMMARY_STEP)}
        currentStep={currentStep}
        lastStep
      />
    </div>
  );
};
