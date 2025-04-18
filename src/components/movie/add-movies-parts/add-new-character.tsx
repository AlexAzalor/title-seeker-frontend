"use client";

import { useRouter } from "next/navigation";
import { useForm, UseFormSetValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { formatKey } from "@/lib/utils";

import { CharacterFields, CharacterType } from "@/types/zod-scheme";
import { createCharacter } from "@/app/actions";
import { CharacterFormIn } from "@/orval_api/model";
import { FormWrapper } from "../ui/form-wrapper";
import { FormField } from "../ui/form-field";
import { PeopleSchemeType } from "../add-movie/people-fields-form";

type Props = {
  setValue: UseFormSetValue<PeopleSchemeType>;
  characterIndexField: number | null;
};

export const AddNewCharacter = ({ setValue, characterIndexField }: Props) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<CharacterType>({
    resolver: zodResolver(CharacterFields),
    defaultValues: {
      key: "",
      name_en: "",
      name_uk: "",
    },
  });

  const watchFields = watch(["name_en"]);

  const onSubmit = async (formData: CharacterFormIn) => {
    const response = await createCharacter(formData);

    if (
      response.status === 201 &&
      response.newItem &&
      // characterIndexField can be 0
      characterIndexField !== null
    ) {
      setValue(
        `actors.${characterIndexField}.character_key`,
        response.newItem!.key,
      );

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
    <FormWrapper onSubmit={handleSubmit(onSubmit)} isSubmitting={isSubmitting}>
      <FormField
        type="text"
        label="Key"
        name="key"
        register={register}
        error={errors.key}
        value={formatKey(watchFields)}
      />

      <FormField
        type="text"
        label="Name En"
        name="name_en"
        register={register}
        error={errors.name_en}
      />

      <FormField
        type="text"
        label="Name Uk"
        name="name_uk"
        register={register}
        error={errors.name_uk}
      />
    </FormWrapper>
  );
};
