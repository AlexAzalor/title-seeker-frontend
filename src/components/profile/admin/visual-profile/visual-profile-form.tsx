"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VisualProfileField, VisualProfileFieldType } from "@/types/zod-scheme";

import { CategoryFormIn } from "@/orval_api/model";
import { formatKey } from "@/lib/utils";
import { FormField } from "@/components/my-custom-ui/form-ui-parts/form-field";
import { TextareaFormField } from "@/components/my-custom-ui/form-ui-parts/textarea-form-field";
import {
  editVisualProfileCategory,
  editVisualProfileCriterion,
} from "@/app/services/admin/visual-profile-apis";
import { Button } from "@/components/ui/button";

type Props = {
  criterion: CategoryFormIn;
  oldCriterionKey: string;
  type: "category" | "criterion";
};

export const VisualProfileCriterionForm = ({
  oldCriterionKey,
  criterion,
  type,
}: Props) => {
  const router = useRouter();
  const t = useTranslations("Form.itemFields");

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
  } = useForm<VisualProfileFieldType>({
    resolver: zodResolver(VisualProfileField),
    defaultValues: {
      ...criterion,
    },
  });

  const watchFields = watch(["name_en"]);

  const onSubmit = async (formData: VisualProfileFieldType) => {
    if (!isDirty) {
      return;
    }

    if (type === "category") {
      const response = await editVisualProfileCategory(oldCriterionKey, {
        ...formData,
        key: formatKey([formData.name_en]),
      });

      if (response.status === 200) {
        toast.success(response?.message);
        router.refresh();
        return;
      }

      toast.error(`Error status: ${response.status}`);
    }

    if (type === "criterion") {
      let key = formatKey([formData.name_en]);
      if (formData.key === "impact") {
        key = formData.key;
      }

      const response = await editVisualProfileCriterion(oldCriterionKey, {
        ...formData,
        key,
      });

      if (response.status === 200) {
        toast.success(response?.message);
        router.refresh();
        return;
      }

      toast.error(`Error status: ${response.status}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center justify-between gap-3 font-bold"
    >
      <FormField
        type="text"
        label={t("key")}
        name="key"
        register={register}
        error={errors.key}
        value={formatKey(watchFields)}
      />

      <FormField
        type="text"
        label={t("nameEn")}
        name="name_en"
        register={register}
        error={errors.name_en}
      />

      <FormField
        type="text"
        label={t("nameUk")}
        name="name_uk"
        register={register}
        error={errors.name_uk}
      />

      <TextareaFormField
        label={t("descriptionEn")}
        name="description_en"
        register={register}
        error={errors.description_en}
        autoResize={false}
      />

      <TextareaFormField
        label={t("descriptionUk")}
        name="description_uk"
        register={register}
        error={errors.description_uk}
        autoResize={false}
      />

      <Button
        disabled={!isDirty}
        type="submit"
        className="bg-main-ui-purple hover:bg-dark-blue mt-7 h-12 w-[164px] cursor-pointer rounded-2xl border-0 text-center text-lg transition-all duration-200"
      >
        Save
      </Button>
    </form>
  );
};
