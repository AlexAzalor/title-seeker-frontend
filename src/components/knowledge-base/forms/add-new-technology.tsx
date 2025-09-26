"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useModal } from "@/hooks/use-modal";

import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { createKBTechnology } from "@/app/(knowledge-base)/api/actions";
import { FormField } from "@/components/my-custom-ui/form-ui-parts/form-field";
import { FormWrapper } from "@/components/my-custom-ui/form-ui-parts/form-wrapper";
import { TextareaFormField } from "@/components/my-custom-ui/form-ui-parts/textarea-form-field";
import { Button } from "@/components/ui/button";
import { formatKey } from "@/lib/utils";
import {
  KBTechnologySchema,
  type KBTechnologyType,
} from "@/types/knowledge-base-schema";
import type { KBTechnologyIn } from "@/orval_api/model";

const CustomModal = dynamic(
  () => import("@/components/my-custom-ui/custom-modal"),
  {
    ssr: false,
  },
);

type Props = {
  categoryKey: string;
};

export const AddNewTechnologyForm = ({ categoryKey }: Props) => {
  const router = useRouter();
  const { isOpen, open, close } = useModal();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<KBTechnologyType>({
    resolver: zodResolver(KBTechnologySchema),
    defaultValues: {
      key: "",
      name: "",
      category_key: categoryKey,
    },
  });

  const watchFields = watch(["name"]);

  const onSubmit = async (data: KBTechnologyIn) => {
    const response = await createKBTechnology({
      ...data,
      category_key: categoryKey,
    });

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
      <div className="my-2 text-center">
        <Button onClick={() => open()}>Add technology</Button>
      </div>

      <CustomModal isOpen={isOpen} onClose={close}>
        <FormWrapper
          onSubmit={handleSubmit(onSubmit)}
          isSubmitting={isSubmitting}
        >
          <FormField
            type="text"
            label="key"
            name="key"
            register={register}
            error={errors.key}
            value={formatKey(watchFields)}
          />

          <FormField
            type="text"
            label="Name"
            name="name"
            register={register}
            error={errors.name}
          />

          <TextareaFormField
            label="Description"
            name="description"
            register={register}
            error={errors.description}
          />
        </FormWrapper>
      </CustomModal>
    </>
  );
};
