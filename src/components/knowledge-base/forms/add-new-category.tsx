"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useModal } from "@/hooks/use-modal";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createKBCategory } from "@/app/(knowledge-base)/api/actions";
import { FormField } from "@/components/my-custom-ui/form-ui-parts/form-field";
import { FormWrapper } from "@/components/my-custom-ui/form-ui-parts/form-wrapper";
import { TextareaFormField } from "@/components/my-custom-ui/form-ui-parts/textarea-form-field";
import { Button } from "@/components/ui/button";
import { formatKey } from "@/lib/utils";
import type { KBCategoryOut } from "@/orval_api/model";
import {
  KBCategorySchema,
  type KBCategoryType,
} from "@/types/knowledge-base-schema";
import { useSession } from "next-auth/react";
import { checkIfOwner } from "@/middleware";

const CustomModal = dynamic(
  () => import("@/components/my-custom-ui/custom-modal"),
  {
    ssr: false,
  },
);
export const AddNewCategoryForm = () => {
  const router = useRouter();
  const session = useSession();
  const { isOpen, open, close } = useModal();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<KBCategoryType>({
    resolver: zodResolver(KBCategorySchema),
    defaultValues: {
      key: "",
      name: "",
    },
  });

  const watchFields = watch(["name"]);

  const onSubmit = async (data: KBCategoryOut) => {
    const response = await createKBCategory(data);

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
        <div className="mb-2 text-center">
          <Button onClick={() => open()}>Add category</Button>
        </div>
      )}

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
