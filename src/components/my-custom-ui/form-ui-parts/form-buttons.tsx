import { memo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  handlePrev?: () => void;
  isFirstStep?: boolean;
  onSubmit?: () => void;
  skipStep?: () => void;
};

const FormButtons = ({
  title,
  handlePrev,
  isFirstStep,
  onSubmit,
  skipStep,
}: Props) => {
  return (
    <div className="mt-7 flex w-full items-center justify-between">
      <Button
        type="button"
        className={cn(
          !isFirstStep &&
            "h-16 w-[164px] rounded-[56px] border border-[#4A3AFF] text-lg text-[#4A3AFF] hover:text-[#4A3AFF]",
        )}
        variant={isFirstStep ? "link" : "outline"}
        onClick={handlePrev}
      >
        {isFirstStep ? "Clear form" : "Previous step"}
      </Button>

      {skipStep && (
        <Button
          type="submit"
          variant="outline"
          className="h-10 w-[124px] rounded-[56px] border border-[#4A3AFF] text-lg text-[#4A3AFF] hover:text-[#4A3AFF]"
          onClick={skipStep}
        >
          <p>Skip</p>
        </Button>
      )}

      <Button
        type="submit"
        className="h-16 w-[164px] cursor-pointer rounded-[56px] border-0 bg-[#4A3AFF] text-center text-lg transition-all duration-200 hover:bg-[#252154] dark:bg-[#4A3AFF] dark:text-white dark:hover:bg-[#362FCC]"
        onClick={onSubmit}
      >
        <p>{title || "Next step"}</p>
      </Button>
    </div>
  );
};

const FormButtonsMemo = memo(FormButtons);

export { FormButtonsMemo as FormButtons };
