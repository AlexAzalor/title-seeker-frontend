import { CheckIcon, SummaryIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  step: number;
  comletedSteps: number[];
  goToStep: () => void;
  lastStep?: boolean;
  currentStep: number;
};

export const FormStep = ({
  title,
  step,
  comletedSteps,
  goToStep,
  lastStep,
  currentStep,
}: Props) => {
  const last = 6;
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
            if (
              comletedSteps.includes(step) ||
              (comletedSteps.includes(5) && step === last) ||
              Math.max(...comletedSteps) + 1 === step
            ) {
              goToStep();
            }
          }}
          className={cn(
            "grid h-8 w-8 place-content-center rounded-full",
            comletedSteps.includes(step) || comletedSteps.length === 5
              ? "cursor-pointer bg-[#4A3AFF] dark:bg-[#495AFF]"
              : "select-none bg-[#EFF0F6] text-[#6F6C90]",
            comletedSteps.length &&
              Math.max(...comletedSteps) + 1 === step &&
              "cursor-pointer border-4 dark:border-[#495AFF]",
            comletedSteps.length === 0 &&
              step === 1 &&
              "cursor-pointer border-4 dark:border-[#495AFF]",
          )}
        >
          <div>
            {step === last ? (
              <SummaryIcon color={comletedSteps.length >= 5} />
            ) : comletedSteps.includes(step) ? (
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
              comletedSteps.includes(step) &&
                "animate-progress bg-[#4A3AFF] dark:bg-[#495AFF]",
            )}
          ></div>
        </div>
      )}
    </>
  );
};
