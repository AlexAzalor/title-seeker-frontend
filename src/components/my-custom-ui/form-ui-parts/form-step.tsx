import { DiamondMinus } from "lucide-react";
import { CheckIcon, SummaryIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import {
  FIRST_STEP,
  LAST_STEP,
  SUMMARY_STEP,
} from "@/components/movie/add-movie/utils";

type Props = {
  title: string;
  step: number;
  completedSteps: number[];
  goToStep: () => void;
  lastStep?: boolean;
  currentStep: number;
  isStepSkipped?: boolean;
};

export const FormStep = ({
  title,
  step,
  completedSteps,
  goToStep,
  lastStep,
  currentStep,
  isStepSkipped,
}: Props) => {
  const isLastStep = step === SUMMARY_STEP;
  const isStepCompleted = completedSteps.includes(step);
  const currentEditableStep = Math.max(...completedSteps) + 1 === step;
  const firstEditableStep = completedSteps.length === 0 && step === FIRST_STEP;

  const stepIcon = isLastStep ? (
    <SummaryIcon color={completedSteps.length >= LAST_STEP} />
  ) : isStepSkipped ? (
    <DiamondMinus className="dark:stroke-white" />
  ) : isStepCompleted ? (
    <CheckIcon />
  ) : (
    <p className="text-lg font-bold">{step}</p>
  );

  return (
    <>
      <div
        className={cn(
          "text-gray-purple dark:text-white-dark relative grid place-items-center",
          currentStep === step && "scale-150 transition-all duration-150",
        )}
      >
        <div
          onClick={() => {
            if (isStepCompleted || currentEditableStep) {
              goToStep();
            }
          }}
          className={cn(
            "text-gray-purple bg-white-dark grid h-8 w-8 place-content-center rounded-full select-none",
            (isStepCompleted || completedSteps.length === LAST_STEP) &&
              "bg-main-ui-purple dark:bg-form-ui-blue cursor-pointer",
            (currentEditableStep || firstEditableStep) &&
              "border-form-ui-blue cursor-pointer border-4",
            isStepSkipped && "border-2 bg-transparent dark:bg-transparent",
          )}
        >
          <div>{stepIcon}</div>
        </div>
        <p className="absolute top-full leading-7 whitespace-nowrap select-none">
          {title}
        </p>
      </div>

      {!lastStep && (
        <div className="bg-white-dark h-2 w-24 rounded-3xl">
          <div
            className={cn(
              "fill-mode-both grid h-2 w-24 place-content-center rounded-3xl",
              isStepCompleted &&
                "animate-progress bg-main-ui-purple dark:bg-form-ui-blue",
            )}
          ></div>
        </div>
      )}
    </>
  );
};
