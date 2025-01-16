"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TypeActorScheme } from "@/types/general";
import { ActorScheme } from "@/types/zod-scheme";
import { useRouter } from "next/navigation";
import { addNewActor } from "@/app/actions";
import { toast } from "sonner";
import { BodyAPICreateActor } from "@/orval_api/model";
import { formatKey } from "@/lib/utils";
import { MovieFormField } from "./movie-form-field";
import { FormWrapper } from "./ui/form-wrapper";

type Props = {
  appendActor: any;
};

export const AddNewActor = ({ appendActor }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<TypeActorScheme>({
    resolver: zodResolver(ActorScheme),
    defaultValues: {
      key: "",
      first_name_en: "",
      last_name_en: "",
    },
  });
  const router = useRouter();

  const watchFields = watch(["first_name_en", "last_name_en"]);

  const onSubmit = async (data: TypeActorScheme) => {
    const dataToSend: BodyAPICreateActor = {
      ...data,
      file: data.file[0],
    };

    const response = await addNewActor(dataToSend);

    if (response.status === 201) {
      toast.success(response?.message);
      appendActor({
        name: response.newActor.name,
        key: response.newActor.key,
        character_key: "",
      });

      // clear form
    }

    if (response.status === 400) {
      toast.error(response?.message);
    }
    router.refresh();
  };

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)} isSubmitting={isSubmitting}>
      <MovieFormField
        type="text"
        label="Key"
        name="key"
        register={register}
        error={errors.key}
        value={formatKey(watchFields)}
      />

      <MovieFormField
        type="text"
        label="First Name EN"
        name="first_name_en"
        register={register}
        error={errors.first_name_en}
      />

      <MovieFormField
        type="text"
        label="Last Name EN"
        name="last_name_en"
        register={register}
        error={errors.last_name_en}
      />

      <MovieFormField
        type="text"
        label="First Name UK"
        name="first_name_uk"
        register={register}
        error={errors.first_name_uk}
      />

      <MovieFormField
        type="text"
        label="Last Name UK"
        name="last_name_uk"
        register={register}
        error={errors.last_name_uk}
      />

      <MovieFormField
        type="date"
        label="Born"
        name="born"
        register={register}
        error={errors.born}
      />

      <MovieFormField
        type="date"
        label="Died"
        name="died"
        register={register}
        error={errors.died}
      />

      <MovieFormField
        type="text"
        label="Born in (EN)"
        name="born_in_en"
        register={register}
        error={errors.born_in_en}
      />

      <MovieFormField
        type="text"
        label="Born in (UK)"
        name="born_in_uk"
        register={register}
        error={errors.born_in_uk}
      />

      <MovieFormField
        type="file"
        label="Avatar"
        name="file"
        register={register}
        error={errors.file}
      />
    </FormWrapper>
  );
};
