"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useModal } from "@/hooks/use-modal";

import { toast } from "sonner";
import { createKBQuestion } from "@/app/(knowledge-base)/api/actions";
import { FormWrapper } from "@/components/my-custom-ui/form-ui-parts/form-wrapper";
import { Button } from "@/components/ui/button";
import { TextareaFormField } from "@/components/my-custom-ui/form-ui-parts/textarea-form-field";
import {
  KBQuestionSchema,
  type KBQuestionType,
} from "@/types/knowledge-base-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { KBQuestionIn } from "@/orval_api/model";
import { useSession } from "next-auth/react";
import { checkIfOwner } from "@/middleware";

const CustomModal = dynamic(
  () => import("@/components/my-custom-ui/custom-modal"),
  {
    ssr: false,
  },
);

type Props = {
  technologyKey: string;
};

export const AddNewQuestionForm = ({ technologyKey }: Props) => {
  const router = useRouter();
  const session = useSession();
  const { isOpen, open, close } = useModal();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<KBQuestionType>({
    resolver: zodResolver(KBQuestionSchema),
    defaultValues: {
      question: "",
      technology_key: technologyKey,
    },
  });

  const onSubmit = async (data: KBQuestionIn) => {
    const response = await createKBQuestion(data);

    if (response.status === 201) {
      reset();
      close();
      toast.success(response?.message);
      router.refresh();
      return;
    }

    if (response.status === 400) {
      toast.error(response?.message);
      return;
    }

    toast.error(`Error status: ${response.status}`);
  };

  return (
    <>
      {checkIfOwner(session.data?.user.role) && (
        <div>
          <Button onClick={() => open()}>Add Question</Button>
        </div>
      )}

      <CustomModal isOpen={isOpen} onClose={close}>
        <FormWrapper
          onSubmit={handleSubmit(onSubmit)}
          isSubmitting={isSubmitting}
        >
          <TextareaFormField
            label="Question"
            name="question"
            register={register}
            error={errors.question}
          />
        </FormWrapper>
      </CustomModal>
    </>
  );
};
