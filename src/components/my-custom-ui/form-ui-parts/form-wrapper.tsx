import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/my-custom-ui/spinner";
import type { FormEventHandler } from "react";

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

        <Button
          type="submit"
          className="bg-main-ui-purple hover:bg-dark-blue mt-7 h-12 w-41 cursor-pointer rounded-[56px] border-0 text-center text-lg transition-all duration-200"
        >
          {!isSubmitting ? buttonTitle || "Submit" : <Spinner />}
        </Button>
      </form>
    </div>
  );
};
