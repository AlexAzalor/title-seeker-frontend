"use client";

import { useForm, UseFormSetValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CharacterFields, CharacterType } from "@/types/zod-scheme";
import { useRouter } from "next/navigation";
import { addNewCharacter } from "@/app/actions";
import { toast } from "sonner";
import { BodyAPICreateCharacter } from "@/orval_api/model";
import { formatKey } from "@/lib/utils";
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

  const onSubmit = async (data: CharacterType) => {
    console.log("data", data);

    const dataToSend: BodyAPICreateCharacter = {
      ...data,
    };

    const response = await addNewCharacter(dataToSend);

    console.log("response", response);

    if (response && response.status === 201) {
      toast.success(response?.message);

      if (characterIndexField !== null) {
        setValue(
          `actors.${characterIndexField}.character_key`,
          response.newItem!.key,
        );
      }
      // clear form
    }

    if (response.status === 400) {
      toast.error(response?.message);
    }
    router.refresh();
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
        label="name_en"
        name="name_en"
        register={register}
        error={errors.name_en}
      />

      <FormField
        type="text"
        label="name_uk"
        name="name_uk"
        register={register}
        error={errors.name_uk}
      />
    </FormWrapper>
  );
};
