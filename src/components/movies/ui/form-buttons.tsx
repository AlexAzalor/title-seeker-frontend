import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  handlePrev?: () => void;
  isFirstStep?: boolean;
  onSubmit?: () => void;
};

export const FormButtons = ({
  title,
  handlePrev,
  isFirstStep,
  onSubmit,
}: Props) => {
  return (
    <div className="mt-7 flex w-full justify-between">
      <Button
        type="button"
        className={cn(
          "h-16 w-[164px] rounded-[56px] border border-[#4A3AFF] text-lg text-[#4A3AFF] hover:text-[#4A3AFF]",
          isFirstStep && "invisible",
        )}
        variant="outline"
        onClick={handlePrev}
      >
        Previous step
      </Button>

      <Button
        type="submit"
        className="h-16 w-[164px] cursor-pointer rounded-[56px] border-0 bg-[#4A3AFF] text-center text-lg transition-all duration-200 hover:bg-[#252154] dark:bg-[#4A3AFF] dark:hover:bg-[#362FCC] dark:hover:text-white"
        onClick={onSubmit}
      >
        <p>{title || "Next step"}</p>
      </Button>
    </div>
  );
};
