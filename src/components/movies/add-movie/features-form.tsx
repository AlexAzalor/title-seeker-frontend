import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  ActionTimeOut,
  KeywordOut,
  MovieFormData,
  SpecificationOut,
} from "@/orval_api/model";
import { MovieFeatureList } from "@/types/zod-scheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { use, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { MovieFormContext } from "./movie-form-wizard";
import { AddNewSpecification } from "../add-new-specification";
import { AddNewKeyword } from "../add-new-keyword";
import { AddNewActionTime } from "../add-new-action-time";

type Props = {
  specifications: SpecificationOut[];
  keywords: KeywordOut[];
  actionTimes: ActionTimeOut[];
};

export type MovieInfoFieldNames = Pick<
  MovieFormData,
  "specifications" | "keywords" | "action_times"
>;

export type FeatureSchemeType = z.infer<typeof MovieFeatureList>;

export const FeaturesForm = ({
  specifications,
  keywords,
  actionTimes,
}: Props) => {
  const { setMovieFormData, handleNext, handlePrev } = use(MovieFormContext);

  const savedData = localStorage.getItem("new-movie-data");
  const parsedData: MovieFormData = JSON.parse(savedData || "{}");

  const [openSpecificationFormModal, setOpenSpecificationFormModal] =
    useState(false);
  const [openKeywordFormModal, setOpenKeywordFormModal] = useState(false);
  const [openActionTimeFormModal, setOpenActionTimeFormModal] = useState(false);
  const [openSpec, setOpenSpec] = useState(false);
  const [openKeywords, setOpenKeywords] = useState(false);
  const [openActionTimes, setOpenActionTimes] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(MovieFeatureList),
    defaultValues: {
      specifications: parsedData.specifications || [
        {
          name: "",
          key: "",
          percentage_match: 0,
        },
      ],
      keywords: parsedData.keywords || [
        {
          name: "",
          key: "",
          percentage_match: 0,
        },
      ],
      action_times: parsedData.action_times || [
        {
          name: "",
          key: "",
          percentage_match: 0,
        },
      ],
    },
  });

  const {
    fields: specificationFields,
    append: appendSpecification,
    remove: removeSpecification,
  } = useFieldArray({
    control,
    name: "specifications",
  });

  const {
    fields: keywordFields,
    append: appendKeyword,
    remove: removeKeyword,
  } = useFieldArray({
    control,
    name: "keywords",
  });

  const {
    fields: actionTimeFields,
    append: appendActionTime,
    remove: removeActionTimes,
  } = useFieldArray({
    control,
    name: "action_times",
  });

  const onSubmit = (data: FeatureSchemeType) => {
    const dataToSend: MovieInfoFieldNames = {
      specifications: data.specifications,
      keywords: data.keywords,
      action_times: data.action_times,
    };

    setMovieFormData((prev) => ({
      ...prev,
      form_data: {
        ...parsedData,
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

  return (
    <>
      <div className="text-textOrange flex items-center gap-3 font-bold">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <h2>specifications</h2>
          {specificationFields.map((field, index) => (
            <div key={field.id}>
              <input {...register(`specifications.${index}.name`)} disabled />
              <input
                {...register(`specifications.${index}.percentage_match`)}
                placeholder="Percentage match"
              />

              <button
                type="button"
                onClick={() => {
                  removeSpecification(index);
                }}
              >
                Remove Actor
              </button>
              {errors.specifications?.[index]?.name && (
                <p>{errors.specifications[index].name.message}</p>
              )}
            </div>
          ))}

          <Popover open={openSpec} onOpenChange={setOpenSpec}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                // aria-expanded={openSpec}
                className="h-max w-max justify-between"
              >
                {"Select specification..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search specifications..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>
                    No specification found.{" "}
                    {/* after add set value from this input to form's input */}
                    <Button
                      variant="link"
                      onClick={() => setOpenSpecificationFormModal(true)}
                    >
                      Add?
                    </Button>
                  </CommandEmpty>

                  <TooltipProvider>
                    <CommandGroup className="text-left">
                      {/* need switch lang to search actors */}
                      {specifications.map((specification) => (
                        <CommandItem
                          key={specification.key}
                          value={specification.name}
                          onSelect={(currentValue) => {
                            console.log("currentValue", currentValue);

                            if (
                              !specificationFields.find(
                                (specificationPrev) =>
                                  specificationPrev.key === specification.key,
                              )
                            ) {
                              appendSpecification({
                                name: currentValue,
                                percentage_match: 0,
                                key: specification.key,
                              });
                            } else {
                              removeSpecification(
                                specificationFields.findIndex(
                                  (specificationPrev) =>
                                    specificationPrev.key === specification.key,
                                ),
                              );
                            }
                          }}
                        >
                          <Tooltip>
                            <TooltipTrigger className="text-left">
                              {specification.name}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{"Some short info?"}</p>
                            </TooltipContent>
                          </Tooltip>
                          {/* {specification.name} */}
                          <Check
                            className={cn(
                              "ml-auto",
                              specificationFields
                                .map(
                                  (specificationPrev) => specificationPrev.key,
                                )
                                .includes(specification.key)
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </TooltipProvider>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <h2>Keyword</h2>
          {keywordFields.map((field, index) => (
            <div key={field.id}>
              <input {...register(`keywords.${index}.name`)} disabled />
              <input
                {...register(`keywords.${index}.percentage_match`)}
                placeholder="Percentage match"
              />

              <button
                type="button"
                onClick={() => {
                  removeKeyword(index);
                }}
              >
                Remove Actor
              </button>
              {errors.keywords?.[index]?.name && (
                <p>{errors.keywords[index].name.message}</p>
              )}
            </div>
          ))}

          <Popover open={openKeywords} onOpenChange={setOpenKeywords}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                className="h-max w-max justify-between"
              >
                {"Select keyword..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search keywords..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>
                    No keyword found.{" "}
                    {/* after add set value from this input to form's input */}
                    <Button
                      variant="link"
                      onClick={() => setOpenKeywordFormModal(true)}
                    >
                      Add?
                    </Button>
                  </CommandEmpty>

                  <TooltipProvider>
                    <CommandGroup className="text-left">
                      {/* need switch lang to search actors */}
                      {keywords.map((keyword) => (
                        <CommandItem
                          key={keyword.key}
                          value={keyword.name}
                          onSelect={(currentValue) => {
                            console.log("currentValue", currentValue);

                            if (
                              !keywordFields.find(
                                (keywordPrev) =>
                                  keywordPrev.key === keyword.key,
                              )
                            ) {
                              appendKeyword({
                                name: currentValue,
                                percentage_match: 0,
                                key: keyword.key,
                              });
                            } else {
                              removeKeyword(
                                keywordFields.findIndex(
                                  (keywordPrev) =>
                                    keywordPrev.key === keyword.key,
                                ),
                              );
                            }
                          }}
                        >
                          <Tooltip>
                            <TooltipTrigger className="text-left">
                              {keyword.name}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{"Some short info?"}</p>
                            </TooltipContent>
                          </Tooltip>

                          <Check
                            className={cn(
                              "ml-auto",
                              keywordFields
                                .map((keywordPrev) => keywordPrev.key)
                                .includes(keyword.key)
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </TooltipProvider>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <h2>Action Times</h2>
          {actionTimeFields.map((field, index) => (
            <div key={field.id}>
              <input {...register(`action_times.${index}.name`)} disabled />
              <input
                {...register(`action_times.${index}.percentage_match`)}
                placeholder="Percentage match"
              />

              <button
                type="button"
                onClick={() => {
                  removeActionTimes(index);
                }}
              >
                Remove Actor
              </button>
              {errors.action_times?.[index]?.name && (
                <p>{errors.action_times[index].name.message}</p>
              )}
            </div>
          ))}

          <Popover open={openActionTimes} onOpenChange={setOpenActionTimes}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                className="h-max w-max justify-between"
              >
                {"Select keyword..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search keywords..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>
                    No keyword found.{" "}
                    {/* after add set value from this input to form's input */}
                    <Button
                      variant="link"
                      onClick={() => setOpenActionTimeFormModal(true)}
                    >
                      Add?
                    </Button>
                  </CommandEmpty>

                  <TooltipProvider>
                    <CommandGroup className="text-left">
                      {/* need switch lang to search actors */}
                      {actionTimes.map((actionTime) => (
                        <CommandItem
                          key={actionTime.key}
                          value={actionTime.name}
                          onSelect={(currentValue) => {
                            console.log("currentValue", currentValue);

                            if (
                              !actionTimeFields.find(
                                (actionTimePrev) =>
                                  actionTimePrev.key === actionTime.key,
                              )
                            ) {
                              appendActionTime({
                                name: currentValue,
                                percentage_match: 0,
                                key: actionTime.key,
                              });
                            } else {
                              removeActionTimes(
                                actionTimeFields.findIndex(
                                  (actionTimePrev) =>
                                    actionTimePrev.key === actionTime.key,
                                ),
                              );
                            }
                          }}
                        >
                          <Tooltip>
                            <TooltipTrigger className="text-left">
                              {actionTime.name}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{"Some short info?"}</p>
                            </TooltipContent>
                          </Tooltip>

                          <Check
                            className={cn(
                              "ml-auto",
                              actionTimeFields
                                .map((actionTimePrev) => actionTimePrev.key)
                                .includes(actionTime.key)
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </TooltipProvider>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Button
            type="submit"
            className="mt-7 h-12 w-full cursor-pointer rounded-xl border-0 text-center text-lg transition-all duration-200 hover:rounded-md"
          >
            Submit
          </Button>

          <Button type="button" variant="link" onClick={handlePrev}>
            back
          </Button>
        </form>
      </div>

      <Dialog
        open={openSpecificationFormModal}
        onOpenChange={setOpenSpecificationFormModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Director</DialogTitle>
            <AddNewSpecification appendSpecification={appendSpecification} />
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openKeywordFormModal}
        onOpenChange={setOpenKeywordFormModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Keyword</DialogTitle>
            <AddNewKeyword appendKeyword={appendKeyword} />
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openActionTimeFormModal}
        onOpenChange={setOpenActionTimeFormModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Action Time</DialogTitle>
            <AddNewActionTime appendActionTime={appendActionTime} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
