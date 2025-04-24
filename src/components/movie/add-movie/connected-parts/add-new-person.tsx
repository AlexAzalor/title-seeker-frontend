"use client";

import { useRouter } from "next/navigation";
import { UseFieldArrayAppend, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { PersonScheme, PersonSchemeType } from "@/types/zod-scheme";
import { ActorOut, DirectorOut, PersonForm } from "@/orval_api/model";
import { formatKey } from "@/lib/utils";
import { FormField } from "@/components/my-custom-ui/form-ui-parts/form-field";
import { FormWrapper } from "@/components/my-custom-ui/form-ui-parts/form-wrapper";
import { MovieCrewListScheme } from "@/types/zod-scheme";

type PersonType = "actors" | "directors";

type Props<T extends PersonType> = {
  appendPerson: UseFieldArrayAppend<MovieCrewListScheme, T>;
  type?: T;
  fetchApi: (
    data: PersonForm,
    /**FastAPI handle *file* separately */
    file: Blob,
  ) => Promise<{
    status?: number;
    message?: string;
    newItem?: ActorOut | DirectorOut;
  }>;
};

export const AddNewPerson = ({
  appendPerson,
  type,
  fetchApi,
}: Props<PersonType>) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<PersonSchemeType>({
    resolver: zodResolver(PersonScheme),
    defaultValues: {
      key: "",
      first_name_en: "",
      last_name_en: "",
    },
  });

  const watchFields = watch(["first_name_en", "last_name_en"]);

  const onSubmit = async (formData: PersonSchemeType) => {
    const response = await fetchApi(formData, formData.file[0]);

    if (response.status === 201 && response.newItem) {
      const newItem: {
        name: string;
        key: string;
        character_key?: string;
      } = {
        name: response.newItem.name,
        key: response.newItem.key,
      };

      if (type === "actors") {
        // To set default after adding new actor
        newItem["character_key"] = "";
      }

      appendPerson(newItem);

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
        label="First Name EN"
        name="first_name_en"
        register={register}
        error={errors.first_name_en}
      />

      <FormField
        type="text"
        label="Last Name EN"
        name="last_name_en"
        register={register}
        error={errors.last_name_en}
      />

      <FormField
        type="text"
        label="First Name UK"
        name="first_name_uk"
        register={register}
        error={errors.first_name_uk}
      />

      <FormField
        type="text"
        label="Last Name UK"
        name="last_name_uk"
        register={register}
        error={errors.last_name_uk}
      />

      <FormField
        type="date"
        label="Born"
        name="born"
        register={register}
        error={errors.born}
      />

      <FormField
        type="date"
        label="Died"
        name="died"
        register={register}
        error={errors.died}
      />

      <FormField
        type="text"
        label="Born in (EN)"
        name="born_in_en"
        register={register}
        error={errors.born_in_en}
      />

      <FormField
        type="text"
        label="Born in (UK)"
        name="born_in_uk"
        register={register}
        error={errors.born_in_uk}
      />

      <FormField
        type="file"
        label="Avatar"
        name="file"
        register={register}
        error={errors.file}
      />
    </FormWrapper>
  );
};
