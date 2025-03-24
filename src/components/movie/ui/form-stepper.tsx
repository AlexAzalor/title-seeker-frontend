import { use } from "react";
import { FormStep } from "./form-step";
import { MovieFormContext } from "../add-movie/movie-form-wizard";

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
        step={1}
        completedSteps={completedSteps}
        goToStep={() => onStepChange(1)}
        currentStep={currentStep}
      />
      <FormStep
        title="Shared Universe"
        step={2}
        completedSteps={completedSteps}
        goToStep={() => onStepChange(2)}
        currentStep={currentStep}
        isStepSkipped={stepsSkipped?.includes(2)}
      />
      <FormStep
        title="Related Movie"
        step={3}
        completedSteps={completedSteps}
        goToStep={() => onStepChange(3)}
        currentStep={currentStep}
        isStepSkipped={stepsSkipped?.includes(3)}
      />

      <FormStep
        step={4}
        title="Info"
        completedSteps={completedSteps}
        goToStep={() => onStepChange(4)}
        currentStep={currentStep}
      />

      <FormStep
        step={5}
        title="People"
        completedSteps={completedSteps}
        goToStep={() => onStepChange(5)}
        currentStep={currentStep}
      />

      <FormStep
        step={6}
        title="Genres"
        completedSteps={completedSteps}
        goToStep={() => onStepChange(6)}
        currentStep={currentStep}
      />

      <FormStep
        step={7}
        title="Features"
        completedSteps={completedSteps}
        goToStep={() => onStepChange(7)}
        currentStep={currentStep}
      />

      <FormStep
        step={8}
        title="Summary"
        completedSteps={completedSteps}
        goToStep={() => onStepChange(8)}
        currentStep={currentStep}
        lastStep
      />
    </div>
  );
};
