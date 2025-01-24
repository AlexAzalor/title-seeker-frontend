import { FormStep } from "./form-step";

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
        step={2}
        title="Info"
        completedSteps={completedSteps}
        goToStep={() => onStepChange(2)}
        currentStep={currentStep}
      />

      <FormStep
        step={3}
        title="People"
        completedSteps={completedSteps}
        goToStep={() => onStepChange(3)}
        currentStep={currentStep}
      />

      <FormStep
        step={4}
        title="Genres"
        completedSteps={completedSteps}
        goToStep={() => onStepChange(4)}
        currentStep={currentStep}
      />

      <FormStep
        step={5}
        title="Features"
        completedSteps={completedSteps}
        goToStep={() => onStepChange(5)}
        currentStep={currentStep}
      />

      <FormStep
        step={6}
        title="Summary"
        completedSteps={completedSteps}
        goToStep={() => onStepChange(6)}
        currentStep={currentStep}
        lastStep
      />
    </div>
  );
};
