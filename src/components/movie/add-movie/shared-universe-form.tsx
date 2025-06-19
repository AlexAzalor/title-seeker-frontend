import { use, useState } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalStorage } from "@/hooks/use-local-storage";

import { MovieFormContext, SU_STEP } from "@/components/movie/add-movie/utils";
import { FormField } from "@/components/my-custom-ui/form-ui-parts/form-field";

import { FormButtons } from "@/components/my-custom-ui/form-ui-parts/form-buttons";
import { ResponsiveWrapper } from "@/components/my-custom-ui/responsive-wrapper";
import { ItemsSelector } from "@/components/my-custom-ui/items-list-selector";
import { Spinner } from "@/components/my-custom-ui/spinner";
import { AddNewUniverse } from "@/components/movie/add-movie/connected-parts/add-new-universe";

import {
  SharedUniverseFields,
  type SharedUniverseType,
} from "@/types/movie-schema";
import type {
  MovieFormData,
  RatingCriterion,
  BaseRatingCriteria,
  BaseSharedUniverse,
} from "@/orval_api/model";

const ModalMovie = dynamic(
  () => import("@/components/my-custom-ui/modal-window"),
  {
    ssr: false,
  },
);

export type MovieKeyFields = Pick<
  MovieFormData,
  "shared_universe_key" | "shared_universe_order"
>;

export type RatingDataOut = {
  rating: number;
  ratingCriterionType: RatingCriterion;
  ratingData: BaseRatingCriteria;
};

type Props = {
  sharedUniverses: BaseSharedUniverse[];
};

export const SharedUniverseForm = ({ sharedUniverses }: Props) => {
  const t = useTranslations("Form.stepper.sharedUniverse");

  const [openAddNewUniverseModal, setOpenAddNewUniverseModal] = useState(false);
  const { setMovieFormData, handleNext, handlePrev, setSkipSteps } =
    use(MovieFormContext);

  const { data: parsedData } = useLocalStorage<MovieFormData>(
    "new-movie-data",
    {} as MovieFormData,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    unregister,
    setValue,
  } = useForm<SharedUniverseType>({
    resolver: zodResolver(SharedUniverseFields),
    defaultValues: {
      shared_universe_key: parsedData.shared_universe_key || "",
      shared_universe_order: parsedData.shared_universe_order || undefined,
    },
  });

  const handleFormData = (dataToSend: MovieKeyFields) => {
    setMovieFormData((prev) => ({
      ...prev,
      form_data: {
        ...prev.form_data,
        ...dataToSend,
      },
    }));

    localStorage.setItem(
      "new-movie-data",
      JSON.stringify({
        ...parsedData,
        ...dataToSend,
      }),
    );

    handleNext();
  };

  const onSubmit = async (data: SharedUniverseType) => {
    const dataToSend: MovieKeyFields = {
      ...data,
    };

    if (setSkipSteps) {
      setSkipSteps((prev) => prev.filter((step) => step !== SU_STEP));
    }

    handleFormData(dataToSend);
  };

  const skipStep = () => {
    unregister(["shared_universe_key", "shared_universe_order"]);

    const dataToSend: MovieKeyFields = {
      shared_universe_key: "",
      shared_universe_order: undefined,
    };

    if (setSkipSteps) {
      setSkipSteps((prev) => [...prev, SU_STEP]);
    }

    handleFormData(dataToSend);
  };

  return (
    <>
      <div className="text-textOrange flex items-center justify-center gap-3 font-bold">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col items-center gap-2"
        >
          <div className="grid grid-cols-2 items-center gap-4">
            <Controller
              control={control}
              name="shared_universe_key"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <div className="relative">
                  <ResponsiveWrapper
                    title={
                      sharedUniverses
                        .find((e) => e.key === value)
                        ?.name.slice(0, 20) || t("name")
                    }
                  >
                    <ItemsSelector
                      items={sharedUniverses}
                      onOpenModal={() => setOpenAddNewUniverseModal(true)}
                      onSelect={({ key }) => onChange(key)}
                      checkIconStyle={[value]}
                    />
                  </ResponsiveWrapper>

                  {error && (
                    <div className="absolute text-red-500">{error.message}</div>
                  )}
                </div>
              )}
            />

            <FormField
              type="text"
              label={t("order")}
              name="shared_universe_order"
              register={register}
              error={errors.shared_universe_order}
            />
          </div>

          {!isSubmitting ? (
            <FormButtons handlePrev={handlePrev} skipStep={skipStep} />
          ) : (
            <Spinner />
          )}
        </form>
      </div>

      {openAddNewUniverseModal && (
        <ModalMovie
          title={t("addNewSU")}
          open={openAddNewUniverseModal}
          setOpen={setOpenAddNewUniverseModal}
        >
          <AddNewUniverse setValue={setValue} />
        </ModalMovie>
      )}
    </>
  );
};
