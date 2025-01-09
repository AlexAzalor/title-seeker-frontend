"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "./form-field";
import { TypeGenreScheme } from "@/types/general";
import { GenreScheme } from "@/types/zod-scheme";
import { useRouter } from "next/navigation";
import { addNewGenre } from "@/app/actions";
import { toast } from "sonner";
import { BodyAPICreateGenre } from "@/orval_api/model";
import { formatKey } from "@/lib/utils";

type Props = {
  appendGenre: any;
};

export const AddNewGenre = ({ appendGenre }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<TypeGenreScheme>({
    resolver: zodResolver(GenreScheme),
    defaultValues: {
      key: "",
      name_en: "",
    },
  });
  const router = useRouter();

  const watchFields = watch(["name_en"]);

  const onSubmit = async (data: TypeGenreScheme) => {
    const dataToSend: BodyAPICreateGenre = {
      ...data,
    };

    const response = await addNewGenre(dataToSend);

    if (response.status === 201) {
      toast.success(response?.message);
      appendGenre(response.newGenre);
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
            label="name_uk"
            name="name_uk"
            register={register}
            error={errors.name_uk}
            labelWidth={50}
          />

          <FormField
            type="text"
            label="name_en"
            name="name_en"
            register={register}
            error={errors.name_en}
            labelWidth={94}
          />

          <FormField
            type="text"
            label="description_uk"
            name="description_uk"
            register={register}
            error={errors.description_uk}
            labelWidth={94}
          />
          <FormField
            type="text"
            label="description_en"
            name="description_en"
            register={register}
            error={errors.description_en}
            labelWidth={94}
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
