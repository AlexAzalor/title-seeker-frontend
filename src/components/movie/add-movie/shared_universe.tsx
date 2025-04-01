import { Suspense, use, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SharedUniverseFields, SharedUniverseType } from "@/types/zod-scheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { MovieFormContext } from "./movie-form-wizard";
import { FormField } from "../ui/form-field";

import {
  MovieFormData,
  RatingCriterion,
  SharedUniversePreCreateOut,
  UserRatingCriteria,
} from "@/orval_api/model";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { FormButtons } from "../ui/form-buttons";
import { ResponsiveWrapper } from "../ui/responsive-wrapper";
import { ItemsListSelector } from "../ui/items-list-selector";
import dynamic from "next/dynamic";
import { AddNewUniverse } from "../add-movies-parts/add-new-universe";

const ModalMovie = dynamic(() => import("../ui/modal-movie"));

export type MovieKeyFields = Pick<
  MovieFormData,
  "shared_universe_key" | "shared_universe_order"
>;

export type RatingDataOut = {
  rating: number;
  ratingCriterionType: RatingCriterion;
  ratingData: UserRatingCriteria;
};

type Props = {
  shared_universes: SharedUniversePreCreateOut[];
};

export const SharedUniverseForm = ({ shared_universes }: Props) => {
  const [openAddNewUniverseModal, setOpenAddNewUniverseModal] = useState(false);
  const { setMovieFormData, handleNext, clearForm, setSkipSteps } =
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
    console.log("data", data);

    const dataToSend: MovieKeyFields = {
      ...data,
    };

    if (setSkipSteps) {
      setSkipSteps((prev) => prev.filter((step) => step !== 2));
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
      setSkipSteps((prev) => [...prev, 2]);
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
          <div className="grid grid-cols-2 gap-4">
            <Controller
              control={control}
              name="shared_universe_key"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <div>
                  <div>{value}</div>
                  <ResponsiveWrapper title="Select Shared Universe">
                    <ItemsListSelector
                      items={shared_universes}
                      onOpenModal={() => setOpenAddNewUniverseModal(true)}
                      onSelect={(value, key) => onChange(key)}
                      checkIconStyle={[value]}
                    />
                  </ResponsiveWrapper>

                  {error && (
                    <span className="text-red-500">{error.message}</span>
                  )}
                </div>
              )}
            />

            <FormField
              type="text"
              label="Order"
              name="shared_universe_order"
              register={register}
              error={errors.shared_universe_order}
              labelWidth={52}
            />
          </div>

          {!isSubmitting ? (
            <FormButtons handlePrev={clearForm} skipStep={skipStep} />
          ) : (
            <span className="loader"></span>
          )}
        </form>
      </div>

      <Suspense>
        <ModalMovie
          title="Shared Universe"
          open={openAddNewUniverseModal}
          setOpen={setOpenAddNewUniverseModal}
        >
          <AddNewUniverse setValue={setValue} />
        </ModalMovie>
      </Suspense>
    </>
  );
};
