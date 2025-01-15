import { CheckIcon, SummaryIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  step: number;
  completedSteps: number[];
  goToStep: () => void;
  lastStep?: boolean;
  currentStep: number;
};

export const FormStep = ({
  title,
  step,
  completedSteps,
  goToStep,
  lastStep,
  currentStep,
}: Props) => {
  const summaryStep = 6;
  const lastFormStep = 5;
  const isLastStep = step === summaryStep;
  const isStepCompleted = completedSteps.includes(step);
  const currentEditableStep = Math.max(...completedSteps) + 1 === step;
  const firstEditableStep = completedSteps.length === 0 && step === 1;

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
            "grid h-8 w-8 select-none place-content-center rounded-full bg-[#EFF0F6] text-[#6F6C90]",
            (isStepCompleted || completedSteps.length === lastFormStep) &&
              "cursor-pointer bg-[#4A3AFF] dark:bg-[#495AFF]",
            (currentEditableStep || firstEditableStep) &&
              "cursor-pointer border-4 dark:border-[#495AFF]",
          )}
        >
          <div>
            {isLastStep ? (
              <SummaryIcon color={completedSteps.length >= lastFormStep} />
            ) : isStepCompleted ? (
              <CheckIcon />
            ) : (
              <p className="text-lg font-bold">{step}</p>
            )}
          </div>
        </div>
        <p className="absolute top-full select-none whitespace-nowrap leading-7">
          {title}
        </p>
      </div>

      {!lastStep && (
        <div className="h-2 w-24 rounded-3xl bg-[#EFF0F6]">
          <div
            className={cn(
              "grid h-2 w-24 place-content-center rounded-3xl fill-mode-both",
              isStepCompleted &&
                "animate-progress bg-[#4A3AFF] dark:bg-[#495AFF]",
            )}
          ></div>
        </div>
      )}
    </>
  );
};
