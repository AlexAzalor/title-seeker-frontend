import { Button } from "@/components/ui/button";
import { FormEventHandler } from "react";

type Props = {
  children: React.ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
  isSubmitting: boolean;
};
export const FormWrapper = ({ children, onSubmit, isSubmitting }: Props) => {
  return (
    <div className="flex justify-center font-bold">
      <form onSubmit={onSubmit} className="flex flex-col items-center gap-2">
        {children}

        {!isSubmitting ? (
          <Button
            type="submit"
            className="mt-7 h-12 w-[164px] cursor-pointer rounded-[56px] border-0 bg-[#4A3AFF] text-center text-lg transition-all duration-200 hover:bg-[#252154]"
          >
            Add
          </Button>
        ) : (
          <div>
            <span className="loader"></span>
          </div>
        )}
      </form>
    </div>
  );
};
