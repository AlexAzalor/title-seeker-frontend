import { use } from "react";
import { useTranslations } from "next-intl";
import { FormStep } from "@/components/my-custom-ui/form-ui-parts/form-step";
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
  VISUAL_PROFILE_STEP,
} from "@/components/movie/add-movie/utils";

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
  const t = useTranslations("Form.stepper");
  const { stepsSkipped } = use(MovieFormContext);

  return (
    <div className="mx-5 flex items-center justify-center gap-4">
      <FormStep
        title={t("titleRate.name")}
        step={FIRST_STEP}
        completedSteps={completedSteps}
        goToStep={() => onStepChange(FIRST_STEP)}
        currentStep={currentStep}
      />
      <FormStep
        title={t("visualProfile.name")}
        step={VISUAL_PROFILE_STEP}
        completedSteps={completedSteps}
        goToStep={() => onStepChange(VISUAL_PROFILE_STEP)}
        currentStep={currentStep}
      />
      <FormStep
        title={t("sharedUniverse.name")}
        step={SU_STEP}
        completedSteps={completedSteps}
        goToStep={() => onStepChange(SU_STEP)}
        currentStep={currentStep}
        isStepSkipped={stepsSkipped?.includes(SU_STEP)}
      />
      <FormStep
        title={t("relatedMovie.name")}
        step={RM_STEP}
        completedSteps={completedSteps}
        goToStep={() => onStepChange(RM_STEP)}
        currentStep={currentStep}
        isStepSkipped={stepsSkipped?.includes(RM_STEP)}
      />

      <FormStep
        step={INFO_STEP}
        title={t("info.name")}
        completedSteps={completedSteps}
        goToStep={() => onStepChange(INFO_STEP)}
        currentStep={currentStep}
      />

      <FormStep
        step={PEOPLE_STEP}
        title={t("people.name")}
        completedSteps={completedSteps}
        goToStep={() => onStepChange(PEOPLE_STEP)}
        currentStep={currentStep}
      />

      <FormStep
        step={GENRES_STEP}
        title={t("genres.name")}
        completedSteps={completedSteps}
        goToStep={() => onStepChange(GENRES_STEP)}
        currentStep={currentStep}
      />

      <FormStep
        step={LAST_STEP}
        title={t("filters.name")}
        completedSteps={completedSteps}
        goToStep={() => onStepChange(LAST_STEP)}
        currentStep={currentStep}
      />

      <FormStep
        step={SUMMARY_STEP}
        title={t("summary.name")}
        completedSteps={completedSteps}
        goToStep={() => onStepChange(SUMMARY_STEP)}
        currentStep={currentStep}
        lastStep
      />
    </div>
  );
};
