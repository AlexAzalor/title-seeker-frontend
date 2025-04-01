import { CheckIcon, SummaryIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { DiamondMinus } from "lucide-react";

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
  const summaryStep = 8;
  const lastFormStep = 7;
  const isLastStep = step === summaryStep;
  const isStepCompleted = completedSteps.includes(step);
  const currentEditableStep = Math.max(...completedSteps) + 1 === step;
  const firstEditableStep = completedSteps.length === 0 && step === 1;

  const stepIcon = isLastStep ? (
    <SummaryIcon color={completedSteps.length >= lastFormStep} />
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
          "relative grid place-items-center text-[#6F6C90] dark:text-[#EFF0F6]",
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
            "grid h-8 w-8 place-content-center rounded-full bg-[#EFF0F6] text-[#6F6C90] select-none",
            (isStepCompleted || completedSteps.length === lastFormStep) &&
              "cursor-pointer bg-[#4A3AFF] dark:bg-[#495AFF]",
            (currentEditableStep || firstEditableStep) &&
              "cursor-pointer border-4 border-[#495AFF]",
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
        <div className="h-2 w-24 rounded-3xl bg-[#EFF0F6]">
          <div
            className={cn(
              "fill-mode-both grid h-2 w-24 place-content-center rounded-3xl",
              isStepCompleted &&
                "animate-progress bg-[#4A3AFF] dark:bg-[#495AFF]",
            )}
          ></div>
        </div>
      )}
    </>
  );
};
