import { memo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  children?: React.ReactNode;
  handlePrev?: () => void;
  isFirstStep?: boolean;
  onSubmit?: () => void;
  skipStep?: () => void;
};

const FormButtons = ({
  children,
  handlePrev,
  isFirstStep,
  onSubmit,
  skipStep,
}: Props) => {
  const t = useTranslations("Form");

  return (
    <div className="mt-7 flex w-full items-center justify-between">
      <Button
        type="button"
        className={cn(
          !isFirstStep &&
            "border-main-ui-purple text-main-ui-purple hover:text-main-ui-purple hover:bg-main-ui-purple/10 dark:hover:bg-main-ui-purple/20 h-16 w-[164px] rounded-[56px] border text-lg",
        )}
        variant={isFirstStep ? "link" : "outline"}
        onClick={handlePrev}
      >
        {isFirstStep ? t("clear") : t("prevStep")}
      </Button>

      {skipStep && (
        <Button
          type="submit"
          variant="outline"
          className="border-main-ui-purple text-main-ui-purple hover:text-main-ui-purple hover:bg-danger/10 dark:hover:bg-danger/20 h-10 w-[124px] rounded-[56px] border text-lg"
          onClick={skipStep}
        >
          <p>{t("skip")}</p>
        </Button>
      )}

      <Button
        type="submit"
        className="bg-main-ui-purple dark:bg-main-ui-purple dark:hover:bg-main-ui-purple/70 hover:bg-dark-blue h-16 w-[164px] cursor-pointer rounded-[56px] border-0 text-center text-lg transition-all duration-200 dark:text-white"
        onClick={onSubmit}
      >
        {children || t("nextStep")}
      </Button>
    </div>
  );
};

const FormButtonsMemo = memo(FormButtons);

export { FormButtonsMemo as FormButtons };
