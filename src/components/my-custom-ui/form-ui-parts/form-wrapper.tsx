import { Button } from "@/components/ui/button";
import { FormEventHandler } from "react";
import { Spinner } from "../spinner";

type Props = {
  children: React.ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
  isSubmitting: boolean;
  buttonTitle?: string;
};
export const FormWrapper = ({
  children,
  onSubmit,
  isSubmitting,
  buttonTitle,
}: Props) => {
  return (
    <div className="flex justify-center font-bold">
      <form onSubmit={onSubmit} className="flex flex-col items-center gap-6">
        {children}

        {!isSubmitting ? (
          <Button
            type="submit"
            className="bg-main-ui-purple hover:bg-dark-blue mt-7 h-12 w-[164px] cursor-pointer rounded-[56px] border-0 text-center text-lg transition-all duration-200"
          >
            {buttonTitle || "Submit"}
          </Button>
        ) : (
          <Spinner />
        )}
      </form>
    </div>
  );
};
