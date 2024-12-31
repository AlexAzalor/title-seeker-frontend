"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { FormField } from "./form-field";
import { TypeActorScheme } from "@/types/general";
import { ActorScheme } from "@/types/zod-scheme";
import { useRouter } from "next/navigation";
import { addNewDirector } from "@/app/actions";
import { toast } from "sonner";
import { BodyAPICreateActor, DirectorOut } from "@/orval_api/model";
import { formatKey } from "@/lib/utils";

type Props = {
  setDirectorsList: Dispatch<SetStateAction<DirectorOut[]>>;
  // setActorsList: (d: ActorOut[]) => void;
  directorsRef: any;
};

export const AddNewDirector = ({ setDirectorsList, directorsRef }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
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

    console.log("========= DATA form DIRECTOR: ", dataToSend);

    const response = await addNewDirector(dataToSend);

    if (response.status === 201) {
      toast.success(response?.message);
      setDirectorsList((prev) => [...prev, response.newDirector]);
      directorsRef.current.push({
        key: response.newDirector.key,
      });
      // clear form
    }

    if (response.status === 400) {
      toast.error(response?.message);
    }
    router.refresh();
  };

  return (
    <div className="text-textOrange flex items-center gap-3 font-bold">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="box-border h-max w-[320px] rounded-[20px] bg-animeprimary p-5">
          <div className="text-4xl font-semibold text-animeneutral-light">
            Add New Director
          </div>

          <FormField
            type="text"
            label="Key"
            name="key"
            register={register}
            error={errors.key}
            labelWidth={52}
            value={formatKey(watchFields)}
          />

          <FormField
            type="text"
            label="First Name EN"
            name="first_name_en"
            register={register}
            error={errors.first_name_en}
            labelWidth={42}
          />

          <FormField
            type="text"
            label="Last Name EN"
            name="last_name_en"
            register={register}
            error={errors.last_name_en}
            labelWidth={94}
          />

          <FormField
            type="text"
            label="First Name UK"
            name="first_name_uk"
            register={register}
            error={errors.first_name_uk}
            labelWidth={50}
          />
          <FormField
            type="text"
            label="Last Name UK"
            name="last_name_uk"
            register={register}
            error={errors.last_name_uk}
            labelWidth={56}
          />

          <FormField
            type="date"
            label="Born"
            name="born"
            register={register}
            error={errors.born}
            labelWidth={76}
          />

          <FormField
            type="date"
            label="Died"
            name="died"
            register={register}
            error={errors.died}
            labelWidth={126}
          />

          <FormField
            type="text"
            label="Born in (EN)"
            name="born_in_en"
            register={register}
            error={errors.born_in_en}
            labelWidth={94}
          />

          <FormField
            type="text"
            label="Born in (UK)"
            name="born_in_uk"
            register={register}
            error={errors.born_in_uk}
            labelWidth={42}
          />

          <FormField
            type="file"
            label="Avatar"
            name="file"
            register={register}
            error={errors.file}
            labelWidth={42}
          />

          {!isSubmitting ? (
            <button
              type="submit"
              className="bg-buttonBg text-whiteText active:bg-buttonBgDark hover:bg-buttonBgHover hover:shadow-buttonShadow mt-7 h-12 w-full cursor-pointer rounded-xl border-0 text-center text-lg transition-all duration-200 hover:rounded-md hover:text-white"
            >
              Submit
            </button>
          ) : (
            <div>Spinner</div>
          )}
        </div>
      </form>
    </div>
  );
};
